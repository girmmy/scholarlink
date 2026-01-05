import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScholarshipModal from "../components/ScholarshipModal";
import blueFaintBg from "../assets/blue-faint-bg.png";
import { FaChevronLeft, FaChevronRight, FaHeart } from "react-icons/fa";

const Calendar = () => {
  const today = new Date();
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [scholarships, setScholarships] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedScholarships, setSelectedScholarships] = useState([]);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [user, setUser] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState(new Set());

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

  // Load user and favorites
  useEffect(() => {
    if (!auth) {
      console.warn("Firebase auth not initialized");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadFavorites(currentUser.uid);
      } else {
        setFavoriteIds(new Set());
      }
    });

    return () => unsubscribe();
  }, []);

  const loadFavorites = async (uid) => {
    if (!db) return;

    try {
      const favoritesQuery = query(
        collection(db, "favorites"),
        where("userId", "==", uid)
      );
      const favoritesSnapshot = await getDocs(favoritesQuery);
      const ids = new Set();
      favoritesSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (!data.deleted) {
          ids.add(data.scholarshipId);
        }
      });
      setFavoriteIds(ids);
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
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
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
  const lastDayOfMonth = new Date(
    currentYear,
    currentMonth,
    daysInMonth
  ).getDay();

  // Calculate how many days we need from previous and next month to fill rows
  const daysFromPrevMonth = firstDayOfMonth;
  const daysFromNextMonth = 6 - lastDayOfMonth;
  const totalDays = daysFromPrevMonth + daysInMonth + daysFromNextMonth;
  // Use 35 cells (5 rows) if we can fit, otherwise 42 (6 rows)
  const cellsToShow = totalDays <= 35 ? 35 : 42;

  const getScholarshipsForDate = (day, monthOffset = 0) => {
    const date = new Date(currentYear, currentMonth + monthOffset, day);
    return scholarships.filter((sch) => {
      if (!sch.deadlineDate) return false;
      return (
        sch.deadlineDate.getDate() === date.getDate() &&
        sch.deadlineDate.getMonth() === date.getMonth() &&
        sch.deadlineDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const getDateInfo = (i) => {
    const dayNumber = i - firstDayOfMonth + 1;

    // Previous month dates (only show if they fill the first row)
    if (dayNumber <= 0 && i < daysFromPrevMonth) {
      const prevMonthDay = daysInPrevMonth + dayNumber;
      return {
        day: prevMonthDay,
        monthOffset: -1,
        isCurrentMonth: false,
        isValidDay: true,
      };
    }

    // Current month dates
    if (dayNumber > 0 && dayNumber <= daysInMonth) {
      return {
        day: dayNumber,
        monthOffset: 0,
        isCurrentMonth: true,
        isValidDay: true,
      };
    }

    // Next month dates (only show if they fill the last row)
    const nextMonthDay = dayNumber - daysInMonth;
    if (
      nextMonthDay > 0 &&
      nextMonthDay <= daysFromNextMonth &&
      i < cellsToShow
    ) {
      return {
        day: nextMonthDay,
        monthOffset: 1,
        isCurrentMonth: false,
        isValidDay: true,
      };
    }

    // Empty cell (shouldn't happen with proper calculation, but handle it)
    return {
      day: null,
      monthOffset: 0,
      isCurrentMonth: false,
      isValidDay: false,
    };
  };

  const handleAdjacentMonthClick = (day, monthOffset) => {
    // Calculate the target month and year
    let targetMonth = currentMonth + monthOffset;
    let targetYear = currentYear;

    if (targetMonth < 0) {
      targetMonth = 11;
      targetYear = currentYear - 1;
    } else if (targetMonth > 11) {
      targetMonth = 0;
      targetYear = currentYear + 1;
    }

    // Navigate to the adjacent month
    setCurrentMonth(targetMonth);
    setCurrentYear(targetYear);

    // Set the selected date and load scholarships for that date
    const newDate = new Date(targetYear, targetMonth, day);
    setSelectedDate(newDate);

    // Get scholarships for the target date
    const targetDate = new Date(targetYear, targetMonth, day);
    const dateScholarships = scholarships.filter((sch) => {
      if (!sch.deadlineDate) return false;
      return (
        sch.deadlineDate.getDate() === targetDate.getDate() &&
        sch.deadlineDate.getMonth() === targetDate.getMonth() &&
        sch.deadlineDate.getFullYear() === targetDate.getFullYear()
      );
    });
    setSelectedScholarships(dateScholarships);
  };

  const isFavorited = (scholarshipId) => {
    return favoriteIds.has(scholarshipId.toString());
  };

  const toggleFavorite = async (scholarship) => {
    if (!user) {
      navigate("/sign-up");
      return;
    }

    if (!db) {
      console.warn("Firestore not available");
      return;
    }

    const scholarshipId = scholarship.id.toString();
    const isCurrentlyFavorited = favoriteIds.has(scholarshipId);

    // Update UI immediately (optimistic update)
    if (isCurrentlyFavorited) {
      setFavoriteIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(scholarshipId);
        return newSet;
      });
    } else {
      setFavoriteIds((prev) => {
        const newSet = new Set(prev);
        newSet.add(scholarshipId);
        return newSet;
      });
    }

    // Then sync with Firestore in the background
    try {
      const favoriteRef = doc(db, "favorites", `${user.uid}_${scholarship.id}`);
      const favoriteDoc = await getDoc(favoriteRef);

      if (isCurrentlyFavorited) {
        // Remove from favorites
        if (favoriteDoc.exists()) {
          await updateDoc(favoriteRef, { deleted: true });
        }
      } else {
        // Add to favorites
        await setDoc(favoriteRef, {
          userId: user.uid,
          scholarshipId: scholarshipId,
          addedAt: new Date().toISOString(),
          deleted: false,
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // Revert optimistic update on error
      if (isCurrentlyFavorited) {
        setFavoriteIds((prev) => {
          const newSet = new Set(prev);
          newSet.add(scholarshipId);
          return newSet;
        });
      } else {
        setFavoriteIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(scholarshipId);
          return newSet;
        });
      }
    }
  };

  const handleDateClick = (day) => {
    const dateScholarships = getScholarshipsForDate(day);
    setSelectedDate(new Date(currentYear, currentMonth, day));
    setSelectedScholarships(dateScholarships);
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
            <h1 className="text-4xl md:text-5xl font-bold text-gradient1 mt-12 mb-12 md:mb-16 text-center">
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
                {Array(cellsToShow)
                  .fill(null)
                  .map((_, i) => {
                    const dateInfo = getDateInfo(i);
                    if (!dateInfo.isValidDay) {
                      return (
                        <div
                          key={i}
                          className="min-h-[80px] md:min-h-[100px]"
                        ></div>
                      );
                    }

                    const dateScholarships = getScholarshipsForDate(
                      dateInfo.day,
                      dateInfo.monthOffset
                    );
                    const hasDeadline = dateScholarships.length > 0;
                    const todayClass =
                      dateInfo.isCurrentMonth && isToday(dateInfo.day);

                    return (
                      <div
                        key={i}
                        className={`min-h-[80px] md:min-h-[100px] p-2 rounded-lg border-2 transition-all ${
                          dateInfo.isCurrentMonth
                            ? hasDeadline
                              ? "border-secondary bg-blue-50 hover:bg-blue-100 cursor-pointer"
                              : todayClass
                              ? "border-primary bg-primary/10 hover:bg-primary/20 cursor-pointer"
                              : "border-gray-200 hover:bg-gray-50 cursor-pointer"
                            : hasDeadline
                            ? "border-secondary bg-blue-50/50 hover:bg-blue-100/50 cursor-pointer opacity-75"
                            : "border-gray-200 bg-gray-50/50 opacity-50"
                        } ${todayClass ? "ring-2 ring-primary" : ""}`}
                        onClick={() => {
                          if (dateInfo.isCurrentMonth) {
                            handleDateClick(dateInfo.day);
                          } else if (hasDeadline) {
                            handleAdjacentMonthClick(
                              dateInfo.day,
                              dateInfo.monthOffset
                            );
                          }
                        }}
                      >
                        <div
                          className={`text-sm font-semibold mb-1 ${
                            dateInfo.isCurrentMonth
                              ? todayClass
                                ? "text-primary"
                                : hasDeadline
                                ? "text-secondary"
                                : "text-gray-700"
                              : hasDeadline
                              ? "text-secondary"
                              : "text-gray-400"
                          }`}
                        >
                          {dateInfo.day}
                        </div>
                        {hasDeadline && (
                          <div className="space-y-1">
                            {dateScholarships.slice(0, 2).map((sch) => (
                              <div
                                key={sch.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (dateInfo.isCurrentMonth) {
                                    setSelectedScholarship(sch);
                                  } else {
                                    handleAdjacentMonthClick(
                                      dateInfo.day,
                                      dateInfo.monthOffset
                                    );
                                  }
                                }}
                                className={`text-xs px-1.5 py-0.5 rounded truncate hover:opacity-80 cursor-pointer transition-colors flex items-center gap-1 ${
                                  isFavorited(sch.id)
                                    ? "bg-red-500 text-white hover:bg-red-600"
                                    : "bg-secondary text-white hover:bg-secondary/80"
                                }`}
                                title={sch.name}
                              >
                                {isFavorited(sch.id) && (
                                  <FaHeart className="text-[8px] flex-shrink-0" />
                                )}
                                <span className="truncate">
                                  {sch.name.length > 15
                                    ? sch.name.substring(0, 15) + "..."
                                    : sch.name}
                                </span>
                              </div>
                            ))}
                            {dateScholarships.length > 2 && (
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (dateInfo.isCurrentMonth) {
                                    handleDateClick(dateInfo.day);
                                  } else {
                                    handleAdjacentMonthClick(
                                      dateInfo.day,
                                      dateInfo.monthOffset
                                    );
                                  }
                                }}
                                className="text-xs text-secondary font-semibold hover:underline cursor-pointer"
                              >
                                +{dateScholarships.length - 2} more
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>

              {/* Legend */}
              <div className="mt-2 flex flex-wrap gap-4 items-center justify-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-secondary bg-blue-50"></div>
                  <span>Has deadlines</span>
                </div>
                {user && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border-2 border-red-500 bg-red-500 flex items-center justify-center">
                      <FaHeart className="text-white text-[8px]" />
                    </div>
                    <span>Favorited</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-primary bg-primary/10 ring-2 ring-primary"></div>
                  <span>Today</span>
                </div>
              </div>

              {/* Selected date scholarships */}
              {selectedDate && (
                <div className="mt-2 p-4 bg-gray-50 rounded-lg border-2 border-secondary">
                  <h3 className="text-lg font-bold text-secondary mb-3">
                    {selectedScholarships.length > 0
                      ? `Scholarships due on ${selectedDate.toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}`
                      : `${selectedDate.toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}`}
                  </h3>
                  {selectedScholarships.length > 0 ? (
                    <div className="space-y-3">
                      {selectedScholarships.map((sch) => (
                        <div
                          key={sch.id}
                          onClick={() => setSelectedScholarship(sch)}
                          className={`bg-white p-3 rounded-lg border hover:shadow-md cursor-pointer transition-all ${
                            isFavorited(sch.id)
                              ? "border-red-500 hover:border-red-600"
                              : "border-gray-200 hover:border-secondary"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-primary mb-1 hover:text-secondary transition-colors flex-1">
                              {sch.name}
                            </h4>
                            {isFavorited(sch.id) && (
                              <FaHeart
                                className="text-red-500 hover:text-red-600 flex-shrink-0 mt-0.5 transition-colors"
                                size={16}
                              />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            Award: {sch.award || "Varies"}
                          </p>
                          <p className="text-xs text-gray-500">
                            Deadline: {sch.deadline}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600 text-lg mb-2">
                        No scholarships due on this date
                      </p>
                      <p className="text-gray-500 text-sm">
                        Check other dates or browse all scholarships
                      </p>
                    </div>
                  )}
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
            </div>
          </div>
        </main>

        <Footer />
      </div>

      {/* Scholarship Modal */}
      {selectedScholarship && (
        <ScholarshipModal
          scholarship={selectedScholarship}
          onClose={() => setSelectedScholarship(null)}
          user={user}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
          navigate={navigate}
        />
      )}
    </div>
  );
};

export default Calendar;
