import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaHeart, FaEnvelope, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { getProperties, deleteProperty } from '../../redux/slices/propertySlice';
import { getWishlist } from '../../redux/slices/wishlistSlice';
import { getMessages } from '../../redux/slices/messageSlice';
import PropertyCard from '../../components/common/PropertyCard';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { properties, isLoading: propertiesLoading } = useSelector((state) => state.property);
  const { wishlist, isLoading: wishlistLoading } = useSelector((state) => state.wishlist);
  const { messages, isLoading: messagesLoading } = useSelector((state) => state.message);
  
  const [activeTab, setActiveTab] = useState('properties');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Load user's properties
    if (user.user.role === 'seller' || user.user.role === 'agent' || user.user.role === 'admin') {
      dispatch(getProperties({ ownerId: user.user.id }));
    }
    
    // Load user's wishlist
    dispatch(getWishlist());
    
    // Load user's messages
    dispatch(getMessages());
  }, [dispatch, user, navigate]);

  const handleDeleteProperty = async (id) => {
    try {
      await dispatch(deleteProperty(id)).unwrap();
      setConfirmDelete(null);
      // Refresh properties
      dispatch(getProperties({ ownerId: user.user.id }));
    } catch (error) {
      console.error('Failed to delete property:', error);
    }
  };

  const renderProperties = () => {
    if (propertiesLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (properties.length === 0) {
      return (
        <div className="text-center py-12">
          <FaHome className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No properties yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new property listing.</p>
          <div className="mt-6">
            <Link
              to="/properties/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <FaPlus className="-ml-1 mr-2 h-5 w-5" />
              Add New Property
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">Your Properties</h3>
          <Link
            to="/properties/new"
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <FaPlus className="-ml-0.5 mr-2 h-4 w-4" />
            Add New
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property._id} className="relative">
              <PropertyCard property={property} />
              <div className="absolute top-2 right-2 flex space-x-2">
                <Link
                  to={`/properties/edit/${property._id}`}
                  className="p-2 bg-white rounded-full shadow-md text-blue-600 hover:text-blue-800"
                >
                  <FaEdit />
                </Link>
                <button
                  onClick={() => setConfirmDelete(property._id)}
                  className="p-2 bg-white rounded-full shadow-md text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Delete Confirmation Modal */}
        {confirmDelete && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete this property? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteProperty(confirmDelete)}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderWishlist = () => {
    if (wishlistLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (!wishlist || wishlist.length === 0) {
      return (
        <div className="text-center py-12">
          <FaHeart className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No saved properties</h3>
          <p className="mt-1 text-sm text-gray-500">Properties you save will appear here.</p>
          <div className="mt-6">
            <Link
              to="/properties"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Browse Properties
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-6">Your Wishlist</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <PropertyCard key={item.propertyId._id} property={item.propertyId} />
          ))}
        </div>
      </div>
    );
  };

  const renderMessages = () => {
    if (messagesLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (!messages || messages.length === 0) {
      return (
        <div className="text-center py-12">
          <FaEnvelope className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No messages</h3>
          <p className="mt-1 text-sm text-gray-500">Your messages will appear here.</p>
        </div>
      );
    }

    // Group messages by conversation
    const conversations = {};
    messages.forEach((message) => {
      const otherUser = message.senderId._id === user.user.id ? message.receiverId : message.senderId;
      const conversationId = otherUser._id;
      
      if (!conversations[conversationId]) {
        conversations[conversationId] = {
          user: otherUser,
          messages: [],
        };
      }
      
      conversations[conversationId].messages.push(message);
    });

    return (
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-6">Your Messages</h3>
        <div className="space-y-4">
          {Object.values(conversations).map((conversation) => {
            const latestMessage = conversation.messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
            
            return (
              <Link
                key={conversation.user._id}
                to={`/messages/${conversation.user._id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {conversation.user.profilePhoto ? (
                      <img
                        src={conversation.user.profilePhoto}
                        alt={conversation.user.name}
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 font-medium">
                          {conversation.user.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{conversation.user.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(latestMessage.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {latestMessage.content}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Dashboard Header */}
          <div className="bg-blue-600 p-6">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-blue-100">Manage your properties, wishlist, and messages</p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              {(user.user.role === 'seller' || user.user.role === 'agent' || user.user.role === 'admin') && (
                <button
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === 'properties'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('properties')}
                >
                  My Properties
                </button>
              )}
              <button
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'wishlist'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('wishlist')}
              >
                Wishlist
              </button>
              <button
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'messages'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('messages')}
              >
                Messages
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'properties' && renderProperties()}
            {activeTab === 'wishlist' && renderWishlist()}
            {activeTab === 'messages' && renderMessages()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
