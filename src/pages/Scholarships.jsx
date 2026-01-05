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
  const [basedFilter, setBasedFilter] = useState("all"); // all | need | merit | both (for filter button, but data uses "NEED & MERIT BASED")
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

  const filteredScholarships = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase().trim();

    return scholarships.filter((sch) => {
      const matchesQuery =
        !normalizedQuery ||
        sch.name?.toLowerCase().includes(normalizedQuery) ||
        sch.description?.toLowerCase().includes(normalizedQuery) ||
        sch.eligibility?.toLowerCase().includes(normalizedQuery);

      if (!matchesQuery) return false;

      const basedValue = (sch.based || "").toLowerCase();

      if (basedFilter === "need") {
        return basedValue.includes("need");
      }
      if (basedFilter === "merit") {
        return basedValue.includes("merit");
      }
      if (basedFilter === "both") {
        return (
          basedValue.includes("both") ||
          basedValue.includes("NEED & MERIT BASED")
        );
      }

      return true; // "all"
    });
  }, [scholarships, searchQuery, basedFilter]);

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
          <div className="mb-8 md:mb-12">
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

                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "all", label: "All" },
                    { id: "need", label: "Need-based" },
                    { id: "merit", label: "Merit-based" },
                    { id: "both", label: "Both" },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setBasedFilter(filter.id)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                        basedFilter === filter.id
                          ? "bg-gradient2 text-white shadow-md transform scale-105"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
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
