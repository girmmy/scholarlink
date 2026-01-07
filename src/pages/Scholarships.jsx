import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScholarshipModal from "../components/ScholarshipModal";
import blueFaintBg from "../assets/blue-faint-bg.png";

const Scholarships = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [scholarships, setScholarships] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [basedFilter, setBasedFilter] = useState("all"); // all | need | merit | need-and-merit
  const [amountFilter, setAmountFilter] = useState("all"); // all | under-5k | 5k-10k | 10k-25k | 25k-50k | 50k-plus | full-tuition | varies
  const [deadlineFilter, setDeadlineFilter] = useState("all"); // all | upcoming | this-month | this-year | open
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [user, setUser] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const navigate = useNavigate();

  // Read search query from URL params on mount and when params change
  useEffect(() => {
    const urlSearchQuery = searchParams.get("search");
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery);
    }
  }, [searchParams]);

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
    const fetchScholarships = async () => {
      try {
        const res = await fetch("/data/scholarships.json");
        if (!res.ok) {
          throw new Error("Failed to load scholarships.");
        }
        const data = await res.json();
        setScholarships(data);
      } catch (err) {
        console.error(err);
        setError(
          "Unable to load scholarships right now. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  const handleFilteredSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Update URL params when search changes
    if (value.trim()) {
      setSearchParams({ search: value.trim() });
    } else {
      setSearchParams({});
    }
  };

  // Helper function to parse award amount
  const parseAwardAmount = (awardStr) => {
    if (!awardStr) return { min: 0, max: Infinity, type: "varies" };
    
    const lowerAward = awardStr.toLowerCase();
    
    // Check for "full tuition" or similar
    if (lowerAward.includes("full tuition") || lowerAward.includes("full cost")) {
      return { min: Infinity, max: Infinity, type: "full-tuition" };
    }
    
    // Extract dollar amounts using regex
    const dollarMatches = awardStr.match(/\$?([\d,]+)/g);
    if (!dollarMatches || dollarMatches.length === 0) {
      return { min: 0, max: Infinity, type: "varies" };
    }
    
    // Parse numbers (remove $ and commas)
    const amounts = dollarMatches.map(match => {
      const num = parseInt(match.replace(/[$,]/g, ''), 10);
      return isNaN(num) ? 0 : num;
    }).filter(n => n > 0);
    
    if (amounts.length === 0) {
      return { min: 0, max: Infinity, type: "varies" };
    }
    
    const min = Math.min(...amounts);
    const max = Math.max(...amounts);
    
    // If it's a range, use the range; otherwise use the single value for both
    return { min, max: amounts.length > 1 ? max : min, type: "amount" };
  };

  // Helper function to check deadline
  const checkDeadline = (deadlineStr) => {
    if (!deadlineStr) return { type: "open" };
    
    const lowerDeadline = deadlineStr.toLowerCase();
    
    if (lowerDeadline.includes("open") || lowerDeadline.includes("rolling")) {
      return { type: "open" };
    }
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    // Try to parse date
    const monthMap = {
      january: 0, jan: 0, february: 1, feb: 1, march: 2, mar: 2,
      april: 3, apr: 3, may: 4, june: 5, jun: 5, july: 6, jul: 6,
      august: 7, aug: 7, september: 8, sep: 8, october: 9, oct: 9,
      november: 10, nov: 10, december: 11, dec: 11
    };
    
    // Try format: "February 13,2026" or "February 13, 2026"
    let match = deadlineStr.match(/(\w+)\s+(\d+)[,\s]+(\d{4})/i);
    if (match) {
      const [, month, day, year] = match;
      const monthIndex = monthMap[month.toLowerCase()];
      if (monthIndex !== undefined) {
        const deadlineDate = new Date(parseInt(year), monthIndex, parseInt(day));
        return { type: "date", date: deadlineDate };
      }
    }
    
    // Try format: "March 2026"
    match = deadlineStr.match(/(\w+)\s+(\d{4})/i);
    if (match) {
      const [, month, year] = match;
      const monthIndex = monthMap[month.toLowerCase()];
      if (monthIndex !== undefined) {
        const deadlineDate = new Date(parseInt(year), monthIndex, 1);
        return { type: "date", date: deadlineDate };
      }
    }
    
    return { type: "unknown" };
  };

  const filteredScholarships = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase().trim();

    return scholarships.filter((sch) => {
      // Text search filter
      const matchesQuery =
        !normalizedQuery ||
        sch.name?.toLowerCase().includes(normalizedQuery) ||
        sch.description?.toLowerCase().includes(normalizedQuery) ||
        sch.eligibility?.toLowerCase().includes(normalizedQuery);

      if (!matchesQuery) return false;

      // Based filter (Need/Merit)
      const basedValue = (sch.based || "").toLowerCase();
      
      if (basedFilter === "need") {
        // Need-based only (has "need" but not "merit" or "both")
        if (!basedValue.includes("need")) return false;
        if (basedValue.includes("merit") || basedValue.includes("both")) return false;
      }
      if (basedFilter === "merit") {
        // Merit-based only (has "merit" but not "need" or "both")
        if (!basedValue.includes("merit")) return false;
        if (basedValue.includes("need") || basedValue.includes("both")) return false;
      }
      if (basedFilter === "need-and-merit") {
        // Need & Merit based (has both keywords or "both")
        if (!(basedValue.includes("need & merit") || 
              basedValue.includes("need and merit") || 
              (basedValue.includes("need") && basedValue.includes("merit")) ||
              basedValue.includes("both"))) {
          return false;
        }
      }

      // Amount filter
      if (amountFilter !== "all") {
        const awardInfo = parseAwardAmount(sch.award);
        
        if (amountFilter === "under-5k") {
          // Max should be less than 5000
          if (awardInfo.type === "full-tuition" || awardInfo.max >= 5000) return false;
        } else if (amountFilter === "5k-10k") {
          // Range should overlap with 5000-10000
          if (awardInfo.type === "full-tuition") return false;
          if (awardInfo.max < 5000 || awardInfo.min > 10000) return false;
        } else if (amountFilter === "10k-25k") {
          // Range should overlap with 10000-25000
          if (awardInfo.type === "full-tuition") return false;
          if (awardInfo.max < 10000 || awardInfo.min > 25000) return false;
        } else if (amountFilter === "25k-50k") {
          // Range should overlap with 25000-50000
          if (awardInfo.type === "full-tuition") return false;
          if (awardInfo.max < 25000 || awardInfo.min > 50000) return false;
        } else if (amountFilter === "50k-plus") {
          // Min should be at least 50000
          if (awardInfo.type === "full-tuition") return false;
          if (awardInfo.min < 50000) return false;
        } else if (amountFilter === "full-tuition") {
          // Only full tuition
          if (awardInfo.type !== "full-tuition") return false;
        } else if (amountFilter === "varies") {
          // Varies or other non-specific amounts
          if (awardInfo.type === "full-tuition" || (awardInfo.type === "amount" && awardInfo.min > 0)) return false;
        }
      }

      // Deadline filter
      if (deadlineFilter !== "all") {
        const deadlineInfo = checkDeadline(sch.deadline);
        const now = new Date();
        
        if (deadlineFilter === "open") {
          if (deadlineInfo.type !== "open") return false;
        } else if (deadlineFilter === "upcoming") {
          if (deadlineInfo.type !== "date" || deadlineInfo.date <= now) return false;
        } else if (deadlineFilter === "this-month") {
          if (deadlineInfo.type !== "date") return false;
          const deadlineDate = deadlineInfo.date;
          if (deadlineDate.getFullYear() !== now.getFullYear() || 
              deadlineDate.getMonth() !== now.getMonth() ||
              deadlineDate <= now) return false;
        } else if (deadlineFilter === "this-year") {
          if (deadlineInfo.type !== "date") return false;
          const deadlineDate = deadlineInfo.date;
          if (deadlineDate.getFullYear() !== now.getFullYear() || 
              deadlineDate <= now) return false;
        }
      }

      return true;
    });
  }, [scholarships, searchQuery, basedFilter, amountFilter, deadlineFilter]);

  return (
    <div
      className="min-h-screen font-sans bg-cover bg-center bg-no-repeat relative w-full"
      style={{ backgroundImage: `url(${blueFaintBg})` }}
    >
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        <Navbar />

        <main className="flex-grow pt-20 md:pt-24 pb-20 px-3 sm:px-4 md:px-6 max-w-7xl mx-auto w-full">
          {/* HEADER SECTION */}
          <div className="mb-8 md:mb-12 mt-8 md:mt-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl text-gradient1 font-bold text-gray-900 mb-3 md:mb-4 text-center">
              Explore Scholarships
            </h1>
            <p className="text-gray-600 text-center text-base sm:text-lg max-w-2xl mx-auto px-2">
              Find the perfect financial support for your education. Search
              through our curated list of opportunities.
            </p>
          </div>

          {/* SEARCH & FILTER BAR - NEW DESIGN */}
          <div className="mb-8 md:mb-10">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-4 md:p-6 border border-white/20">
              <div className="flex flex-col gap-4">
                {/* Filter Header with Count and Clear Button */}
                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">
                      {filteredScholarships.length} {filteredScholarships.length === 1 ? 'scholarship' : 'scholarships'} found
                    </span>
                    {(basedFilter !== "all" || amountFilter !== "all" || deadlineFilter !== "all" || searchQuery.trim()) && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        Filters active
                      </span>
                    )}
                  </div>
                  {(basedFilter !== "all" || amountFilter !== "all" || deadlineFilter !== "all" || searchQuery.trim()) && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setBasedFilter("all");
                        setAmountFilter("all");
                        setDeadlineFilter("all");
                      }}
                      className="text-sm text-secondary hover:text-primary font-medium transition-colors flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Clear all filters
                    </button>
                  )}
                </div>
                
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search by name, eligibility..."
                    className="block w-full pl-11 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all shadow-sm"
                    value={searchQuery}
                    onChange={handleFilteredSearch}
                  />
                </div>

                {/* Filter Section - Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Type Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={basedFilter}
                      onChange={(e) => setBasedFilter(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all shadow-sm appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23374151'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.75rem center',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '2.5rem'
                      }}
                    >
                      <option value="all">All Types</option>
                      <option value="need">Need-based</option>
                      <option value="merit">Merit-based</option>
                      <option value="need-and-merit">Need and Merit Based</option>
                    </select>
                  </div>

                  {/* Amount Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Award Amount
                    </label>
                    <select
                      value={amountFilter}
                      onChange={(e) => setAmountFilter(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all shadow-sm appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23374151'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.75rem center',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '2.5rem'
                      }}
                    >
                      <option value="all">All Amounts</option>
                      <option value="under-5k">Under $5,000</option>
                      <option value="5k-10k">$5,000 - $10,000</option>
                      <option value="10k-25k">$10,000 - $25,000</option>
                      <option value="25k-50k">$25,000 - $50,000</option>
                      <option value="50k-plus">$50,000+</option>
                      <option value="full-tuition">Full Tuition</option>
                      <option value="varies">Varies</option>
                    </select>
                  </div>

                  {/* Deadline Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Deadline
                    </label>
                    <select
                      value={deadlineFilter}
                      onChange={(e) => setDeadlineFilter(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all shadow-sm appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23374151'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.75rem center',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '2.5rem'
                      }}
                    >
                      <option value="all">All Deadlines</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="this-month">This Month</option>
                      <option value="this-year">This Year</option>
                      <option value="open">Open/Rolling</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTENT AREA */}
          <div className="min-h-[400px]">
            {isLoading && (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            )}

            {!isLoading && !error && filteredScholarships.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                  <svg
                    className="h-8 w-8 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No scholarships found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or filters to find what you're
                  looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setBasedFilter("all");
                    setAmountFilter("all");
                    setDeadlineFilter("all");
                  }}
                  className="mt-4 text-primary font-medium hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* CARDS GRID - NEW DESIGN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 w-full">
              {filteredScholarships.map((sch) => {
                const isFavorited = favoriteIds.has(sch.id.toString());
                return (
                  <div
                    key={sch.id}
                    className={`group bg-white rounded-lg border transition-all duration-300 hover:shadow-xl flex flex-col h-full overflow-hidden cursor-pointer ${
                      isFavorited
                        ? "border-secondary shadow-lg ring-2 ring-secondary/20"
                        : "border-gray-200 shadow-sm hover:border-secondary/50"
                    }`}
                    onClick={() => setSelectedScholarship(sch)}
                  >
                    {/* Card Header */}
                    <div className="p-3 sm:p-4 pb-2">
                      <div className="flex justify-between items-start mb-2">
                        {sch.based && (
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase ${
                              sch.based
                                .toLowerCase()
                                .includes("need & merit") ||
                              sch.based.toLowerCase().includes("both")
                                ? "bg-indigo-100 text-indigo-800"
                                : sch.based.toLowerCase().includes("merit")
                                ? "bg-purple-100 text-purple-800"
                                : sch.based.toLowerCase().includes("need")
                                ? "bg-amber-100 text-amber-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {sch.based}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(sch);
                          }}
                          className="text-red-400 hover:text-red-600 transition-colors p-1 z-10"
                          title={
                            user
                              ? isFavorited
                                ? "Remove from favorites"
                                : "Add to favorites"
                              : "Sign in to favorite"
                          }
                        >
                          {isFavorited ? (
                            <FaHeart size={18} />
                          ) : (
                            <FaRegHeart size={18} />
                          )}
                        </button>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-secondary transition-colors leading-tight">
                        {sch.name}
                      </h3>
                    </div>

                    {/* Card Body */}
                    <div className="px-3 sm:px-4 pb-3 sm:pb-4 flex-grow space-y-2">
                      <div className="flex items-center text-xs text-gray-600">
                        <svg
                          className="w-3.5 h-3.5 mr-2 text-gray-400 flex-shrink-0"
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
                          {sch.deadline || "Open"}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <svg
                          className="w-3.5 h-3.5 mr-2 text-gray-400 flex-shrink-0"
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
                        <span className="truncate font-medium text-gray-900">
                          {sch.award || "Varies"}
                        </span>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedScholarship(sch);
                        }}
                        className="w-full py-2 bg-gradient2 hover:bg-gradient1 text-white text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        <Footer />

        {/* MODAL */}
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
    </div>
  );
};

export default Scholarships;
