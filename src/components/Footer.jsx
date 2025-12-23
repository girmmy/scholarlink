import React from "react";
import logo from "../assets/logo-transparent.svg";
import {
  FaXTwitter,
  FaYoutube,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa6";
function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-3xl mx-auto px-4 py-6 md:py-0 flex flex-col md:flex-row justify-between items-center min-h-24 gap-6 md:gap-0">
        <div className="w-24 h-24 md:w-36 md:h-36">
          <img className="w-full h-full object-contain" src={logo} alt="logo" />
        </div>

        <div className="flex flex-row gap-4 md:gap-6 items-center">
          <a
            href="https://x.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:-translate-y-1 hover:text-gray-300 transition-all duration-200 cursor-pointer flex items-center"
          >
            <FaXTwitter size={24} className="md:w-7 md:h-7" />
          </a>
          <a
            href="https://www.youtube.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:-translate-y-1 hover:text-gray-300 transition-all duration-200 cursor-pointer flex items-center"
          >
            <FaYoutube size={24} className="md:w-7 md:h-7" />
          </a>
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:-translate-y-1 hover:text-gray-300 transition-all duration-200 cursor-pointer flex items-center"
          >
            <FaInstagram size={24} className="md:w-7 md:h-7" />
          </a>
          <a
            href="https://www.facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:-translate-y-1 hover:text-gray-300 transition-all duration-200 cursor-pointer flex items-center"
          >
            <FaFacebook size={24} className="md:w-7 md:h-7" />
          </a>
        </div>

        <p className="text-base md:text-lg">est. 2025</p>
      </div>
    </footer>
  );
}

export default Footer;
