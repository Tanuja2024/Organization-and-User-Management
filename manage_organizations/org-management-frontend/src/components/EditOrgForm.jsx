import React, { useState, useEffect } from "react";

export default function EditOrgForm({ org, onUpdate }) {
  const [name, setName] = useState(org?.name || "");
  const [orgSlug, setOrgSlug] = useState(org?.org_slug || "");
  const [email, setEmail] = useState(org?.email || "");
  const [phone, setPhone] = useState(org?.phone || "");
  const [address, setAddress] = useState(org?.address || "");
  const [logoUrl, setLogoUrl] = useState(org?.logo || "");
  const [logoFile, setLogoFile] = useState(null);
  const [pendingRequests, setPendingRequests] = useState(org?.pending_requests || 0);
  const [timezone, setTimezone] = useState(org?.timezone || "");
  const [language, setLanguage] = useState(org?.language || "");
  const [website, setWebsite] = useState(org?.website || "");
  const [maxCoordinators, setMaxCoordinators] = useState(org?.max_coordinators || 0);
  const [status, setStatus] = useState(org?.status || "");

  useEffect(() => {
    setName(org?.name || "");
    setOrgSlug(org?.org_slug || "");
    setEmail(org?.email || "");
    setPhone(org?.phone || "");
    setAddress(org?.address || "");
    setLogoUrl(org?.logo || "");
    setLogoFile(null);
    setPendingRequests(org?.pending_requests || 0);
    setTimezone(org?.timezone || "");
    setLanguage(org?.language || "");
    setWebsite(org?.website || "");
    setMaxCoordinators(org?.max_coordinators || 0);
    setStatus(org?.status || "");
  }, [org]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Always construct FormData fresh, call this for every submit or after a token refresh!
  const buildFormData = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("org_slug", orgSlug);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    if (logoFile) formData.append("logo", logoFile);
    formData.append("pending_requests", pendingRequests);
    formData.append("timezone", timezone);
    formData.append("language", language);
    formData.append("website", website);
    formData.append("max_coordinators", maxCoordinators);
    formData.append("status", status);

    // LOG your FormData for debugging before sending
    for (let pair of formData.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }

    return formData;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!name || !orgSlug || !email) {
      alert("Name, slug, and email are required");
      return;
    }
  
    if (!org?.id) {
      alert("Organization ID is missing!");
      return;
    }
  
   
    onUpdate(org.id, buildFormData());
  };
  

  if (!org) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">Edit Organization</h2>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1">Organization Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Organization Slug</label>
          <input type="text" value={orgSlug} onChange={e => setOrgSlug(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Address</label>
          <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Logo Upload</label>
          {logoUrl && <img src={logoUrl} alt="Logo Preview" className="mb-2 w-32 h-32 object-cover rounded" />}
          <input type="file" accept="image/*" onChange={handleLogoChange} className="w-full" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Website</label>
          <input type="text" value={website} onChange={e => setWebsite(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Pending Requests</label>
          <input type="number" min="0" value={pendingRequests} onChange={e => setPendingRequests(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Max Coordinators</label>
          <input type="number" min="0" value={maxCoordinators} onChange={e => setMaxCoordinators(+e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Timezone</label>
          <input type="text" value={timezone} onChange={e => setTimezone(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Language</label>
          <input type="text" value={language} onChange={e => setLanguage(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
            <option value="">Select status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      <button type="submit" className="cursor-pointer primary-btn w-full mt-2">Save Changes</button>
    </form>
  );
}
