import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import studentImage from "../assets/gim1.png";
import SearchBar from "../components/SearchBar";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import ScholarshipModal from "../components/ScholarshipModal";

function Home() {
  const [upcomingScholarships, setUpcomingScholarships] = useState([]);
  const [user, setUser] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const navigate = useNavigate();

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
      // Load user's favorite scholarship IDs
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
      // Remove from favorites - update UI first
      setFavoriteIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(scholarshipId);
        return newSet;
      });
    } else {
      // Add to favorites - update UI first
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
      // Revert the UI change on error
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

  useEffect(() => {
    const fetchUpcomingScholarships = async () => {
      try {
        const res = await fetch("/data/scholarships.json");
        if (!res.ok) {
          throw new Error("Failed to load scholarships.");
        }
        const data = await res.json();

        // Parse dates and filter/sort by closest deadline
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

        const parseDeadline = (deadline) => {
          if (!deadline) return new Date("2099-12-31");

          const lowerDeadline = deadline.toLowerCase();
          if (
            lowerDeadline.includes("open") ||
            lowerDeadline.includes("rolling")
          ) {
            return new Date("2099-12-31");
          }

          // Try format: "February 13,2026" or "February 13, 2026"
          let match = deadline.match(/(\w+)\s+(\d+)[,\s]+(\d{4})/);
          if (match) {
            const [, month, day, year] = match;
            const monthIndex = monthMap[month.toLowerCase()];
            if (monthIndex !== undefined) {
              return new Date(parseInt(year), monthIndex, parseInt(day));
            }
          }

          // Try format: "March 2026" or "January 2026"
          match = deadline.match(/(\w+)\s+(\d{4})/);
          if (match) {
            const [, month, year] = match;
            const monthIndex = monthMap[month.toLowerCase()];
            if (monthIndex !== undefined) {
              // Use first day of the month
              return new Date(parseInt(year), monthIndex, 1);
            }
          }

          // Try format: "before or when you enroll" - set to end of current year
          if (
            lowerDeadline.includes("enroll") ||
            lowerDeadline.includes("before")
          ) {
            return new Date(now.getFullYear(), 11, 31);
          }

          // Try standard Date parsing
          const parsed = new Date(deadline);
          if (!isNaN(parsed.getTime())) {
            return parsed;
          }

          // Default to far future if can't parse
          return new Date("2099-12-31");
        };

        const scholarshipsWithDates = data
          .map((sch) => {
            const deadlineDate = parseDeadline(sch.deadline);
            const daysUntil = Math.floor(
              (deadlineDate - now) / (1000 * 60 * 60 * 24)
            );

            return {
              ...sch,
              deadlineDate,
              daysUntil,
            };
          })
          .filter((sch) => sch.daysUntil >= 0 || sch.daysUntil === Infinity) // Only future deadlines or open
          .sort((a, b) => {
            // Sort open deadlines (Infinity) to the end
            if (a.daysUntil === Infinity && b.daysUntil === Infinity) return 0;
            if (a.daysUntil === Infinity) return 1;
            if (b.daysUntil === Infinity) return -1;
            return a.daysUntil - b.daysUntil;
          })
          .slice(0, 4); // Get top 4

        setUpcomingScholarships(scholarshipsWithDates);
      } catch (error) {
        console.error("Error loading upcoming scholarships:", error);
      }
    };

    fetchUpcomingScholarships();
  }, []);

  return (
    <div className="bg-gray-50 overflow-hidden">
      <Navbar />
      <main>
        {/* HERO SECTION */}
        <div className="min-h-[60vh] flex flex-col bg-slate-200 px-4 pb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-gradient1 text-center mx-auto pt-12 sm:pt-16 md:pt-20 pb-6 sm:pb-8 font-bold">
            Connecting Scholars, <br />
            Expanding Opportunities
          </h1>
          <p className="text-gray-600 text-base sm:text-lg md:text-xl my-4 sm:my-5 text-center mx-auto max-w-2xl px-4">
            Discover and apply for scholarships that match your goals. Connect
            with opportunities that can help fund your education.
          </p>

          {/* SEARCH BAR */}
          <div className="mt-6 sm:mt-8 mb-4">
            <SearchBar />
          </div>
        </div>

        {/* OUR GOAL */}
        <div className="mt-12 md:mt-24 mb-12 md:mb-16 flex flex-col items-center justify-center mx-auto max-w-3xl px-4">
          <h2 className="text-gradient2 text-center mt-4 text-3xl sm:text-4xl md:text-5xl font-bold">
            OUR GOAL
          </h2>
          <p className="text-black text-center mt-8 text-xl">
            Our mission is to connect students with scholarship opportunities
            that can help them achieve their educational dreams. We provide a
            comprehensive platform where students can discover, track, and apply
            for scholarships that match their unique profiles and aspirations.
          </p>
        </div>

        {/* UPCOMING SCHOLARSHIPS */}
        <div className="mt-24 mb-10 flex flex-col items-center justify-center mx-auto max-w-4xl px-4">
          <h2 className="text-gradient2 text-center text-5xl font-bold">
            UPCOMING SCHOLARSHIPS
          </h2>

          {/* CARDS FOR SCHOLARSHIPS */}
          <div className="mt-8 mb-10 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingScholarships.length > 0 ? (
              upcomingScholarships.map((scholarship) => {
                const isFavorited = favoriteIds.has(scholarship.id.toString());
                return (
                  <div
                    key={scholarship.id}
                    className={`group bg-white rounded-2xl p-6 border-2 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 flex flex-col h-full ${
                      isFavorited
                        ? "border-secondary shadow-[0_4px_12px_rgba(0,126,167,0.2)]"
                        : "border-gray-100"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-2">
                        {scholarship.based && (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wide ${
                              scholarship.based
                                .toLowerCase()
                                .includes("need & merit") ||
                              scholarship.based.toLowerCase().includes("both")
                                ? "bg-indigo-50 text-indigo-700"
                                : scholarship.based
                                    .toLowerCase()
                                    .includes("merit")
                                ? "bg-purple-50 text-purple-700"
                                : scholarship.based
                                    .toLowerCase()
                                    .includes("need")
                                ? "bg-amber-50 text-amber-700"
                                : "bg-blue-50 text-blue-700"
                            }`}
                          >
                            {scholarship.based}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(scholarship);
                        }}
                        className="text-red-500 hover:text-red-600 transition-colors p-1 z-10 relative"
                        title={
                          user
                            ? favoriteIds.has(scholarship.id.toString())
                              ? "Remove from favorites"
                              : "Add to favorites"
                            : "Sign in to favorite"
                        }
                      >
                        {favoriteIds.has(scholarship.id.toString()) ? (
                          <FaHeart size={20} />
                        ) : (
                          <FaRegHeart size={20} />
                        )}
                      </button>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {scholarship.name}
                    </h3>

                    <div className="space-y-3 mb-6 flex-grow">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg
                          className="w-5 h-5 mr-3 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="truncate">
                          Deadline: {scholarship.deadline || "Open"}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <svg
                          className="w-5 h-5 mr-3 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="truncate">
                          Award: {scholarship.award || "Varies"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedScholarship(scholarship)}
                      className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-900 font-semibold rounded-xl transition-colors duration-200 border border-gray-100 flex items-center justify-center group/btn"
                    >
                      See Details
                      <svg
                        className="w-4 h-4 ml-2 text-gray-400 group-hover/btn:text-gray-900 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 text-center py-8 text-gray-500">
                <p>Loading upcoming scholarships...</p>
              </div>
            )}
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

            <div>
              <h3 className="text-3xl font-bold pb-1 ">Tomi Odugbemi</h3>
              <h3 className="text-xl  pb-3 ">
                Georgia Institute of Technology
              </h3>
              <p className="text-md text-wrap">
                Tomi discovered the perfect scholarship match through
                Scholarlink that helped fund her computer science degree at
                Georgia Tech. The platform's personalized recommendations and
                deadline tracking features made it easy for her to stay
                organized and apply to multiple opportunities, ultimately
                securing over $50,000 in scholarship funding.
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

            <div>
              <h3 className="text-3xl font-bold pb-1 ">Nathan Le</h3>
              <h3 className="text-xl  pb-3 ">University of Georgia</h3>
              <p className="text-md text-wrap">
                Nathan used Scholarlink to find need-based scholarships that
                aligned with his background in business administration. The
                platform's filtering system helped him identify opportunities
                specifically for first-generation college students, leading to a
                full-tuition scholarship at the University of Georgia that made
                his dream of higher education a reality.
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
}

export default Home;
