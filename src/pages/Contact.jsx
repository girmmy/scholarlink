import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import blueFaintBg from "../assets/blue-faint-bg.png";

const Contact = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    // User info
    name: "",
    email: "",
    // Scholarship details
    scholarshipName: "",
    website: "",
    description: "",
    eligibility: "",
    deadline: "",
    award: "",
    scholarshipEmail: "",
    scholarshipPhone: "",
    whyRecommend: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Suggest a Scholarship - ScholarLink";
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = "https://formspree.io/f/meeovqky";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        navigate("/suggestion-confirmation");
      } else {
        alert("Failed to send suggestion. Please try again later.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat relative overflow-x-hidden w-full"
      style={{ backgroundImage: `url(${blueFaintBg})` }}
    >
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        <Navbar />
        <main className="flex-grow pt-20 md:pt-24">
          <div className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gradient1 mb-4 text-center">
              Suggest a Scholarship
            </h1>
            <p className="text-gray-600 text-center text-lg mb-8 max-w-2xl mx-auto">
              Know a scholarship that should be featured? Help other students by sharing it with us!
            </p>

            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Your Information Section */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>Your Information</span>
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        Your Name
                      </label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        Your Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="your.email@example.com"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Scholarship Details Section */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <svg
                      className="w-6 h-6 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    <span>Scholarship Details</span>
                  </h2>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        Scholarship Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="scholarshipName"
                        value={form.scholarshipName}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Smith Family Education Scholarship"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        Website <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={form.website}
                        onChange={handleChange}
                        required
                        pattern="https?://.+"
                        placeholder="https://www.example.com/scholarship"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary bg-white"
                      />
                      <p className="text-xs text-gray-500 mt-1">Include http:// or https://</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="description"
                        rows="4"
                        value={form.description}
                        onChange={handleChange}
                        required
                        placeholder="Briefly describe what this scholarship offers..."
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary bg-white resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        Eligibility Requirements <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="eligibility"
                        rows="3"
                        value={form.eligibility}
                        onChange={handleChange}
                        required
                        placeholder="Who is eligible? (grade level, GPA requirements, etc.)"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary bg-white resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          Deadline
                        </label>
                        <input
                          type="text"
                          name="deadline"
                          value={form.deadline}
                          onChange={handleChange}
                          placeholder="e.g., March 15, 2026 or Rolling"
                          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          Award Amount
                        </label>
                        <input
                          type="text"
                          name="award"
                          value={form.award}
                          onChange={handleChange}
                          placeholder="e.g., $1,000 or Varies"
                          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          Contact Email
                        </label>
                        <input
                          type="email"
                          name="scholarshipEmail"
                          value={form.scholarshipEmail}
                          onChange={handleChange}
                          placeholder="scholarship@example.com"
                          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          Contact Phone
                        </label>
                        <input
                          type="tel"
                          name="scholarshipPhone"
                          value={form.scholarshipPhone}
                          onChange={handleChange}
                          placeholder="(555) 123-4567"
                          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        Why Should We Feature This? <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="whyRecommend"
                        rows="3"
                        value={form.whyRecommend}
                        onChange={handleChange}
                        required
                        placeholder="Why do you think this scholarship should be featured on ScholarLink?"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary bg-white resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                  <p className="text-sm text-gray-700 text-center">
                    <span className="font-semibold">After submission:</span> Our team will review your suggestion and, if it meets our criteria, we'll add it to our database to help other students discover this opportunity!
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient2 text-white font-semibold py-3.5 rounded-lg hover:opacity-90 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {loading ? "Submitting..." : "Submit Suggestion"}
                </button>
              </form>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Contact;
