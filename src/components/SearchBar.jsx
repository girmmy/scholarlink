import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);
  const navigate = useNavigate();

  // Fetch scholarships data
  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const res = await fetch("/data/scholarships.json");
        if (res.ok) {
          const data = await res.json();
          setScholarships(data);
        }
      } catch (err) {
        console.error("Failed to load scholarships:", err);
      }
    };
    fetchScholarships();
  }, []);

  // Filter suggestions based on query
  useEffect(() => {
    if (query.trim().length > 0) {
      setIsLoading(true);
      const normalizedQuery = query.toLowerCase().trim();
      const filtered = scholarships
        .filter((sch) => {
          return (
            sch.name?.toLowerCase().includes(normalizedQuery) ||
            sch.description?.toLowerCase().includes(normalizedQuery) ||
            sch.eligibility?.toLowerCase().includes(normalizedQuery)
          );
        })
        .slice(0, 5); // Show max 5 suggestions
      setSuggestions(filtered);
      setIsLoading(false);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, scholarships]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSuggestionClick = (scholarship) => {
    setQuery(scholarship.name);
    setShowSuggestions(false);
    navigate(`/scholarships?search=${encodeURIComponent(scholarship.name)}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      navigate(`/scholarships?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
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
            ref={searchRef}
            className="w-full rounded-3xl shadow-md mx-auto py-3 sm:py-4 pl-12 pr-4 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
            type="text"
            placeholder="Search for Scholarships..."
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => query.trim() && setShowSuggestions(true)}
          />
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (query.trim().length > 0 || suggestions.length > 0) && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-80 sm:max-h-96 overflow-y-auto"
        >
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-secondary mx-auto"></div>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="py-2">
              {suggestions.map((scholarship) => (
                <button
                  key={scholarship.id}
                  type="button"
                  onClick={() => handleSuggestionClick(scholarship)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <svg
                        className="h-5 w-5 text-secondary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {scholarship.name}
                      </p>
                      {scholarship.award && (
                        <p className="text-xs text-gray-500 mt-1">
                          Award: {scholarship.award}
                        </p>
                      )}
                      {scholarship.deadline && (
                        <p className="text-xs text-gray-500">
                          Deadline: {scholarship.deadline}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
              <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="text-sm text-secondary font-semibold hover:text-primary transition-colors"
                >
                  View all results for "{query}"
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              <p className="text-sm">No scholarships found</p>
              <p className="text-xs mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
