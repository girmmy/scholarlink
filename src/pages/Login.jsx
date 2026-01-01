import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../config/firebase";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Check if Firebase auth is available
      if (!auth) {
        throw new Error("Firebase is not configured. Please check your environment variables.");
      }

      // Sign in user with email and password
      await signInWithEmailAndPassword(auth, formData.email, formData.password);

      // Navigate to home page after successful login
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      
      // Handle different Firebase auth errors
      let errorMessage = "An error occurred during login. Please try again.";
      
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email address.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password. Please try again.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later.";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your connection.";
          break;
        case "auth/configuration-not-found":
          errorMessage = "Firebase configuration error. Please contact support or check your environment setup.";
          console.error("Firebase configuration error. Make sure all environment variables are set in .env file");
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      
      setAuthError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError("");
    
    if (!auth || !googleProvider) {
      setAuthError("Google sign-in is not available. Please check your Firebase configuration.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Try to check/create user document in Firestore (non-blocking)
      if (db) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) {
            // Create user document in Firestore if it doesn't exist
            await setDoc(userDocRef, {
              name: user.displayName || "User",
              email: user.email,
              createdAt: new Date().toISOString(),
              age: "18",
              grade: "12",
              state: "GA",
              country: "USA",
              dreamSchool: "Harvard",
              bio: "No bio yet",
            });
          }
        } catch (firestoreError) {
          // If Firestore fails (offline, etc.), log but don't block sign-in
          console.warn("Firestore operation failed, but sign-in succeeded:", firestoreError);
          // User is still signed in, just Firestore sync failed
          // This will be retried when they access their profile
        }
      }

      // Navigate to home page after successful login
      navigate("/");
    } catch (error) {
      console.error("Google login error:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      
      let errorMessage = "An error occurred during Google sign-in. Please try again.";
      
      switch (error.code) {
        case "auth/popup-closed-by-user":
          errorMessage = "Sign-in popup was closed. Please try again.";
          break;
        case "auth/popup-blocked":
          errorMessage = "Popup was blocked by your browser. Please allow popups for this site.";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your connection.";
          break;
        case "auth/unauthorized-domain":
          errorMessage = "This domain is not authorized for Google sign-in. Please contact support.";
          console.error("Domain authorization error. Make sure your production domain is added to Firebase Console > Authentication > Settings > Authorized domains");
          break;
        case "auth/operation-not-allowed":
          errorMessage = "Google sign-in is not enabled. Please contact support.";
          console.error("Google sign-in method not enabled in Firebase Console");
          break;
        case "auth/configuration-not-found":
          errorMessage = "Firebase configuration error. Please contact support.";
          console.error("Firebase configuration error. Check environment variables in Netlify");
          break;
        default:
          errorMessage = error.message || errorMessage;
          // Log full error for debugging
          if (error.code) {
            console.error("Unhandled error code:", error.code);
          }
      }
      
      setAuthError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-4 sm:pt-32 sm:pb-16">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
            <h2 className="text-gradient1 text-center text-3xl sm:text-4xl font-bold mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600 text-center mb-6 sm:mb-8 text-sm sm:text-base">
              Login to your Scholarlink account
            </p>

            {/* Auth Error Message */}
            {authError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600 text-center">{authError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border text-sm sm:text-base ${
                    errors.email
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-secondary"
                  } focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border text-sm sm:text-base ${
                    errors.password
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-secondary"
                  } focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all`}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link
                  to="#"
                  className="text-sm text-secondary hover:text-primary transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient1 text-white py-2.5 sm:py-3 rounded-xl font-semibold text-base sm:text-lg hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl font-semibold text-base sm:text-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>

            {/* Signup Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/sign-up"
                  className="text-secondary font-semibold hover:text-primary transition-colors"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;

