import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function SignupForm({ onSignup, organizations, onSubmitPendingRequest }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [org, setOrg] = useState("");
  const [orgNotPresent, setOrgNotPresent] = useState(false);
  const [pendingOrgName, setPendingOrgName] = useState("");
  const [pendingOrgDetails, setPendingOrgDetails] = useState("");
  const [verificationDoc, setVerificationDoc] = useState(null);
  
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !role) {
      alert("Please fill all required fields.");
      return;
    }

    if (!verificationDoc) {
      alert("Please upload verification document.");
      return;
    }

    if (orgNotPresent) {
      if (!pendingOrgName) {
        alert("Please enter your organization name");
        return;
      }

      onSignup({ name, email, password, role, pending_org_name: pendingOrgName, verificationDoc });
    } else {
      if (!org) {
        alert("Please select your organization");
        return;
      }
      onSignup({ name, email, password, role, org, verificationDoc });
    }
  };

  const handleFileChange = (e) => {
    setVerificationDoc(e.target.files[0]);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div className="relative">
          <label>Password</label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-8 text-gray-500 hover:text-purple-600"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <div>
          <label>Role</label>
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select role</option>
            <option value="super_admin">Super Admin</option>
            <option value="org_admin">Org Admin</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="orgNotPresent"
            type="checkbox"
            checked={orgNotPresent}
            onChange={e => setOrgNotPresent(e.target.checked)}
          />
          <label htmlFor="orgNotPresent" className="text-sm">Your org is not present</label>
        </div>

        {!orgNotPresent ? (
          <div>
            <label>Organization</label>
            <select
              value={org}
              onChange={e => setOrg(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select organization</option>
              {organizations.map(o => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
          </div>
        ) : (
          <>
            <div>
              <label>Organization Name</label>
              <input
                value={pendingOrgName}
                onChange={e => setPendingOrgName(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter your organization name"
                required
              />
            </div>
            <div>
              <label>Organization Details (optional)</label>
              <textarea
                value={pendingOrgDetails}
                onChange={e => setPendingOrgDetails(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Describe your organization"
              />
            </div>
          </>
        )}

        <div>
          <label>Verification Document</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full border rounded px-3 py-2"
            accept="application/pdf, image/*"
            required
          />
        </div>

        <button type="submit" className="primary-btn w-full">Sign Up</button>
      </form>
    </>
  );
}
