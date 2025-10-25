// src/components/Header.jsx
// src/components/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";

export default function Header({ user, onSignupClick, onLoginClick, onProfileClick, onEditProfileClick, onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    // Add event listener when dropdown is open
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Organization and User Management</h1>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            {/* Profile Icon */}
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className=" cursor-pointer flex items-center gap-2 hover:bg-gray-100 rounded-full p-2 transition"
            >
              <FaUserCircle 
                className="text-purple-600" 
                style={{ width: '32px', height: '32px' }}
              />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-700">{user.email}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    onProfileClick();
                  }}
                  className="cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  View Profile
                </button>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    onEditProfileClick();
                  }}
                  className="cursor-pointerw-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  Update Profile
                </button>
              
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={onSignupClick}
              className="cursor-pointer px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              Sign Up
            </button>
            <button
              onClick={onLoginClick}
              className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </header>
  );
}


