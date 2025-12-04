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
        <div className="h-[60vh] mt-20 flex flex-col bg-slate-200">
          <h1 className="text-7xl text-gradient1 text-center mx-auto pt-20 pb-8 font-bold">
            Connecting Scholars, <br />
            Expanding Opportunities
          </h1>
          <p className="text-gray-600 text-xl my-5 text-center mx-auto max-w-2xl">
            Lorem ipsum dolor sit amet consectetur. Sit tellus non eget congue
            faucibus amet purus porta sit.
          </p>

          {/* SEARCH BAR */}
          <SearchBar />
        </div>

        {/* OUR GOAL */}
        <div className="mt-24 mb-16 flex flex-col items-center justify-center mx-auto max-w-3xl px-4">
          <h2 className="text-gradient2 text-center mt-4 text-5xl font-bold">
            OUR GOAL
          </h2>
          <p className="text-black text-center mt-8 text-xl">
            Lorem ipsum dolor sit amet consectetur. Tempor etiam dolor tincidunt
            accumsan. Sed at pretium elit id vel risus tristique. Porta vel
            tincidunt tristique arcu vel nec et id nunc. Montes ante velit risus
            congue tempus imperdiet. Porta vel tincidunt tristique arcu vel nec
            et id nunc. Montes ante velit risus congue tempus imperdiet.
          </p>
        </div>

        {/* UPCOMING SCHOLARSHIPS */}
        <div className="mt-24 mb-10 flex flex-col items-center justify-center mx-auto max-w-3xl px-4">
          <h2 className="text-gradient2 text-center text-5xl font-bold">
            UPCOMING SCHOLARSHIPS
          </h2>

          {/* CARDS FOR SCHOLARSHIPS */}
          <div className="mt-4 mb-10">
            {/* CARD */}
            <div className="mt-8 transition-all duration-300 hover:-translate-y-1 border-2 border-gray-300 hover:border-primary bg-gray-200 w-400 rounded-lg p-5 shadow-md hover:shadow-lg">
              <h3 className="text-2xl font-bold pb-1">Title</h3>
              <h5 className="text-xl pb-2 text-wrap">Name of Foundation</h5>
              <p className="pb-2 max-w-md">
                Lorem ipsum dolor sit amet consectetur. Tempor etiam dolor
                tincidunt accumsan.
              </p>
              <Link to="#">
                <button className="outline text-black rounded-xl p-3 hover:bg-gradient1 hover:text-white">
                  Apply Here
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* OUR HIGHLIGHTS */}
        <div className="mt-24 mb-20 flex flex-col items-center justify-center mx-auto max-w-3xl px-4">
          <h2 className="text-gradient2 text-center mb-16 text-5xl font-bold">
            OUR HIGHLIGHTS
          </h2>

          {/* STUDENT CARDS */}

          {/* STUDENT CARD 1 */}
          <div className="outline max-h-[500px] mb-16 rounded-xl p-5 flex flex-row gap-16 items-stretch">
            <div className="rounded-xl ">
              <img
                className="w-full h-full rounded-xl object-cover"
                src={studentImage}
                alt="student"
              />
            </div>

            <div>
              <h3 className="text-3xl font-bold pb-1 ">Nathan Le</h3>
              <h3 className="text-xl  pb-3 ">Gimmy Institute of Technology</h3>
              <p className="text-md text-wrap">
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
          <div className="outline max-h-[500px] rounded-xl p-5 flex flex-row-reverse gap-16 items-stretch">
            <div className="rounded-xl ">
              <img
                className="w-full h-full rounded-xl object-cover"
                src={studentImage}
                alt="student"
              />
            </div>

            <div>
              <h3 className="text-3xl font-bold pb-1 ">Tomi Odugbemi</h3>
              <h3 className="text-xl  pb-3 ">Gimmy University</h3>
              <p className="text-md text-wrap">
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
        <div className="mt-24 mb-20 flex flex-col items-center justify-center mx-auto max-w-3xl px-4">
          <h2 className="text-gradient2 text-center mb-6 text-5xl font-bold">
            VIEW SCHOLARSHIPS
          </h2>
          <p className="mb-8">
            Find more scholarships on our Scholarships page!
          </p>
          <Link to="/scholarships">
            <button className="outline transition-all duration-300 text-secondary hover:bg-gradient2 px-8 py-3 rounded-2xl text-xl hover:text-white">
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
