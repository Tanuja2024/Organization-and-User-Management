import React, { useState, useEffect } from "react";

export default function EditOrgUserForm({ user, onUpdate }) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState(user?.role || "");
  const [documentFile, setDocumentFile] = useState(null);

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setRole(user?.role || "");
    setDocumentFile(null);
  }, [user]);

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocumentFile(file);
    }
  };

  const buildFormData = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("role", role);
    if (documentFile) formData.append("document", documentFile);
    return formData;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !role) {
      alert("Name, Email, and Role are required");
      return;
    }
    onUpdate(user.id, buildFormData());
  };

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-lg font-semibold">Edit Organization User</h2>

      <div>
        <label className="block mb-1 font-medium">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Role</label>
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Upload Document</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.png"
          onChange={handleDocumentChange}
          className="cursor-pointer w-full"
        />
      </div>
    

      <button 
  type="submit" 
  className="cursor-pointer primary-btn w-full"
>
  Save User
</button>

    </form>
  );
}
