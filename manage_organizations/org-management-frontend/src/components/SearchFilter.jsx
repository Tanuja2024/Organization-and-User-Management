import React from "react";
import { FaSearch } from "react-icons/fa";

export default function SearchFilter({ searchQuery, setSearchQuery, resultCount }) {
  return (
    <div className="flex justify-center mb-6">
      <div className="flex items-center gap-6"> {/* Increased gap from gap-3 to gap-6 (24px) */}
        {/* Lighter Purple Search Icon - Outside the box with larger gap */}
        <div className="flex-shrink-0">
        <FaSearch 
            className="text-2xl" 
            style={{ color: '#a78bfa' }} // Explicit purple-400 color
          />{/* Changed from purple-600 to purple-400 */}
        </div>

        {/* White card with input and button */}
        <div className="bg-white rounded-xl shadow-md p-3 w-[450px] max-w-full">
          <div className="flex items-center gap-2">
            {/* Input */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search organizations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Clear button */}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm font-medium transition flex-shrink-0"
              >
                Clear
              </button>
            )}
          </div>

          {/* Result count */}
          {searchQuery && (
            <div className="mt-2 text-xs text-purple-700 text-center">
              Found {resultCount} organization{resultCount !== 1 && "s"} matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


