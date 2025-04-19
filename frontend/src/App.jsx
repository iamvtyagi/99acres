import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getWishlist } from "./redux/slices/wishlistSlice";
import { getNotifications } from "./redux/slices/notificationSlice";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Import pages
import Home from "./pages/Home";
import PropertyListing from "./pages/property/PropertyListing";
import PropertyDetail from "./pages/property/PropertyDetail";
import PropertyForm from "./pages/property/PropertyForm";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/user/Dashboard";
import Profile from "./pages/user/Profile";

// Placeholder components - these will be created later
const Wishlist = () => <div className="min-h-screen p-4">Wishlist Page</div>;
const Messages = () => <div className="min-h-screen p-4">Messages Page</div>;
const Notifications = () => (
  <div className="min-h-screen p-4">Notifications Page</div>
);
const NotFound = () => (
  <div className="min-h-screen p-4 text-center">
    <h1 className="text-4xl font-bold text-red-600 mb-4">
      404 - Page Not Found
    </h1>
    <p className="text-xl text-gray-600">
      The page you are looking for does not exist.
    </p>
  </div>
);

function App() {
  const dispatch = useDispatch();

  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // If user is logged in, fetch wishlist and notifications
    if (user) {
      dispatch(getWishlist());
      dispatch(getNotifications());
    }
  }, [dispatch, user]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<PropertyListing />} />
            <Route path="/properties/new" element={<PropertyForm />} />
            <Route path="/properties/edit/:id" element={<PropertyForm />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
