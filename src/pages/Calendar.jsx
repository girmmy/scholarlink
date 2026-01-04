import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Calendar = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Calendar
          </h1>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Calendar;
