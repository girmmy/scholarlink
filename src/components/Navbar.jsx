import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";
function Navbar() {
  return (
    <nav className="flex fixed left-0 right-0 z-50 flex-row items-center justify-between p-6 bg-white shadow-md">
      <Link to="/">
        <img src={logo} className="h-10" alt="Scholarlink Logo" />
      </Link>

      <div className="flex justify-content align-items gap-5">
        <Link
          to="/profile"
          className="flex items-center text-gray-950 hover:text-blue-600"
        >
          Profile
        </Link>
        <Link
          to="/scholarships"
          className="flex items-center text-gray-700 hover:text-blue-600"
        >
          Scholarships
        </Link>
        <Link
          to="/references"
          className="flex items-center text-gray-700 hover:text-blue-600"
        >
          References
        </Link>
        <Link
          to="/contact"
          className="flex items-center text-gray-700 hover:text-blue-600"
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
    </nav>
  );
}

export default Navbar;
