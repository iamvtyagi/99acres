import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProperties } from '../redux/slices/propertySlice';
import SearchFilter from '../components/common/SearchFilter';
import PropertyCard from '../components/common/PropertyCard';
import { FaHome, FaBuilding, FaMapMarkerAlt, FaChartLine } from 'react-icons/fa';

const Home = () => {
  const dispatch = useDispatch();
  const { properties, isLoading } = useSelector((state) => state.property);
  
  // Featured cities
  const featuredCities = [
    { name: 'Mumbai', count: 1245, image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f' },
    { name: 'Delhi', count: 987, image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5' },
    { name: 'Bangalore', count: 1089, image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2' },
    { name: 'Hyderabad', count: 756, image: 'https://images.unsplash.com/photo-1626514086556-6f4b83800606' },
  ];
  
  // Property types
  const propertyTypes = [
    { name: 'Apartments', icon: <FaHome className="h-8 w-8" />, link: '/properties?type=flat' },
    { name: 'Houses & Villas', icon: <FaHome className="h-8 w-8" />, link: '/properties?type=house' },
    { name: 'Plots & Land', icon: <FaMapMarkerAlt className="h-8 w-8" />, link: '/properties?type=plot' },
    { name: 'Commercial', icon: <FaBuilding className="h-8 w-8" />, link: '/properties?type=commercial' },
  ];
  
  useEffect(() => {
    // Fetch featured properties
    dispatch(getProperties({ featured: true, limit: 6 }));
  }, [dispatch]);
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gray-900 h-[500px]">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1973&q=80"
            alt="Hero"
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center justify-center h-full">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl text-center">
            Find Your Dream Property
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-300 text-center">
            Search from over 10,000+ properties across India
          </p>
          
          <div className="mt-10 w-full max-w-4xl">
            <SearchFilter />
          </div>
        </div>
      </div>
      
      {/* Featured Properties */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Properties</h2>
          <Link
            to="/properties?featured=true"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View All
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <svg
              className="animate-spin h-10 w-10 text-blue-600"
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.length > 0 ? (
              properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500 text-lg">No featured properties found.</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Property Types */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Browse by Property Type
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {propertyTypes.map((type, index) => (
              <Link
                key={index}
                to={type.link}
                className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="bg-blue-100 p-4 rounded-full text-blue-600 mb-4">
                  {type.icon}
                </div>
                <h3 className="text-lg font-medium text-gray-900">{type.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* Featured Cities */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Explore Properties by City
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCities.map((city, index) => (
            <Link
              key={index}
              to={`/properties?city=${city.name}`}
              className="group relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-w-3 aspect-h-2">
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-xl font-bold">{city.name}</h3>
                <p className="text-sm">{city.count} properties</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Why Choose Us */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Why Choose Us
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="bg-blue-100 p-4 rounded-full inline-block mb-4">
                <FaHome className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Wide Range of Properties</h3>
              <p className="text-gray-600">
                Explore thousands of properties across India to find your perfect match.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="bg-blue-100 p-4 rounded-full inline-block mb-4">
                <FaMapMarkerAlt className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Verified Listings</h3>
              <p className="text-gray-600">
                All our listings are verified to ensure you get authentic information.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="bg-blue-100 p-4 rounded-full inline-block mb-4">
                <FaChartLine className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Guidance</h3>
              <p className="text-gray-600">
                Get expert advice and support throughout your property journey.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Find Your Dream Property?
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Join thousands of satisfied customers who found their perfect property with us.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/properties"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-lg font-medium"
          >
            Browse Properties
          </Link>
          <Link
            to="/register"
            className="bg-white hover:bg-gray-100 text-blue-600 border border-blue-600 px-6 py-3 rounded-md text-lg font-medium"
          >
            Sign Up Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
