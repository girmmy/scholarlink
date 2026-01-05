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
      className="min-h-screen font-sans bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${blueFaintBg})` }}
    >
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow pt-20 md:pt-24 pb-20 px-4 sm:px-6 my-12 lg:px-8 max-w-7xl mx-auto">
          {/* HEADER SECTION */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl text-gradient1 font-bold text-gray-900 mb-4 text-center">
              Explore Scholarships
            </h1>
            <p className="text-gray-600 text-center text-lg max-w-2xl mx-auto">
              Find the perfect financial support for your education. Search
              through our curated list of opportunities.
            </p>
          </div>

          {/* SEARCH & FILTER BAR */}
          <div className="flex flex-col md:flex-row gap-4 mb-10 items-center">
            <div className="relative flex-1 w-full">
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
                className="block w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                value={searchQuery}
                onChange={handleFilteredSearch}
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              {[
                { id: "all", label: "All" },
                { id: "need", label: "Need-based" },
                { id: "merit", label: "Merit-based" },
                { id: "both", label: "Both" },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setBasedFilter(filter.id)}
                  className={`px-6 py-3.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-200 border ${
                    basedFilter === filter.id
                      ? "bg-gray-900 text-white border-gray-900 shadow-md"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
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

            {/* CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredScholarships.map((sch) => {
                const isFavorited = favoriteIds.has(sch.id.toString());
                return (
                  <div
                    key={sch.id}
                    className={`group bg-white rounded-2xl p-6 border-2 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 flex flex-col h-full ${
                      isFavorited
                        ? "border-secondary shadow-[0_4px_12px_rgba(0,126,167,0.2)]"
                        : "border-gray-100"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-2">
                        {sch.based && (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wide ${
                              sch.based
                                .toLowerCase()
                                .includes("need & merit") ||
                              sch.based.toLowerCase().includes("both")
                                ? "bg-indigo-50 text-indigo-700"
                                : sch.based.toLowerCase().includes("merit")
                                ? "bg-purple-50 text-purple-700"
                                : sch.based.toLowerCase().includes("need")
                                ? "bg-amber-50 text-amber-700"
                                : "bg-blue-50 text-blue-700"
                            }`}
                          >
                            {sch.based}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(sch);
                        }}
                        className="text-red-500 hover:text-red-600 transition-colors p-1 z-10"
                        title={
                          user
                            ? isFavorited
                              ? "Remove from favorites"
                              : "Add to favorites"
                            : "Sign in to favorite"
                        }
                      >
                        {isFavorited ? (
                          <FaHeart size={20} />
                        ) : (
                          <FaRegHeart size={20} />
                        )}
                      </button>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {sch.name}
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
                          Deadline: {sch.deadline || "Open"}
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
                          Award: {sch.award || "Varies"}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedScholarship(sch)}
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
