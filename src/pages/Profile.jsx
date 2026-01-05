import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { auth, db } from "../config/firebase";
import { doc, getDoc, updateDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import ScholarshipModal from "../components/ScholarshipModal";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({
    name: "",
    age: "",
    grade: "",
    state: "",
    country: "",
    dreamSchool: "",
    bio: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [favoriteScholarships, setFavoriteScholarships] = useState([]);
  const [allScholarships, setAllScholarships] = useState([]);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) {
      console.warn("Firebase auth not initialized");
      navigate("/login");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setImageError(false); // Reset image error when user changes
        await loadUserData(currentUser.uid, currentUser);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      // Load scholarships and favorites in parallel, but don't block UI
      loadScholarships();
    }
  }, [user]);

  useEffect(() => {
    if (allScholarships.length > 0 && user) {
      // Load favorites after scholarships are loaded
      loadFavoriteScholarships();
    }
  }, [allScholarships, user]);

  // Refresh favorites when page becomes visible (user might have favorited from another page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user && allScholarships.length > 0) {
        loadFavoriteScholarships();
      }
    };

    const handleFocus = () => {
      if (user && allScholarships.length > 0) {
        loadFavoriteScholarships();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user, allScholarships]);

  const loadUserData = async (uid, currentUser = null) => {
    const authUser = currentUser || user;
    
    // Set default values immediately so UI can render
    const defaultData = {
      name: authUser?.displayName || authUser?.email?.split("@")[0] || "Name",
      age: "18",
      grade: "12",
      state: "GA",
      country: "USA",
      dreamSchool: "Harvard",
      bio: "No bio yet",
    };
    setUserData(defaultData);
    setIsLoading(false); // Allow UI to render immediately

    // Then try to load from Firestore in background
    if (!db) {
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData({
          name: data.name || authUser?.displayName || authUser?.email?.split("@")[0] || "Name",
          age: data.age || "18",
          grade: data.grade || "12",
          state: data.state || "GA",
          country: data.country || "USA",
          dreamSchool: data.dreamSchool || "Harvard",
          bio: data.bio || "No bio yet",
        });
      } else {
        // Create user document if it doesn't exist (non-blocking)
        setDoc(doc(db, "users", uid), {
          name: authUser?.displayName || authUser?.email?.split("@")[0] || "Name",
          email: authUser?.email || "",
          age: "18",
          grade: "12",
          state: "GA",
          country: "USA",
          dreamSchool: "Harvard",
          bio: "No bio yet",
          createdAt: new Date().toISOString(),
        }).catch(console.error);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      // Keep default values already set
    }
  };

  const loadScholarships = async () => {
    try {
      // Load all scholarships
      const res = await fetch("/data/scholarships.json");
      if (res.ok) {
        const data = await res.json();
        setAllScholarships(data);
      }
    } catch (error) {
      console.error("Error loading scholarships:", error);
    }
  };

  const loadFavoriteScholarships = async () => {
    if (!user || allScholarships.length === 0 || !db) return;

    try {
      const favoritesQuery = query(
        collection(db, "favorites"),
        where("userId", "==", user.uid)
      );
      const favoritesSnapshot = await getDocs(favoritesQuery);
      const favoriteDocs = favoritesSnapshot.docs.filter(
        (doc) => !doc.data().deleted
      );
      const favoriteIds = favoriteDocs.map((doc) => doc.data().scholarshipId);

      if (favoriteIds.length > 0) {
        const favorites = allScholarships.filter((sch) =>
          favoriteIds.includes(sch.id.toString())
        );
        setFavoriteScholarships(favorites);
      } else {
        // Clear favorites if none found
        setFavoriteScholarships([]);
      }
    } catch (error) {
      console.error("Error loading favorite scholarships:", error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setIsEditing(false); // Close edit mode immediately for better UX
    
    try {
      if (db && user) {
        // Await the update to ensure it completes
        await updateDoc(doc(db, "users", user.uid), {
          ...userData,
          updatedAt: new Date().toISOString(),
        });
        // Reload user data to ensure consistency
        await loadUserData(user.uid, user);
      }
    } catch (error) {
      console.error("Error saving user data:", error);
      setIsEditing(true); // Revert edit mode if save fails
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleFavorite = async (scholarship) => {
    if (!user) return;

    try {
      const favoriteRef = doc(
        db,
        "favorites",
        `${user.uid}_${scholarship.id}`
      );
      const favoriteDoc = await getDoc(favoriteRef);

      if (favoriteDoc.exists() && !favoriteDoc.data().deleted) {
        // Remove from favorites
        await updateDoc(favoriteRef, { deleted: true });
        setFavoriteScholarships((prev) =>
          prev.filter((sch) => sch.id !== scholarship.id)
        );
      } else {
        // Add to favorites
        await setDoc(favoriteRef, {
          userId: user.uid,
          scholarshipId: scholarship.id.toString(),
          addedAt: new Date().toISOString(),
          deleted: false,
        });
        setFavoriteScholarships((prev) => [...prev, scholarship]);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const isFavorite = (scholarshipId) => {
    return favoriteScholarships.some((sch) => sch.id === scholarshipId);
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              {user?.photoURL && !imageError ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white shadow-lg"
                  onError={() => setImageError(true)}
                  onLoad={() => setImageError(false)}
                />
              ) : (
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center text-white text-4xl sm:text-5xl font-bold">
                  {userData.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-grow">
              <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                ) : (
                  userData.name
                )}
              </h1>

              {/* Key Details */}
              <div className="flex flex-wrap gap-4 sm:gap-6 mb-4 text-sm sm:text-base">
                <div>
                  <span className="font-semibold text-gray-700">Age: </span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="age"
                      value={userData.age}
                      onChange={handleInputChange}
                      className="w-16 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  ) : (
                    <span className="text-gray-600">{userData.age}</span>
                  )}
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Grade: </span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="grade"
                      value={userData.grade}
                      onChange={handleInputChange}
                      className="w-16 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  ) : (
                    <span className="text-gray-600">{userData.grade}</span>
                  )}
                </div>
                <div>
                  <span className="font-semibold text-gray-700">State, Country: </span>
                  {isEditing ? (
                    <div className="inline-flex gap-2">
                      <input
                        type="text"
                        name="state"
                        value={userData.state}
                        onChange={handleInputChange}
                        placeholder="State"
                        className="w-16 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-secondary"
                      />
                      <input
                        type="text"
                        name="country"
                        value={userData.country}
                        onChange={handleInputChange}
                        placeholder="Country"
                        className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-secondary"
                      />
                    </div>
                  ) : (
                    <span className="text-gray-600">
                      {userData.state}, {userData.country}
                    </span>
                  )}
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Dream School: </span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="dreamSchool"
                      value={userData.dreamSchool}
                      onChange={handleInputChange}
                      className="w-32 sm:w-40 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  ) : (
                    <span className="text-gray-600">{userData.dreamSchool}</span>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="mt-4">
                <span className="font-semibold text-gray-700 block mb-2">Bio:</span>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={userData.bio}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
                  />
                ) : (
                  <p className="text-gray-600 text-sm sm:text-base">{userData.bio}</p>
                )}
              </div>

              {/* Edit Info Button */}
              <div className="mt-6">
                {isEditing ? (
                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-6 py-2 bg-gradient1 text-white rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 bg-gradient1 text-white rounded-xl font-semibold hover:opacity-90 transition-all"
                  >
                    Edit Info
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Favorite Scholarships Section */}
        <div className="mt-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary text-center mb-8">
            Favorite Scholarships
          </h2>

          {favoriteScholarships.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
              <p className="text-gray-600 text-lg mb-4">No favorite scholarships yet</p>
              <a
                href="/scholarships"
                className="text-secondary font-semibold hover:text-primary transition-colors"
              >
                Browse Scholarships →
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {favoriteScholarships.map((scholarship) => (
                <div
                  key={scholarship.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900 flex-1">
                      {scholarship.name}
                    </h3>
                    <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      Favorited!
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 italic mb-3">
                    {scholarship.website || "Name of donors"}
                  </p>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {scholarship.description || "No description available."}
                  </p>

                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => setSelectedScholarship(scholarship)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm"
                    >
                      See More
                    </button>
                    <button
                      onClick={() => toggleFavorite(scholarship)}
                      className="text-red-500 hover:text-red-600 transition-colors"
                    >
                      {isFavorite(scholarship.id) ? (
                        <FaHeart size={20} />
                      ) : (
                        <FaRegHeart size={20} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Scholarship Modal */}
      {selectedScholarship && (
        <ScholarshipModal
          scholarship={selectedScholarship}
          onClose={() => setSelectedScholarship(null)}
        />
      )}
    </div>
  );
};

export default Profile;
