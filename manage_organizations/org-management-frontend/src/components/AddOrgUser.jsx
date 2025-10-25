import React, { useState } from "react";

export default function AddOrgUser({ onAddUser, organizationId }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [documentFile, setDocumentFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !role || !email) {
      return alert("Please fill user name, email and select role");
    }
    const userData = { name, email, role };
    if (documentFile) {
      userData.document = documentFile; // file to be handled in api via FormData
    }
    onAddUser(userData, organizationId);
    setName("");
    setEmail("");
    setRole("");
    setDocumentFile(null);
  };

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    if (file) setDocumentFile(file);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Add Organization User</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">User Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          placeholder="Enter user name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          placeholder="Enter email"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="">-- Select Role --</option>
          <option value="admin">Admin</option>
          <option value="coordinator">Coordinator</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Document</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.png"
          onChange={handleDocumentChange}
          className="cursor-pointer w-full"
        />
      </div>

      <button type="submit" className="cursor-pointer primary-btn w-full">
        Add User
      </button>
    </form>
  );
}
