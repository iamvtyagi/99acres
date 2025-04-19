import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const SearchFilter = ({ initialValues = {} }) => {
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState({
    keyword: initialValues.keyword || '',
    status: initialValues.status || 'sale',
    type: initialValues.type || '',
    city: initialValues.city || '',
    minPrice: initialValues.minPrice || '',
    maxPrice: initialValues.maxPrice || '',
    bedrooms: initialValues.bedrooms || '',
    bathrooms: initialValues.bathrooms || '',
  });
  
  const [advancedFilters, setAdvancedFilters] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Build query string from filters
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        queryParams.append(key, filters[key]);
      }
    });
    
    // Navigate to properties page with filters
    navigate(`/properties?${queryParams.toString()}`);
  };
  
  const toggleAdvancedFilters = () => {
    setAdvancedFilters(!advancedFilters);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Keyword Search */}
          <div className="md:col-span-2">
            <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                id="keyword"
                name="keyword"
                value={filters.keyword}
                onChange={handleChange}
                placeholder="Enter location, property name, etc."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 pl-10"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          
          {/* Property Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
          </div>
          
          {/* Property Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Property Type
            </label>
            <select
              id="type"
              name="type"
              value={filters.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="flat">Flat/Apartment</option>
              <option value="house">House/Villa</option>
              <option value="plot">Plot/Land</option>
              <option value="commercial">Commercial</option>
              <option value="office">Office Space</option>
              <option value="shop">Shop/Showroom</option>
            </select>
          </div>
        </div>
        
        {/* Advanced Filters */}
        {advancedFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* City */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <select
                id="city"
                name="city"
                value={filters.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Cities</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Chennai">Chennai</option>
                <option value="Pune">Pune</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Ahmedabad">Ahmedabad</option>
              </select>
            </div>
            
            {/* Min Price */}
            <div>
              <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Min Price
              </label>
              <select
                id="minPrice"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">No Min</option>
                <option value="500000">₹ 5 Lac</option>
                <option value="1000000">₹ 10 Lac</option>
                <option value="2000000">₹ 20 Lac</option>
                <option value="3000000">₹ 30 Lac</option>
                <option value="5000000">₹ 50 Lac</option>
                <option value="10000000">₹ 1 Cr</option>
                <option value="20000000">₹ 2 Cr</option>
                <option value="50000000">₹ 5 Cr</option>
              </select>
            </div>
            
            {/* Max Price */}
            <div>
              <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Max Price
              </label>
              <select
                id="maxPrice"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">No Max</option>
                <option value="1000000">₹ 10 Lac</option>
                <option value="2000000">₹ 20 Lac</option>
                <option value="3000000">₹ 30 Lac</option>
                <option value="5000000">₹ 50 Lac</option>
                <option value="10000000">₹ 1 Cr</option>
                <option value="20000000">₹ 2 Cr</option>
                <option value="50000000">₹ 5 Cr</option>
                <option value="100000000">₹ 10 Cr</option>
              </select>
            </div>
            
            {/* Bedrooms */}
            <div>
              <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                Bedrooms
              </label>
              <select
                id="bedrooms"
                name="bedrooms"
                value={filters.bedrooms}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <button
            type="button"
            onClick={toggleAdvancedFilters}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4 md:mb-0"
          >
            {advancedFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
          </button>
          
          <button
            type="submit"
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium"
          >
            Search Properties
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchFilter;
