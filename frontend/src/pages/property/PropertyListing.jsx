import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProperties } from '../../redux/slices/propertySlice';
import SearchFilter from '../../components/common/SearchFilter';
import PropertyCard from '../../components/common/PropertyCard';
import { FaList, FaThLarge, FaSort, FaFilter } from 'react-icons/fa';

const PropertyListing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { properties, isLoading, pagination, totalCount } = useSelector(
    (state) => state.property
  );
  
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Get query params from URL
  const queryParams = new URLSearchParams(location.search);
  const initialFilters = {
    keyword: queryParams.get('keyword') || '',
    status: queryParams.get('status') || '',
    type: queryParams.get('type') || '',
    city: queryParams.get('city') || '',
    minPrice: queryParams.get('minPrice') || '',
    maxPrice: queryParams.get('maxPrice') || '',
    bedrooms: queryParams.get('bedrooms') || '',
    bathrooms: queryParams.get('bathrooms') || '',
    featured: queryParams.get('featured') || '',
  };
  
  // Build query object for API
  const buildQueryObject = () => {
    const query = {};
    
    // Add filters
    Object.keys(initialFilters).forEach((key) => {
      if (initialFilters[key]) {
        query[key] = initialFilters[key];
      }
    });
    
    // Add sorting
    switch (sortOption) {
      case 'newest':
        query.sort = '-createdAt';
        break;
      case 'oldest':
        query.sort = 'createdAt';
        break;
      case 'priceLow':
        query.sort = 'price';
        break;
      case 'priceHigh':
        query.sort = '-price';
        break;
      default:
        query.sort = '-createdAt';
    }
    
    // Add pagination
    query.page = currentPage;
    query.limit = 9;
    
    return query;
  };
  
  useEffect(() => {
    // Fetch properties based on filters and sorting
    dispatch(getProperties(buildQueryObject()));
  }, [dispatch, location.search, sortOption, currentPage]);
  
  // Handle sort change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1); // Reset to first page when sorting changes
  };
  
  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  
  // Toggle view mode
  const toggleViewMode = (mode) => {
    setViewMode(mode);
  };
  
  // Toggle filters on mobile
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile filter button */}
        <div className="md:hidden mb-4">
          <button
            onClick={toggleFilters}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <FaFilter className="mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters - Desktop (always visible) and Mobile (toggleable) */}
          <div
            className={`${
              showFilters ? 'block' : 'hidden'
            } md:block w-full md:w-1/4 bg-white rounded-lg shadow-md p-4 h-fit`}
          >
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            <SearchFilter initialValues={initialFilters} />
          </div>
          
          {/* Property Listings */}
          <div className="w-full md:w-3/4">
            {/* Results header */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="mb-4 sm:mb-0">
                  <h1 className="text-xl font-semibold text-gray-900">
                    {totalCount} Properties Found
                  </h1>
                  <p className="text-sm text-gray-500">
                    {initialFilters.city
                      ? `in ${initialFilters.city}`
                      : 'across India'}
                  </p>
                </div>
                
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  {/* Sort dropdown */}
                  <div className="relative w-full sm:w-auto">
                    <div className="flex items-center">
                      <FaSort className="text-gray-400 mr-2" />
                      <select
                        value={sortOption}
                        onChange={handleSortChange}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="priceLow">Price: Low to High</option>
                        <option value="priceHigh">Price: High to Low</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* View mode toggle */}
                  <div className="hidden sm:flex border border-gray-300 rounded-md">
                    <button
                      onClick={() => toggleViewMode('grid')}
                      className={`p-2 ${
                        viewMode === 'grid'
                          ? 'bg-blue-100 text-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <FaThLarge className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => toggleViewMode('list')}
                      className={`p-2 ${
                        viewMode === 'list'
                          ? 'bg-blue-100 text-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <FaList className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Properties grid/list */}
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
              <>
                {properties.length > 0 ? (
                  <div
                    className={
                      viewMode === 'grid'
                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                        : 'space-y-6'
                    }
                  >
                    {properties.map((property) => (
                      <PropertyCard
                        key={property._id}
                        property={property}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                      No properties found
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Try adjusting your search filters to find what you're looking for.
                    </p>
                    <button
                      onClick={() => navigate('/properties')}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
                
                {/* Pagination */}
                {pagination && (
                  <div className="mt-8 flex justify-center">
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      {/* Previous page */}
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!pagination.prev}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          pagination.prev
                            ? 'text-gray-500 hover:bg-gray-50'
                            : 'text-gray-300 cursor-not-allowed'
                        }`}
                      >
                        <span className="sr-only">Previous</span>
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      
                      {/* Current page indicator */}
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        Page {currentPage}
                      </span>
                      
                      {/* Next page */}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!pagination.next}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          pagination.next
                            ? 'text-gray-500 hover:bg-gray-50'
                            : 'text-gray-300 cursor-not-allowed'
                        }`}
                      >
                        <span className="sr-only">Next</span>
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyListing;
