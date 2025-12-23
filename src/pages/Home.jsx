import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import studentImage from "../assets/gim1.png";
import SearchBar from "../components/SearchBar";

function Home() {
  return (
    <div className="bg-gray-50 overflow-hidden">
      <Navbar />
      <main>
        {/* HERO SECTION */}
        <div className="min-h-[60vh] mt-16 md:mt-20 flex flex-col bg-slate-200 py-8 md:py-0">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-gradient1 text-center mx-auto pt-8 md:pt-20 pb-4 md:pb-8 font-bold px-4">
            Connecting Scholars, <br />
            Expanding Opportunities
          </h1>
          <p className="text-gray-600 text-base sm:text-lg md:text-xl my-4 md:my-5 text-center mx-auto max-w-2xl px-4">
            Lorem ipsum dolor sit amet consectetur. Sit tellus non eget congue
            faucibus amet purus porta sit.
          </p>

          {/* SEARCH BAR */}
          <div className="mt-4 md:mt-0">
            <SearchBar />
          </div>
        </div>

        {/* OUR GOAL */}
        <div className="mt-12 md:mt-24 mb-12 md:mb-16 flex flex-col items-center justify-center mx-auto max-w-3xl px-4">
          <h2 className="text-gradient2 text-center mt-4 text-3xl sm:text-4xl md:text-5xl font-bold">
            OUR GOAL
          </h2>
          <p className="text-black text-center mt-6 md:mt-8 text-base sm:text-lg md:text-xl">
            Lorem ipsum dolor sit amet consectetur. Tempor etiam dolor tincidunt
            accumsan. Sed at pretium elit id vel risus tristique. Porta vel
            tincidunt tristique arcu vel nec et id nunc. Montes ante velit risus
            congue tempus imperdiet. Porta vel tincidunt tristique arcu vel nec
            et id nunc. Montes ante velit risus congue tempus imperdiet.
          </p>
        </div>

        {/* UPCOMING SCHOLARSHIPS */}
        <div className="mt-12 md:mt-24 mb-10 flex flex-col items-center justify-center mx-auto max-w-3xl px-4">
          <h2 className="text-gradient2 text-center text-3xl sm:text-4xl md:text-5xl font-bold">
            UPCOMING SCHOLARSHIPS
          </h2>

          {/* CARDS FOR SCHOLARSHIPS */}
          <div className="mt-4 mb-10 w-full">
            {/* CARD */}
            <div className="mt-8 transition-all duration-300 hover:-translate-y-1 border-2 border-gray-300 hover:border-primary bg-gray-200 w-full rounded-lg p-4 md:p-5 shadow-md hover:shadow-lg">
              <h3 className="text-xl md:text-2xl font-bold pb-1">Title</h3>
              <h5 className="text-lg md:text-xl pb-2 text-wrap">
                Name of Foundation
              </h5>
              <p className="pb-2 text-sm md:text-base">
                Lorem ipsum dolor sit amet consectetur. Tempor etiam dolor
                tincidunt accumsan.
              </p>
              <Link to="#">
                <button className="outline text-black rounded-xl p-2 md:p-3 hover:bg-gradient1 hover:text-white text-sm md:text-base">
                  Apply Here
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* OUR HIGHLIGHTS */}
        <div className="mt-12 md:mt-24 mb-12 md:mb-20 flex flex-col items-center justify-center mx-auto max-w-3xl px-4">
          <h2 className="text-gradient2 text-center mb-8 md:mb-16 text-3xl sm:text-4xl md:text-5xl font-bold">
            OUR HIGHLIGHTS
          </h2>

          {/* STUDENT CARDS */}

          {/* STUDENT CARD 1 */}
          <div className="outline mb-12 md:mb-16 rounded-xl p-4 md:p-5 flex flex-col md:flex-row gap-6 md:gap-16 items-stretch">
            <div className="rounded-xl w-full md:w-auto md:flex-shrink-0">
              <img
                className="w-full h-64 md:h-full md:max-h-[300px] rounded-xl object-cover"
                src={studentImage}
                alt="student"
              />
            </div>

            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-bold pb-1">Nathan Le</h3>
              <h3 className="text-lg md:text-xl pb-3">
                Gimmy Institute of Technology
              </h3>
              <p className="text-sm md:text-base text-wrap">
                Lorem ipsum dolor sit amet consectetur. Tempor etiam dolor
                tincidunt accumsan. Sed at pretium elit id vel risus tristique.
                Porta vel tincidunt tristique arcu vel nec et id nunc. Montes
                ante velit risus congue tempus imperdiet. Porta vel tincidunt
                tristique arcu vel nec et id nunc. Montes ante velit risus
                congue tempus imperdiet.
              </p>
            </div>
          </div>

          {/* STUDENT CARD 2 */}
          <div className="outline rounded-xl p-4 md:p-5 flex flex-col md:flex-row-reverse gap-6 md:gap-16 items-stretch">
            <div className="rounded-xl w-full md:w-auto md:flex-shrink-0">
              <img
                className="w-full h-64 md:h-full md:max-h-[300px] rounded-xl object-cover"
                src={studentImage}
                alt="student"
              />
            </div>

            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-bold pb-1">
                Tomi Odugbemi
              </h3>
              <h3 className="text-lg md:text-xl pb-3">Gimmy University</h3>
              <p className="text-sm md:text-base text-wrap">
                Lorem ipsum dolor sit amet consectetur. Tempor etiam dolor
                tincidunt accumsan. Sed at pretium elit id vel risus tristique.
                Porta vel tincidunt tristique arcu vel nec et id nunc. Montes
                ante velit risus congue tempus imperdiet. Porta vel tincidunt
                tristique arcu vel nec et id nunc. Montes ante velit risus
                congue tempus imperdiet.
              </p>
            </div>
          </div>
        </div>

        {/* VIEW SCHOLARSHIPS */}
        <div className="mt-12 md:mt-24 mb-12 md:mb-20 flex flex-col items-center justify-center mx-auto max-w-3xl px-4">
          <h2 className="text-gradient2 text-center mb-4 md:mb-6 text-3xl sm:text-4xl md:text-5xl font-bold">
            VIEW SCHOLARSHIPS
          </h2>
          <p className="mb-6 md:mb-8 text-sm md:text-base text-center">
            Find more scholarships on our Scholarships page!
          </p>
          <Link to="/scholarships">
            <button className="outline transition-all duration-300 text-secondary hover:bg-gradient2 px-6 md:px-8 py-2 md:py-3 rounded-2xl text-lg md:text-xl hover:text-white">
              View Scholarships
            </button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
