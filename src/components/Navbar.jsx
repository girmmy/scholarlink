import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { FaBars, FaTimes } from "react-icons/fa";
import { auth } from "../config/firebase";
import logo from "../assets/scholarlink-transparent.svg";

function Navbar() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (!auth) {
      console.warn("Firebase auth not initialized");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    if (!auth) {
      console.warn("Firebase auth not initialized");
      return;
    }
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  return (
    <nav className="flex fixed left-0 right-0 z-50 flex-row items-center justify-between p-4 md:p-6 bg-white shadow-md">
      <Link to="/">
        <img src={logo} className="h-8 md:h-10" alt="Scholarlink Logo" />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex justify-content align-items gap-5">
        <Link
          to="/scholarships"
          className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
        >
          Scholarships
        </Link>
        <Link
          to="/calendar"
          className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
        >
          Calendar
        </Link>
        <Link
          to="/references"
          className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
        >
          References
        </Link>
        <Link
          to="/contact"
          className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
        >
          Contact
        </Link>
        {user ? (
          <div className="relative group">
            <Link to="/profile" className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm hover:ring-2 hover:ring-secondary transition-all cursor-pointer">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getInitials(user.displayName || user.email || "User")
                )}
              </div>
            </Link>
            {/* Dropdown menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="py-2">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.displayName || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  View Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center text-gray-700 border-black-100 rounded-4xl hover:text-blue-600"
          >
            <button className="hover:bg-gradient1 bg-white hover:text-white hover:outline-none transition-all duration-200 border-black-100 rounded-2xl px-4 py-2 outline text-black">
              Login
            </button>
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden text-gray-700 hover:text-blue-600 transition-colors"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden z-40">
          <div className="flex flex-col p-4 gap-4">
            <Link
              to="/scholarships"
              className="text-gray-700 hover:text-blue-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Scholarships
            </Link>
            <Link
              to="/calendar"
              className="text-gray-700 hover:text-blue-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Calendar
            </Link>
            <Link
              to="/references"
              className="text-gray-700 hover:text-blue-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              References
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-blue-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-blue-600 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="text-left text-gray-700 hover:text-blue-600 transition-colors py-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <button className="hover:bg-gradient1 bg-white hover:text-white hover:outline-none transition-all duration-200 border-black-100 rounded-2xl px-4 py-2 outline text-black w-full">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
