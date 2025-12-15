import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";

const Scholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [basedFilter, setBasedFilter] = useState("all"); // all | need | merit | both
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedCards, setExpandedCards] = useState(new Set());

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
        setError("Unable to load scholarships right now. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleBasedFilterChange = (value) => {
    setBasedFilter(value);
  };

  const toggleCardExpansion = (id) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
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
        return basedValue.includes("both");
      }

      return true; // "all"
    });
  }, [scholarships, searchQuery, basedFilter]);

  const renderWebsiteLink = (website) => {
    if (!website) return null;

    const isUrl = website.startsWith("http://") || website.startsWith("https://");

    if (isUrl) {
      return (
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Visit website
        </a>
      );
    }

    return <span className="text-gray-700">{website}</span>;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <main className="pt-28 pb-16 max-w-5xl mx-auto px-4">
        {/* HEADER */}
        <section className="mb-10">
          <h1 className="text-5xl md:text-6xl font-bold text-gradient1 text-center mb-4">
            Scholarships
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto text-lg">
            Browse curated scholarships with key information like eligibility,
            award amounts, deadlines, and more. Use the search and filters to
            quickly find opportunities that fit you.
          </p>
        </section>

        {/* SEARCH + FILTERS */}
        <section className="mb-10">
          <div className="flex flex-col gap-4">
            <SearchBar onSearch={handleSearch} />

            <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-2">
              <button
                type="button"
                onClick={() => handleBasedFilterChange("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                  basedFilter === "all"
                    ? "bg-gradient2 text-white border-transparent"
                    : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                }`}
              >
                All types
              </button>
              <button
                type="button"
                onClick={() => handleBasedFilterChange("need")}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                  basedFilter === "need"
                    ? "bg-gradient2 text-white border-transparent"
                    : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                }`}
              >
                Need-based
              </button>
              <button
                type="button"
                onClick={() => handleBasedFilterChange("merit")}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                  basedFilter === "merit"
                    ? "bg-gradient2 text-white border-transparent"
                    : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                }`}
              >
                Merit-based
              </button>
              <button
                type="button"
                onClick={() => handleBasedFilterChange("both")}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                  basedFilter === "both"
                    ? "bg-gradient2 text-white border-transparent"
                    : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                }`}
              >
                Need + Merit / Both
              </button>
            </div>
          </div>

          {/* STATUS MESSAGE */}
          <div className="mt-4 text-sm text-gray-600">
            {isLoading && <span>Loading scholarships…</span>}
            {!isLoading && !error && (
              <span>
                Showing{" "}
                <span className="font-semibold">{filteredScholarships.length}</span>{" "}
                of{" "}
                <span className="font-semibold">{scholarships.length}</span>{" "}
                scholarships
              </span>
            )}
            {error && <span className="text-red-600">{error}</span>}
          </div>
        </section>

        {/* LIST */}
        <section className="space-y-6">
          {!isLoading && !error && filteredScholarships.length === 0 && (
            <div className="text-center text-gray-600 bg-white rounded-xl py-12 shadow-sm border border-dashed border-gray-300">
              <p className="text-lg font-medium mb-1">
                No scholarships match your search yet.
              </p>
              <p className="text-sm">
                Try changing your keywords or clearing some filters.
              </p>
            </div>
          )}

          {filteredScholarships.map((sch) => {
            const isExpanded = expandedCards.has(sch.id);
            const descriptionPreview = sch.description
              ? sch.description.length > 150
                ? sch.description.substring(0, 150) + "..."
                : sch.description
              : null;

            return (
              <article
                key={sch.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5 md:p-6"
              >
                <header className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      {sch.name}
                    </h2>
                    {sch.website && (
                      <div className="mt-1 text-sm">
                        {renderWebsiteLink(sch.website)}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {sch.based && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                        {sch.based}
                      </span>
                    )}
                    {sch.deadline && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-medium border border-orange-100">
                        Deadline: {sch.deadline}
                      </span>
                    )}
                    {sch.award && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
                        Award: {sch.award}
                      </span>
                    )}
                  </div>
                </header>

                {descriptionPreview && (
                  <p className="text-gray-700 text-sm md:text-base mb-4">
                    {isExpanded && sch.description
                      ? sch.description
                      : descriptionPreview}
                  </p>
                )}

                {isExpanded && (
                  <div className="grid gap-4 md:grid-cols-3 text-sm mt-4 pt-4 border-t border-gray-200">
                    {sch.eligibility && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Eligibility
                        </h3>
                        <p className="text-gray-700">{sch.eligibility}</p>
                      </div>
                    )}

                    {sch.requirements && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Key requirements
                        </h3>
                        <p className="text-gray-700">{sch.requirements}</p>
                      </div>
                    )}

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Contact
                      </h3>
                      <p className="text-gray-700">
                        {sch.email && (
                          <>
                            <span className="font-medium">Email: </span>
                            {sch.email}
                            <br />
                          </>
                        )}
                        {sch.phone && (
                          <>
                            <span className="font-medium">Phone: </span>
                            {sch.phone}
                          </>
                        )}
                        {!sch.email && !sch.phone && (
                          <span className="text-gray-500">
                            See website for contact details.
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <button
                    onClick={() => toggleCardExpansion(sch.id)}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200 flex items-center gap-1"
                  >
                    {isExpanded ? (
                      <>
                        <span>Show less</span>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                      </>
                    ) : (
                      <>
                        <span>More</span>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Scholarships;

