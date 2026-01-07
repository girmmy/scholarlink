import React, { useEffect, useState } from "react";
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
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScholarshipModal from "../components/ScholarshipModal";
import blueFaintBg from "../assets/blue-faint-bg.png";

const Favorites = () => {
  const [favoriteScholarships, setFavoriteScholarships] = useState([]);
  const [allScholarships, setAllScholarships] = useState([]);
  const [user, setUser] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    if (!auth) {
      console.warn("Firebase auth not initialized");
      navigate("/sign-up");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Redirect to sign-up if not logged in
        navigate("/sign-up");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Load all scholarships
  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const res = await fetch("/data/scholarships.json");
        if (!res.ok) {
          throw new Error("Failed to load scholarships.");
        }
        const data = await res.json();
        setAllScholarships(data);
      } catch (err) {
        console.error("Error loading scholarships:", err);
      }
    };

    fetchScholarships();
  }, []);

  // Load favorites when user and scholarships are available
  useEffect(() => {
    if (user && allScholarships.length > 0) {
      loadFavorites();
    }
  }, [user, allScholarships]);

  const loadFavorites = async () => {
    if (!user || !db) return;

    try {
      const favoritesQuery = query(
        collection(db, "favorites"),
        where("userId", "==", user.uid)
      );
      const favoritesSnapshot = await getDocs(favoritesQuery);
      const ids = new Set();
      const favoriteDocs = [];

      favoritesSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (!data.deleted) {
          ids.add(data.scholarshipId);
          favoriteDocs.push(data.scholarshipId);
        }
      });

      setFavoriteIds(ids);

      // Get the actual scholarship objects
      const favorites = allScholarships.filter((sch) =>
        ids.has(sch.id.toString())
      );
      setFavoriteScholarships(favorites);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading favorites:", error);
      setIsLoading(false);
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
      setFavoriteIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(scholarshipId);
        return newSet;
      });
      setFavoriteScholarships((prev) =>
        prev.filter((sch) => sch.id !== scholarship.id)
      );
    } else {
      setFavoriteIds((prev) => {
        const newSet = new Set(prev);
        newSet.add(scholarshipId);
        return newSet;
      });
      setFavoriteScholarships((prev) => [...prev, scholarship]);
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
        setFavoriteScholarships((prev) => [...prev, scholarship]);
      } else {
        setFavoriteIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(scholarshipId);
          return newSet;
        });
        setFavoriteScholarships((prev) =>
          prev.filter((sch) => sch.id !== scholarship.id)
        );
      }
    }
  };

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
              My Favorite Scholarships
            </h1>
            <p className="text-gray-600 text-center text-base sm:text-lg max-w-2xl mx-auto px-2">
              View and manage all your saved scholarship opportunities in one place.
            </p>
          </div>

          {/* CONTENT AREA */}
          <div className="min-h-[400px]">
            {isLoading && (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            )}

            {!isLoading && favoriteScholarships.length === 0 && (
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
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No favorite scholarships yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Start exploring scholarships and add them to your favorites!
                </p>
                <button
                  onClick={() => navigate("/scholarships")}
                  className="mt-4 px-6 py-2 bg-gradient2 text-white rounded-xl font-semibold hover:opacity-90 transition-all"
                >
                  Browse Scholarships
                </button>
              </div>
            )}

            {/* CARDS GRID - SAME DESIGN AS SCHOLARSHIPS PAGE */}
            {!isLoading && favoriteScholarships.length > 0 && (
              <>
                <div className="mb-6 text-center">
                  <span className="text-sm font-semibold text-gray-700 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm inline-block">
                    {favoriteScholarships.length}{" "}
                    {favoriteScholarships.length === 1
                      ? "scholarship"
                      : "scholarships"}{" "}
                    saved
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 w-full">
                  {favoriteScholarships.map((sch) => {
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
                              className="text-red-500 hover:text-red-600 transition-all duration-300 p-1 z-10 hover:scale-125 active:scale-100"
                              title="Remove from favorites"
                            >
                              {isFavorited ? (
                                <FaHeart size={18} className="animate-pulse" />
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
              </>
            )}
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

export default Favorites;

