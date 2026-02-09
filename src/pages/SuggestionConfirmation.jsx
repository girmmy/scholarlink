import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import blueFaintBg from "../assets/blue-faint-bg.png";

const SuggestionConfirmation = () => {
  useEffect(() => {
    document.title = "Thank You - ScholarLink";
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat relative overflow-x-hidden w-full"
      style={{ backgroundImage: `url(${blueFaintBg})` }}
    >
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        <Navbar />
        <main className="flex-grow pt-20 md:pt-24 flex items-center justify-center">
          <div className="container mx-auto px-4 py-16 max-w-2xl">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
              {/* Success Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gradient1 mb-4">
                Thank You for Your Suggestion!
              </h1>

              <p className="text-gray-600 text-lg mb-6">
                We've received your scholarship recommendation and our team will review it carefully.
              </p>

              <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-100">
                <h2 className="font-semibold text-gray-900 mb-3 flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  What happens next?
                </h2>
                <div className="text-gray-700 text-left space-y-2">
                  <p className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold mt-0.5">1.</span>
                    <span>Our team will verify the scholarship details and website</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold mt-0.5">2.</span>
                    <span>We'll ensure it meets our quality and eligibility criteria</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold mt-0.5">3.</span>
                    <span>If approved, it will be added to our database to help other students</span>
                  </p>
                </div>
              </div>

              <p className="text-gray-600 mb-8">
                Your contribution helps make education more accessible for students everywhere.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/scholarships">
                  <button className="w-full sm:w-auto bg-gradient2 text-white font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-all duration-200 hover:scale-105 active:scale-95">
                    Browse Scholarships
                  </button>
                </Link>
                <Link to="/">
                  <button className="w-full sm:w-auto bg-white text-gray-700 font-semibold px-8 py-3 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-all duration-200 hover:scale-105 active:scale-95">
                    Return Home
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default SuggestionConfirmation;
