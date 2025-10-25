import React, { useState } from "react";

export default function AddOrganization({ onAdd }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [language, setLanguage] = useState("English");
  const [maxCoordinators, setMaxCoordinators] = useState(5);
  const [status, setStatus] = useState("inactive");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Organization name is required");
      return;
    }
    const orgData = {
      name,
      email,
      phone,
      address,
      website,
      timezone,
      language,
      max_coordinators: maxCoordinators,
      status,
    };
    // Call the onAdd prop method to send data to API
    onAdd(orgData);
    // Clear form fields
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setWebsite("");
    setTimezone("Asia/Kolkata");
    setLanguage("English");
    setMaxCoordinators(5);
    setStatus("inactive");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold mb-4">Add Organization</h2>

      <div>
        <label className="block mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Organization Name"
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block mb-1">Phone</label>
        <input
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="Phone"
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block mb-1">Address</label>
        <input
          type="text"
          value={address}
          onChange={e => setAddress(e.target.value)}
          placeholder="Address"
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block mb-1">Website</label>
        <input
          type="url"
          value={website}
          onChange={e => setWebsite(e.target.value)}
          placeholder="Website URL"
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block mb-1">Timezone</label>
        <input
          type="text"
          value={timezone}
          onChange={e => setTimezone(e.target.value)}
          placeholder="Timezone"
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block mb-1">Language</label>
        <input
          type="text"
          value={language}
          onChange={e => setLanguage(e.target.value)}
          placeholder="Language"
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block mb-1">Max Coordinators</label>
        <input
          type="number"
          value={maxCoordinators}
          onChange={e => setMaxCoordinators(Number(e.target.value))}
          min="1"
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block mb-1">Status</label>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <button type="submit" className="cursor-pointer w-full">
        Add Organization
      </button>
    </form>
  );
}

