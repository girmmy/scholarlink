import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const ScholarshipModal = ({ scholarship, onClose, user, favoriteIds, onToggleFavorite, navigate }) => {
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
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header with blue top border/accent logic if needed, but keeping it clean for now */}
        <div className="relative p-6 md:p-8 space-y-6">
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleFavoriteClick();
              }}
              className="p-2 text-red-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors z-10"
              title={user ? (isFavorited ? "Remove from favorites" : "Add to favorites") : "Sign in to favorite"}
              aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorited ? (
                <FaHeart size={24} />
              ) : (
                <FaRegHeart size={24} />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2 pr-16">{scholarship.name}</h2>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-3">
              <div className="flex items-center gap-1.5">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">Due:</span> {scholarship.deadline || "Open"}
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Amount:</span> {scholarship.award || "Varies"}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {scholarship.description || "No description available."}
              </p>
            </div>

            {(scholarship.requirements || scholarship.eligibility) && (
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements & Eligibility</h3>
                <div className="space-y-3 text-gray-700 text-sm">
                  {scholarship.eligibility && (
                    <div className="flex gap-2">
                      <span className="font-medium min-w-[80px]">Eligibility:</span>
                      <span>{scholarship.eligibility}</span>
                    </div>
                  )}
                  {scholarship.requirements && (
                    <div className="flex gap-2">
                       <span className="font-medium min-w-[80px]">Must have:</span>
                       <span>{scholarship.requirements}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Contact info if standard apply link shouldn't cover it? 
                The design usually implies a big CTA button. */}
          </div>

          <div className="pt-4 flex justify-end">
            {scholarship.website && (
               <a 
                 href={scholarship.website.startsWith("http") ? scholarship.website : `http://${scholarship.website}`}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="inline-flex items-center justify-center px-8 py-3 bg-gradient2 hover:bg-gradient1 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
               >
                 Send Application Now
                 <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                 </svg>
               </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipModal;
