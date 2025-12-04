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
      <div className="max-w-3xl mx-auto px-4 flex flex-row justify-between items-center h-24">
        <div className="w-36 h-36">
          <img className="w-full h-full object-contain" src={logo} alt="logo" />
        </div>

        <div className="flex flex-row gap-6 items-center">
          <a
            href="https://x.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:-translate-y-1 hover:text-gray-300 transition-all duration-200 cursor-pointer flex items-center"
          >
            <FaXTwitter size={28} />
          </a>
          <a
            href="https://www.youtube.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:-translate-y-1 hover:text-gray-300 transition-all duration-200 cursor-pointer flex items-center"
          >
            <FaYoutube size={28} />
          </a>
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:-translate-y-1 hover:text-gray-300 transition-all duration-200 cursor-pointer flex items-center"
          >
            <FaInstagram size={28} />
          </a>
          <a
            href="https://www.facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:-translate-y-1 hover:text-gray-300 transition-all duration-200 cursor-pointer flex items-center"
          >
            <FaFacebook size={28} />
          </a>
        </div>

        <p className="text-lg">est. 2025</p>
      </div>
    </footer>
  );
}

export default Footer;
