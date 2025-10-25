// src/components/ProfileEditForm.jsx
import React, { useState } from "react";

export default function ProfileEditForm({ user, onUpdate, onCancel }) {
  const [formData, setFormData] = useState({
    role: user.role || "",
    verification_status: user.verification_status || "",
    is_active: user.is_active || true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(user.id, formData);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
          >
            <option value="super_admin">Super Admin</option>
            <option value="org_admin">Org Admin</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Verification Status</label>
          <select
            name="verification_status"
            value={formData.verification_status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
          >
            <option value="verified">Verified</option>
            <option value="not_verified">Not Verified</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <label className="text-sm font-medium">Account Active</label>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            className="flex-1 bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
