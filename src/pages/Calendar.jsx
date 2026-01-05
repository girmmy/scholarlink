import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Calendar = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const changeMonth = (direction) => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient2">
      <Navbar />

      <main className="flex-grow flex items-center justify-center pt-24 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => changeMonth("prev")}
              className="text-secondary font-semibold hover:opacity-70"
            >
              ←
            </button>

            <h1 className="text-2xl md:text-3xl font-bold text-primary">
              {months[currentMonth]} {currentYear}
            </h1>

            <button
              onClick={() => changeMonth("next")}
              className="text-secondary font-semibold hover:opacity-70"
            >
              →
            </button>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 text-center font-semibold text-secondary mb-2">
            {daysOfWeek.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2 text-center">
            {Array(42)
              .fill(null)
              .map((_, i) => {
                const dayNumber = i - firstDayOfMonth + 1;
                const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth;

              return (
                <div
                  key={i}
                  className={`h-16 flex items-center justify-center rounded-lg border transition
                    ${isValidDay
                      ? "border-gray-200 text-primary hover:bg-tertiary/20 cursor-pointer"
                      : "border-transparent"
                    }`}
                >
                  {isValidDay ? dayNumber : ""}
                </div>
              );
            })}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Calendar;
