import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import blueFaintBg from "../assets/blue-faint-bg.png";

const References = () => {
  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat relative overflow-x-hidden w-full"
      style={{ backgroundImage: `url(${blueFaintBg})` }}
    >
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        <Navbar />
        <main className="flex-grow pt-20 md:pt-24 px-4 pb-12">
          <div className="container mx-auto max-w-6xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gradient1 mb-4 text-center pt-8 md:pt-12">
              References
            </h1>
            <p className="text-gray-600 text-center text-lg max-w-2xl mx-auto mb-12">
              Access scholarship websites and other resources to help you in
              your educational journey.
            </p>

            {/* POW Calendar and Student Copyright Checklist Boxes */}
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-12 max-w-4xl mx-auto">
              {/* POW Calendar Box */}
              <div className="w-full md:w-1/2 p-8 border-2 border-gray-200 rounded-2xl bg-white shadow-lg text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient2 text-white mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  POW Calendar
                </h2>
                <p className="text-gray-600 mb-6">
                  View the Plan of Work calendar for important dates and
                  deadlines.
                </p>
                <a
                  href="/Webmaster Work Log 25-26.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient2 hover:bg-gradient1 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  View POW Calendar
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-2 h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>

              {/* Student Copyright Checklist Box */}
              <div className="w-full md:w-1/2 p-8 border-2 border-gray-200 rounded-2xl bg-white shadow-lg text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient2 text-white mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Student Copyright Checklist
                </h2>
                <p className="text-gray-600 mb-6">
                  Review the copyright checklist to ensure your work is properly
                  protected.
                </p>
                <a
                  href="/Webmaster 25-26 Student Copyright Checklist.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient2 hover:bg-gradient1 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  View Checklist
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-2 h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            {/* Scholarships Section Title */}
            <h2 className="text-3xl md:text-4xl font-bold text-gradient1 text-center mb-8">
              Scholarships
            </h2>

            {/* Scholarship Links Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Ronald McDonald House Charities
                </h2>
                <a
                  href="https://www.rmhcsouthwest.com/grants-scholarships/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gradient2 hover:bg-gradient1 text-white font-medium rounded-lg transition-colors"
                >
                  Visit Website
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  HOPE Scholarship
                </h2>
                <a
                  href="https://www.gafutures.org/hope-state-aid-programs/hope-zell-miller-scholarships/hope-scholarship/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gradient2 hover:bg-gradient1 text-white font-medium rounded-lg transition-colors"
                >
                  Visit Website
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Doodle for Google Contest
                </h2>
                <a
                  href="https://doodles.google.com/d4g/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gradient2 hover:bg-gradient1 text-white font-medium rounded-lg transition-colors"
                >
                  Visit Website
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  University of Georgia Foundation Fellowship
                </h2>
                <a
                  href="https://honors.uga.edu/admissions/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gradient2 hover:bg-gradient1 text-white font-medium rounded-lg transition-colors"
                >
                  Visit Website
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Amazon Future Engineer Scholarship
                </h2>
                <a
                  href="https://www.amazonfutureengineer.com/scholarships"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gradient2 hover:bg-gradient1 text-white font-medium rounded-lg transition-colors"
                >
                  Visit Website
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  TheDream.US National Scholarship
                </h2>
                <a
                  href="https://www.thedream.us/scholarships/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gradient2 hover:bg-gradient1 text-white font-medium rounded-lg transition-colors"
                >
                  Visit Website
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  UNICO National Scholarship
                </h2>
                <a
                  href="https://www.unico.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gradient2 hover:bg-gradient1 text-white font-medium rounded-lg transition-colors"
                >
                  Visit Website
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  SMART Scholarship
                </h2>
                <a
                  href="https://www.smartscholarship.org/smart/en?id=smart_opportunities"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gradient2 hover:bg-gradient1 text-white font-medium rounded-lg transition-colors"
                >
                  Visit Website
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Davidson Fellows Scholarship
                </h2>
                <a
                  href="https://www.davidsongifted.org/gifted-programs/fellows-scholarship/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gradient2 hover:bg-gradient1 text-white font-medium rounded-lg transition-colors"
                >
                  Visit Website
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Carson Scholars Fund
                </h2>
                <a
                  href="https://carsonscholars.org/scholarships/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gradient2 hover:bg-gradient1 text-white font-medium rounded-lg transition-colors"
                >
                  Visit Website
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  APIA Scholars
                </h2>
                <a
                  href="https://apply.mykaleidoscope.com/program/APIAScholarsApplication2627"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gradient2 hover:bg-gradient1 text-white font-medium rounded-lg transition-colors"
                >
                  Visit Website
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Gates Scholarship
                </h2>
                <a
                  href="https://www.thegatesscholarship.org/scholarship"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gradient2 hover:bg-gradient1 text-white font-medium rounded-lg transition-colors"
                >
                  Visit Website
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Georgia EMC Scholarship
                </h2>
                <a
                  href="https://www.cgemc.com/scholarships"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gradient2 hover:bg-gradient1 text-white font-medium rounded-lg transition-colors"
                >
                  Visit Website
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  GE/Reagan Foundation Scholarship
                </h2>
                <a
                  href="https://apply.mykaleidoscope.com/program/GEReagan2026Scholarship"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gradient2 hover:bg-gradient1 text-white font-medium rounded-lg transition-colors"
                >
                  Visit Website
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  GCPS Foundation Scholarships
                </h2>
                <a
                  href="https://gcps-foundation.org/wp-content/uploads/2025/12/2026-GCPS-Foundation-Scholarship-Catalog-120125-1-1.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gradient2 hover:bg-gradient1 text-white font-medium rounded-lg transition-colors"
                >
                  Visit Website
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Big Future Scholarship
                </h2>
                <a
                  href="https://bigfuture.collegeboard.org/pay-for-college/bigfuture-scholarships"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gradient2 hover:bg-gradient1 text-white font-medium rounded-lg transition-colors"
                >
                  Visit Website
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Horatio Alger Association Scholarships
                </h2>
                <a
                  href="https://horatioalger.org/scholarships/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gradient2 hover:bg-gradient1 text-white font-medium rounded-lg transition-colors"
                >
                  Visit Website
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Cameron Impact Scholarship
                </h2>
                <a
                  href="https://www.bryancameroneducationfoundation.org/scholarship"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gradient2 hover:bg-gradient1 text-white font-medium rounded-lg transition-colors"
                >
                  Visit Website
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Generation Google Scholarship
                </h2>
                <a
                  href="https://www.google.com/about/careers/applications/buildyourfuture/scholarships/generation-google-scholarship"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gradient2 hover:bg-gradient1 text-white font-medium rounded-lg transition-colors"
                >
                  Visit Website
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Young Scholars Program
                </h2>
                <a
                  href="https://www.jkcf.org/our-scholarships/young-scholars-program/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gradient2 hover:bg-gradient1 text-white font-medium rounded-lg transition-colors"
                >
                  Visit Website
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Gen and Kelly Tanabe Scholarship
                </h2>
                <a
                  href="https://www.genkellyscholarship.com/apply"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gradient2 hover:bg-gradient1 text-white font-medium rounded-lg transition-colors"
                >
                  Visit Website
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Equitable Foundation Scholarship
                </h2>
                <a
                  href="https://equitable.com/foundation/equitable-excellence-scholarship"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gradient2 hover:bg-gradient1 text-white font-medium rounded-lg transition-colors"
                >
                  Visit Website
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  James W. McLamore WHOPPER Scholarship
                </h2>
                <a
                  href="https://www.burgerkingfoundation.org/programs/burger-king-sm-scholars"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gradient2 hover:bg-gradient1 text-white font-medium rounded-lg transition-colors"
                >
                  Visit Website
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Jackie Robinson Foundation Scholarship
                </h2>
                <a
                  href="https://jackierobinson.org/scholarship/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gradient2 hover:bg-gradient1 text-white font-medium rounded-lg transition-colors"
                >
                  Visit Website
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Yashoda Reddy Education Award
                </h2>
                <a
                  href="https://www.atlantawomen.org/what-we-do/grants/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gradient2 hover:bg-gradient1 text-white font-medium rounded-lg transition-colors"
                >
                  Visit Website
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Oxford Orjiako Graduate Scholarship
                </h2>
                <a
                  href="https://www.sbs.ox.ac.uk/oxford-experience/scholarships-and-funding/oxford-orjiako-graduate-scholarship"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gradient2 hover:bg-gradient1 text-white font-medium rounded-lg transition-colors"
                >
                  Visit Website
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Jefferson Scholarship
                </h2>
                <a
                  href="https://www.jeffersonscholars.org/scholarships"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gradient2 hover:bg-gradient1 text-white font-medium rounded-lg transition-colors"
                >
                  Visit Website
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Georgia Promise Scholarship
                </h2>
                <a
                  href="https://mygeorgiapromise.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gradient2 hover:bg-gradient1 text-white font-medium rounded-lg transition-colors"
                >
                  Visit Website
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Elks National Foundation Scholarship
                </h2>
                <a
                  href="https://www.elks.org/scholars/scholarships/mvs.cfm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gradient2 hover:bg-gradient1 text-white font-medium rounded-lg transition-colors"
                >
                  Visit Website
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Coca-Cola Scholars Program
                </h2>
                <a
                  href="https://www.coca-colascholarsfoundation.org/apply/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gradient2 hover:bg-gradient1 text-white font-medium rounded-lg transition-colors"
                >
                  Visit Website
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Hispanic Scholarship Fund
                </h2>
                <a
                  href="https://www.hsf.net/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gradient2 hover:bg-gradient1 text-white font-medium rounded-lg transition-colors"
                >
                  Visit Website
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Dell Scholars Program
                </h2>
                <a
                  href="https://www.dellscholars.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gradient2 hover:bg-gradient1 text-white font-medium rounded-lg transition-colors"
                >
                  Visit Website
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Burger King Scholars Program
                </h2>
                <a
                  href="https://www.burgerkingfoundation.org/programs/burger-king-sm-scholars"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gradient2 hover:bg-gradient1 text-white font-medium rounded-lg transition-colors"
                >
                  Visit Website
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default References;
