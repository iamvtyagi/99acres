import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaBed, FaBath, FaRulerCombined, FaHeart, FaRegHeart } from 'react-icons/fa';
import { addToWishlist, removeFromWishlist } from '../../redux/slices/wishlistSlice';
import formatIndianCurrency from '../../utils/formatCurrency';
import formatDate from '../../utils/formatDate';

const PropertyCard = ({ property }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.wishlist);
  
  // Check if property is in wishlist
  const isInWishlist = wishlist?.propertyIds?.some(
    (id) => id === property._id
  );
  
  const handleWishlist = () => {
    if (!user) {
      // Redirect to login if not logged in
      return window.location.href = '/login';
    }
    
    if (isInWishlist) {
      dispatch(removeFromWishlist(property._id));
    } else {
      dispatch(addToWishlist(property._id));
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <Link to={`/properties/${property._id}`}>
          <img
            src={property.images[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
            alt={property.title}
            className="w-full h-48 object-cover"
          />
        </Link>
        
        {/* Status badge */}
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 text-xs font-semibold rounded ${
            property.status === 'rent' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
          }`}>
            {property.status === 'rent' ? 'For Rent' : 'For Sale'}
          </span>
        </div>
        
        {/* Featured badge */}
        {property.featured && (
          <div className="absolute top-2 right-10">
            <span className="px-2 py-1 text-xs font-semibold rounded bg-yellow-500 text-white">
              Featured
            </span>
          </div>
        )}
        
        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 p-1 rounded-full bg-white shadow-md hover:bg-gray-100"
        >
          {isInWishlist ? (
            <FaHeart className="h-5 w-5 text-red-500" />
          ) : (
            <FaRegHeart className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </div>
      
      <div className="p-4">
        <Link to={`/properties/${property._id}`}>
          <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
            {property.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-2 truncate">
          {property.location.address}, {property.location.city}
        </p>
        
        <p className="text-blue-600 font-bold text-xl mb-3">
          {formatIndianCurrency(property.price)}
          {property.status === 'rent' && <span className="text-sm text-gray-500">/month</span>}
        </p>
        
        <div className="flex justify-between text-gray-500 text-sm mb-3">
          {property.bedrooms !== undefined && (
            <div className="flex items-center">
              <FaBed className="mr-1" />
              <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
            </div>
          )}
          
          {property.bathrooms !== undefined && (
            <div className="flex items-center">
              <FaBath className="mr-1" />
              <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
            </div>
          )}
          
          <div className="flex items-center">
            <FaRulerCombined className="mr-1" />
            <span>{property.size} sq.ft</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <div className="flex items-center">
            <img
              src={property.ownerId.profilePhoto || 'https://via.placeholder.com/40?text=User'}
              alt={property.ownerId.name}
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="text-sm text-gray-600">{property.ownerId.name}</span>
          </div>
          <span className="text-xs text-gray-500">{formatDate(property.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
