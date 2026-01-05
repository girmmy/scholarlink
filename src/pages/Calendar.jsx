import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import blueFaintBg from "../assets/blue-faint-bg.png";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Calendar = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [scholarships, setScholarships] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedScholarships, setSelectedScholarships] = useState([]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Parse deadline similar to Home.jsx
  const parseDeadline = (deadline) => {
    if (!deadline) return null;

    const now = new Date();
    const monthMap = {
      january: 0,
      jan: 0,
      february: 1,
      feb: 1,
      march: 2,
      mar: 2,
      april: 3,
      apr: 3,
      may: 4,
      june: 5,
      jun: 5,
      july: 6,
      jul: 6,
      august: 7,
      aug: 7,
      september: 8,
      sep: 8,
      october: 9,
      oct: 9,
      november: 10,
      nov: 10,
      december: 11,
      dec: 11,
    };

    const lowerDeadline = deadline.toLowerCase();
    if (
      lowerDeadline.includes("open") ||
      lowerDeadline.includes("rolling") ||
      lowerDeadline.includes("drawing") ||
      lowerDeadline.includes("throughout") ||
      lowerDeadline.includes("not set") ||
      lowerDeadline.includes("sometime")
    ) {
      return null;
    }

    // Try format: "February 13,2026" or "February 13, 2026" or "February 13 2026"
    let match = deadline.match(/(\w+)\s+(\d+)(?:st|nd|rd|th)?[,\s]+(\d{4})/);
    if (match) {
      const [, month, day, year] = match;
      const monthIndex = monthMap[month.toLowerCase()];
      if (monthIndex !== undefined) {
        return new Date(parseInt(year), monthIndex, parseInt(day));
      }
    }

    // Try format: "February 12 26" (short year)
    match = deadline.match(/(\w+)\s+(\d+)(?:st|nd|rd|th)?\s+(\d{2})$/);
    if (match) {
      const [, month, day, year] = match;
      const monthIndex = monthMap[month.toLowerCase()];
      if (monthIndex !== undefined) {
        const fullYear =
          parseInt(year) < 50 ? 2000 + parseInt(year) : 1900 + parseInt(year);
        return new Date(fullYear, monthIndex, parseInt(day));
      }
    }

    // Try format: "March 2026" or "January 2026"
    match = deadline.match(/(\w+)\s+(\d{4})/);
    if (match) {
      const [, month, year] = match;
      const monthIndex = monthMap[month.toLowerCase()];
      if (monthIndex !== undefined) {
        return new Date(parseInt(year), monthIndex, 1);
      }
    }

    // Try format: "March/April" - use first month
    match = deadline.match(/(\w+)\/(\w+)/);
    if (match) {
      const [, month1] = match;
      const monthIndex = monthMap[month1.toLowerCase()];
      if (monthIndex !== undefined) {
        const year = now.getFullYear();
        return new Date(year, monthIndex, 1);
      }
    }

    // Try format: "Early December normally the 1st" - use December 1st
    match = deadline.match(/early\s+(\w+)/);
    if (match) {
      const [, month] = match;
      const monthIndex = monthMap[month.toLowerCase()];
      if (monthIndex !== undefined) {
        const year = now.getFullYear();
        return new Date(year, monthIndex, 1);
      }
    }

    // Try format: "November 15/ December 2" - use first date
    match = deadline.match(/(\w+)\s+(\d+)\/\s*(\w+)\s+(\d+)/);
    if (match) {
      const [, month, day] = match;
      const monthIndex = monthMap[month.toLowerCase()];
      if (monthIndex !== undefined) {
        const year = now.getFullYear();
        return new Date(year, monthIndex, parseInt(day));
      }
    }

    // Try format: "spring 2026" or "typically in the spring (April)"
    if (lowerDeadline.includes("spring")) {
      const yearMatch = deadline.match(/(\d{4})/);
      const year = yearMatch ? parseInt(yearMatch[1]) : now.getFullYear();
      return new Date(year, 3, 1); // April
    }

    // Try standard Date parsing
    const parsed = new Date(deadline);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }

    return null;
  };

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const res = await fetch("/data/scholarships.json");
        if (!res.ok) throw new Error("Failed to load scholarships");
        const data = await res.json();

        const scholarshipsWithDates = data
          .map((sch) => {
            const deadlineDate = parseDeadline(sch.deadline);
            return {
              ...sch,
              deadlineDate,
            };
          })
          .filter((sch) => sch.deadlineDate !== null);

        setScholarships(scholarshipsWithDates);
      } catch (error) {
        console.error("Error loading scholarships:", error);
      }
    };

    fetchScholarships();
  }, []);

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const getScholarshipsForDate = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    return scholarships.filter((sch) => {
      if (!sch.deadlineDate) return false;
      return (
        sch.deadlineDate.getDate() === date.getDate() &&
        sch.deadlineDate.getMonth() === date.getMonth() &&
        sch.deadlineDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const handleDateClick = (day) => {
    const dateScholarships = getScholarshipsForDate(day);
    if (dateScholarships.length > 0) {
      setSelectedDate(new Date(currentYear, currentMonth, day));
      setSelectedScholarships(dateScholarships);
    }
  };

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
    setSelectedDate(null);
    setSelectedScholarships([]);
  };

  const isToday = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${blueFaintBg})` }}
    >
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow pt-20 md:pt-24 px-4 pb-12">
          <div className="container mx-auto max-w-6xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gradient1 mb-8 text-center">
              Scholarship Calendar
            </h1>

            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => changeMonth("prev")}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-secondary font-semibold flex items-center gap-2"
                >
                  <FaChevronLeft />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <h2 className="text-2xl md:text-3xl font-bold text-primary">
                  {months[currentMonth]} {currentYear}
                </h2>

                <button
                  onClick={() => changeMonth("next")}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-secondary font-semibold flex items-center gap-2"
                >
                  <span className="hidden sm:inline">Next</span>
                  <FaChevronRight />
                </button>
              </div>

              {/* Days of week */}
              <div className="grid grid-cols-7 gap-2 text-center font-semibold text-secondary mb-2">
                {daysOfWeek.map((day) => (
                  <div key={day} className="py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-2">
                {Array(42)
                  .fill(null)
                  .map((_, i) => {
                    const dayNumber = i - firstDayOfMonth + 1;
                    const isValidDay =
                      dayNumber > 0 && dayNumber <= daysInMonth;
                    const dateScholarships = isValidDay
                      ? getScholarshipsForDate(dayNumber)
                      : [];
                    const hasDeadline = dateScholarships.length > 0;
                    const todayClass = isValidDay && isToday(dayNumber);

                    return (
                      <div
                        key={i}
                        className={`min-h-[80px] md:min-h-[100px] p-2 rounded-lg border-2 transition-all ${
                          isValidDay
                            ? hasDeadline
                              ? "border-secondary bg-blue-50 hover:bg-blue-100 cursor-pointer"
                              : todayClass
                              ? "border-primary bg-primary/10 hover:bg-primary/20 cursor-pointer"
                              : "border-gray-200 hover:bg-gray-50 cursor-pointer"
                            : "border-transparent"
                        } ${todayClass ? "ring-2 ring-primary" : ""}`}
                        onClick={() => isValidDay && handleDateClick(dayNumber)}
                      >
                        {isValidDay && (
                          <>
                            <div
                              className={`text-sm font-semibold mb-1 ${
                                todayClass
                                  ? "text-primary"
                                  : hasDeadline
                                  ? "text-secondary"
                                  : "text-gray-700"
                              }`}
                            >
                              {dayNumber}
                            </div>
                            {hasDeadline && (
                              <div className="space-y-1">
                                {dateScholarships.slice(0, 2).map((sch) => (
                                  <div
                                    key={sch.id}
                                    className="text-xs bg-secondary text-white px-1.5 py-0.5 rounded truncate"
                                    title={sch.name}
                                  >
                                    {sch.name.length > 15
                                      ? sch.name.substring(0, 15) + "..."
                                      : sch.name}
                                  </div>
                                ))}
                                {dateScholarships.length > 2 && (
                                  <div className="text-xs text-secondary font-semibold">
                                    +{dateScholarships.length - 2} more
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
              </div>

              {/* Selected date scholarships */}
              {selectedDate && selectedScholarships.length > 0 && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border-2 border-secondary">
                  <h3 className="text-lg font-bold text-secondary mb-3">
                    Scholarships due on{" "}
                    {selectedDate.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </h3>
                  <div className="space-y-3">
                    {selectedScholarships.map((sch) => (
                      <div
                        key={sch.id}
                        className="bg-white p-3 rounded-lg border border-gray-200"
                      >
                        <h4 className="font-semibold text-primary mb-1">
                          {sch.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Award: {sch.award || "Varies"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Deadline: {sch.deadline}
                        </p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedDate(null);
                      setSelectedScholarships([]);
                    }}
                    className="mt-4 text-sm text-secondary hover:underline"
                  >
                    Close
                  </button>
                </div>
              )}

              {/* Legend */}
              <div className="mt-6 flex flex-wrap gap-4 items-center justify-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-secondary bg-blue-50"></div>
                  <span>Has deadlines</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-primary bg-primary/10 ring-2 ring-primary"></div>
                  <span>Today</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Calendar;
