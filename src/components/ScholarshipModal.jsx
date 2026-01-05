import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const ScholarshipModal = ({
  scholarship,
  onClose,
  user,
  favoriteIds,
  onToggleFavorite,
  navigate,
}) => {
  if (!scholarship) return null;

  const isFavorited = favoriteIds?.has(scholarship.id.toString());

  const handleFavoriteClick = () => {
    if (!user) {
      navigate?.("/sign-up");
      return;
    }
    onToggleFavorite?.(scholarship);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-auto overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with blue top border/accent logic if needed, but keeping it clean for now */}
        <div className="relative p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[85vh]">
          <div className="absolute top-4 right-4 flex gap-2 z-20">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleFavoriteClick();
              }}
              className="p-2 text-red-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors z-10"
              title={
                user
                  ? isFavorited
                    ? "Remove from favorites"
                    : "Add to favorites"
                  : "Sign in to favorite"
              }
              aria-label={
                isFavorited ? "Remove from favorites" : "Add to favorites"
              }
            >
              {isFavorited ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 pr-12 break-words">
              {scholarship.name}
            </h2>
            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="font-medium">Due:</span>{" "}
                {scholarship.deadline || "Open"}
              </div>
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-5 h-5 text-gray-400"
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
                <span className="font-medium">Amount:</span>{" "}
                {scholarship.award || "Varies"}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                Description
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed break-words">
                {scholarship.description || "No description available."}
              </p>
            </div>

            {(scholarship.requirements || scholarship.eligibility) && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <h3 className="text-base font-semibold text-gray-900 mb-3">
                  Requirements & Eligibility
                </h3>
                <div className="space-y-2.5 text-gray-700 text-sm">
                  {scholarship.eligibility && (
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">Eligibility:</span>
                      <span className="break-words">
                        {scholarship.eligibility}
                      </span>
                    </div>
                  )}
                  {scholarship.requirements && (
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">Must have:</span>
                      <span className="break-words">
                        {scholarship.requirements}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end">
            {scholarship.website &&
              (() => {
                const getWebsiteUrl = (website) => {
                  if (!website) return null;

                  // If it already starts with http/https, use it as is
                  if (
                    website.startsWith("http://") ||
                    website.startsWith("https://")
                  ) {
                    return website;
                  }

                  // If it starts with www., add https://
                  if (website.startsWith("www.")) {
                    return `https://${website}`;
                  }

                  // Check if it contains a domain extension (likely a URL)
                  const hasDomain =
                    /\.(com|org|edu|net|gov|io|co|us|uk|ca|au|de|fr|es|it|nl|se|no|dk|fi|pl|cz|at|ch|be|ie|pt|gr|ro|hu|bg|hr|sk|si|lt|lv|ee|lu|mt|cy|is|li|mc|ad|sm|va|mk|al|rs|me|ba|xk|md|ua|by|ru|ge|am|az|kz|uz|tm|tj|kg|mn|cn|jp|kr|in|sg|my|th|ph|id|vn|tw|hk|mo|nz|za|eg|ma|tn|dz|ly|sd|et|ke|ug|tz|rw|gh|ng|sn|ci|cm|cd|ao|mz|zm|zw|bw|na|sz|ls|mg|mu|sc|km|dj|er|so|ss|bi|td|ne|ml|bf|mr|gm|gw|gn|sl|lr|tg|bj|cf|cg|cm|ga|gq|st|mx|gt|bz|sv|hn|ni|cr|pa|cu|jm|ht|do|pr|tt|bb|gd|lc|vc|ag|dm|kn|bs|ai|vg|ky|bm|tc|ms|aw|cw|sx|bq|gs|sh|ac|io|pn|nf|tk|nu|nz|au|fj|pg|sb|vu|nc|pf|wf|as|gu|mp|pw|mh|fm|ki|tv|nr|ck|ws|to)/i.test(
                      website
                    );

                  if (hasDomain) {
                    return `https://${website}`;
                  }

                  // Otherwise, it's probably just text, return null
                  return null;
                };

                const websiteUrl = getWebsiteUrl(scholarship.website);

                if (websiteUrl) {
                  return (
                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-2.5 bg-gradient2 hover:bg-gradient1 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      Visit Website
                      <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  );
                } else {
                  // Website is not a valid URL, show message
                  return (
                    <div className="text-sm text-gray-500 italic">
                      Website: {scholarship.website} (URL needs to be updated)
                    </div>
                  );
                }
              })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipModal;
