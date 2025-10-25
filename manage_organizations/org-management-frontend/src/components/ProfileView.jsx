// src/components/ProfileView.jsx
import React from "react";

export default function ProfileView({ user, onEditClick }) {
  if (!user) {
    return (
      <div className="p-6">
        <p className="text-gray-500">No user data available</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Profile Details</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">Email</label>
          <p className="text-base text-gray-800">{user.email || "N/A"}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Role</label>
          <p className="text-base text-gray-800 capitalize">
            {user.role?.replace('_', ' ') || "N/A"}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Organization</label>
          <p className="text-base text-gray-800">{user.org?.name || "N/A"}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Verification Status</label>
          <p className="text-base text-gray-800 capitalize">
            {user.verification_status?.replace('_', ' ') || "N/A"}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Account Status</label>
          <p className="text-base text-gray-800">
            {user.is_active ? "Active" : "Inactive"}
          </p>
        </div>
      </div>

      <button
        onClick={onEditClick}
        className="mt-6 w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
      >
        Edit Profile
      </button>
    </div>
  );
}


