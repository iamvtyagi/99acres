import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">99acres Clone</h3>
            <p className="text-gray-300 text-sm mb-4">
              India's No.1 Property Portal. Find residential and commercial properties for sale, rent and lease.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <FaFacebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <FaTwitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <FaInstagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <FaLinkedin className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <FaYoutube className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/properties" className="text-gray-300 hover:text-white">Buy Property</Link>
              </li>
              <li>
                <Link to="/properties?status=rent" className="text-gray-300 hover:text-white">Rent Property</Link>
              </li>
              <li>
                <Link to="/properties?type=plot" className="text-gray-300 hover:text-white">Plots</Link>
              </li>
              <li>
                <Link to="/properties?type=commercial" className="text-gray-300 hover:text-white">Commercial</Link>
              </li>
              <li>
                <Link to="/properties/new" className="text-gray-300 hover:text-white">Post Property</Link>
              </li>
            </ul>
          </div>
          
          {/* Popular Locations */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Locations</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/properties?city=Mumbai" className="text-gray-300 hover:text-white">Mumbai</Link>
              </li>
              <li>
                <Link to="/properties?city=Delhi" className="text-gray-300 hover:text-white">Delhi</Link>
              </li>
              <li>
                <Link to="/properties?city=Bangalore" className="text-gray-300 hover:text-white">Bangalore</Link>
              </li>
              <li>
                <Link to="/properties?city=Hyderabad" className="text-gray-300 hover:text-white">Hyderabad</Link>
              </li>
              <li>
                <Link to="/properties?city=Chennai" className="text-gray-300 hover:text-white">Chennai</Link>
              </li>
              <li>
                <Link to="/properties?city=Pune" className="text-gray-300 hover:text-white">Pune</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-300">
                <span className="block font-medium">Address:</span>
                <span>123 Main Street, Mumbai, India</span>
              </li>
              <li className="text-gray-300">
                <span className="block font-medium">Phone:</span>
                <span>+91 1234567890</span>
              </li>
              <li className="text-gray-300">
                <span className="block font-medium">Email:</span>
                <span>info@99acresclone.com</span>
              </li>
              <li className="mt-4">
                <Link to="/contact" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              &copy; {new Date().getFullYear()} 99acres Clone. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link to="/terms" className="text-gray-300 hover:text-white text-sm">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-gray-300 hover:text-white text-sm">
                Privacy Policy
              </Link>
              <Link to="/sitemap" className="text-gray-300 hover:text-white text-sm">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
