import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProperty, clearProperty } from '../../redux/slices/propertySlice';
import { addToWishlist, removeFromWishlist } from '../../redux/slices/wishlistSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaPhone, FaEnvelope, FaHeart, FaRegHeart, FaShare, FaEdit, FaTrash } from 'react-icons/fa';
import formatIndianCurrency from '../../utils/formatCurrency';
import formatDate from '../../utils/formatDate';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [activeImage, setActiveImage] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  const { property, isLoading, isError } = useSelector((state) => state.property);
  const { user } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.wishlist);
  
  // Check if property is in wishlist
  const isInWishlist = wishlist?.propertyIds?.some((propertyId) => propertyId === id);
  
  // Check if user is the owner of the property
  const isOwner = user && property && user.user.id === property.ownerId._id;
  
  // Check if user is admin
  const isAdmin = user && user.user.role === 'admin';
  
  // Contact form validation schema
  const contactFormSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
      .required('Phone number is required'),
    message: Yup.string().required('Message is required'),
  });
  
  useEffect(() => {
    // Fetch property details
    dispatch(getProperty(id));
    
    // Cleanup on component unmount
    return () => {
      dispatch(clearProperty());
    };
  }, [dispatch, id]);
  
  // Handle wishlist toggle
  const handleWishlistToggle = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (isInWishlist) {
      dispatch(removeFromWishlist(id));
    } else {
      dispatch(addToWishlist(id));
    }
  };
  
  // Handle share button click
  const handleShare = () => {
    setShowShareOptions(!showShareOptions);
  };
  
  // Handle contact form submission
  const handleContactSubmit = (values, { resetForm }) => {
    // TODO: Implement lead submission
    console.log('Contact form submitted:', values);
    resetForm();
    setShowContactForm(false);
  };
  
  // Handle delete property
  const handleDeleteProperty = () => {
    // TODO: Implement property deletion
    console.log('Delete property:', id);
    setShowConfirmDelete(false);
    navigate('/properties');
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <svg
          className="animate-spin h-12 w-12 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }
  
  if (isError || !property) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Property Not Found</h1>
        <p className="text-gray-600 mb-6">
          The property you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/properties"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Browse Properties
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <Link
                to="/properties"
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                Properties
              </Link>
            </li>
            <li className="flex items-center">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="ml-2 text-gray-700 font-medium truncate">
                {property.title}
              </span>
            </li>
          </ol>
        </nav>
        
        {/* Property Title and Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {property.title}
              </h1>
              <p className="text-gray-600 flex items-center mb-2">
                <FaMapMarkerAlt className="mr-2 text-blue-600" />
                {property.location.address}, {property.location.city}, {property.location.state} - {property.location.pincode}
              </p>
              <div className="flex items-center">
                <span className={`px-2 py-1 text-xs font-semibold rounded ${
                  property.status === 'rent' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>
                  For {property.status === 'rent' ? 'Rent' : 'Sale'}
                </span>
                {property.featured && (
                  <span className="ml-2 px-2 py-1 text-xs font-semibold rounded bg-yellow-100 text-yellow-800">
                    Featured
                  </span>
                )}
                <span className="ml-2 text-sm text-gray-500">
                  Posted on {formatDate(property.createdAt)}
                </span>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-col items-end">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {formatIndianCurrency(property.price)}
                {property.status === 'rent' && <span className="text-sm text-gray-500">/month</span>}
              </div>
              
              <div className="flex space-x-2">
                {/* Wishlist button */}
                <button
                  onClick={handleWishlistToggle}
                  className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {isInWishlist ? (
                    <>
                      <FaHeart className="mr-2 text-red-500" />
                      Saved
                    </>
                  ) : (
                    <>
                      <FaRegHeart className="mr-2" />
                      Save
                    </>
                  )}
                </button>
                
                {/* Share button */}
                <div className="relative">
                  <button
                    onClick={handleShare}
                    className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <FaShare className="mr-2" />
                    Share
                  </button>
                  
                  {/* Share options dropdown */}
                  {showShareOptions && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <div className="py-1">
                        <a
                          href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Facebook
                        </a>
                        <a
                          href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${property.title}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Twitter
                        </a>
                        <a
                          href={`https://wa.me/?text=${property.title} ${window.location.href}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          WhatsApp
                        </a>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            setShowShareOptions(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Copy Link
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Edit/Delete buttons for owner or admin */}
                {(isOwner || isAdmin) && (
                  <>
                    <Link
                      to={`/properties/edit/${property._id}`}
                      className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <FaEdit className="mr-2" />
                      Edit
                    </Link>
                    <button
                      onClick={() => setShowConfirmDelete(true)}
                      className="flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50"
                    >
                      <FaTrash className="mr-2" />
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Property Images and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Property Images */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Main Image */}
              <div className="relative h-96">
                <img
                  src={property.images[activeImage] || 'https://via.placeholder.com/800x600?text=No+Image'}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Thumbnail Images */}
              {property.images.length > 1 && (
                <div className="p-4 flex space-x-2 overflow-x-auto">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden ${
                        activeImage === index ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${property.title} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Property Details and Contact */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Property Details</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">Property Type</span>
                  <span className="font-medium capitalize">{property.type}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">Status</span>
                  <span className="font-medium capitalize">For {property.status}</span>
                </div>
                {property.bedrooms !== undefined && (
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-sm">Bedrooms</span>
                    <span className="font-medium">{property.bedrooms}</span>
                  </div>
                )}
                {property.bathrooms !== undefined && (
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-sm">Bathrooms</span>
                    <span className="font-medium">{property.bathrooms}</span>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">Area</span>
                  <span className="font-medium">{property.size} sq.ft</span>
                </div>
              </div>
              
              {/* Owner/Agent Info */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Contact</h3>
                <div className="flex items-center mb-4">
                  <img
                    src={property.ownerId.profilePhoto || 'https://via.placeholder.com/100?text=User'}
                    alt={property.ownerId.name}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-medium">{property.ownerId.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{property.ownerId.role}</p>
                  </div>
                </div>
                
                {/* Contact buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => setShowContactForm(!showContactForm)}
                    className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <FaEnvelope className="mr-2" />
                    Send Message
                  </button>
                  <a
                    href={`tel:${property.ownerId.mobile}`}
                    className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <FaPhone className="mr-2" />
                    Call Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Property Description and Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
            </div>
            
            {/* Features/Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Features & Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Location Map */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              <div className="h-80 bg-gray-200 rounded-md flex items-center justify-center">
                {/* Placeholder for map - would be replaced with actual map component */}
                <div className="text-center">
                  <FaMapMarkerAlt className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-gray-700">
                    {property.location.address}, {property.location.city}, {property.location.state} - {property.location.pincode}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="lg:col-span-1">
            {showContactForm && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Contact {property.ownerId.name}</h2>
                <Formik
                  initialValues={{
                    name: user ? user.user.name : '',
                    email: user ? user.user.email : '',
                    phone: user ? user.user.mobile : '',
                    message: `I'm interested in this property: ${property.title}`,
                  }}
                  validationSchema={contactFormSchema}
                  onSubmit={handleContactSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <Field
                          type="text"
                          name="name"
                          id="name"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        <ErrorMessage name="name" component="p" className="mt-1 text-sm text-red-600" />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <Field
                          type="email"
                          name="email"
                          id="email"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        <ErrorMessage name="email" component="p" className="mt-1 text-sm text-red-600" />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Phone
                        </label>
                        <Field
                          type="text"
                          name="phone"
                          id="phone"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        <ErrorMessage name="phone" component="p" className="mt-1 text-sm text-red-600" />
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                          Message
                        </label>
                        <Field
                          as="textarea"
                          name="message"
                          id="message"
                          rows={4}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        <ErrorMessage name="message" component="p" className="mt-1 text-sm text-red-600" />
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setShowContactForm(false)}
                          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          {isSubmitting ? 'Sending...' : 'Send Message'}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            )}
            
            {/* Similar Properties */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">Similar Properties</h2>
              <p className="text-gray-500 text-center py-8">
                Similar properties will be shown here
              </p>
            </div>
          </div>
        </div>
        
        {/* Delete Confirmation Modal */}
        {showConfirmDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to delete this property? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProperty}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetail;
