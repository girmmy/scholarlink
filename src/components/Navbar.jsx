import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";
import { FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="flex fixed left-0 right-0 z-50 flex-row items-center justify-between p-4 md:p-6 bg-white shadow-md">
      <Link to="/">
        <img src={logo} className="h-8 md:h-10" alt="Scholarlink Logo" />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex justify-content align-items gap-5">
        <Link
          to="/profile"
          className="flex items-center text-gray-950 hover:text-blue-600 transition-colors"
        >
          Profile
        </Link>
        <Link
          to="/scholarships"
          className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
        >
          Scholarships
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
        <Link
          to="/sign-up"
          className="flex items-center text-gray-700 border-black-100 rounded-4xl hover:text-blue-600"
        >
          <button className="hover:bg-gradient1 bg-white hover:text-white hover:outline-none transition-all duration-200 border-black-100 rounded-2xl px-4 py-2 outline text-black">
            Signup/Login
          </button>
        </Link>
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
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden">
          <div className="flex flex-col p-4 gap-4">
            <Link
              to="/profile"
              className="text-gray-950 hover:text-blue-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
            <Link
              to="/scholarships"
              className="text-gray-700 hover:text-blue-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Scholarships
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
            <Link
              to="/sign-up"
              className="py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <button className="hover:bg-gradient1 bg-white hover:text-white hover:outline-none transition-all duration-200 border-black-100 rounded-2xl px-4 py-2 outline text-black w-full">
                Signup/Login
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
