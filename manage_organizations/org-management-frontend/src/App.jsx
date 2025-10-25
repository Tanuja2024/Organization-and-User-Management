import React, { useState,useEffect } from "react";
import Header from "./components/Header";
import SlideOver from "./components/SlideOver";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";
import AddOrganization from "./components/AddOrganization";
import AddOrgUser from "./components/AddOrgUser";
import EditOrgUserForm from "./components/EditOrgUserForm";
import EditOrgForm from "./components/EditOrgForm";
import { FaTrash, FaEdit, FaEye } from "react-icons/fa";
import SearchFilter from "./components/SearchFilter";
import ProfileEditForm from "./components/ProfileEditForm";
import ProfileView from "./components/ProfileView";

import {
    login,
    signup,
  getOrganizations,
 addOrganization ,
 deleteOrganization, 
updateOrganization ,
 getOrgUsers,
addOrgUser ,
 deleteOrgUser,
 updateOrgUser,
 updateUser,

// Pending requests (actions)
 getPendingRequests,
 createPendingRequest ,
 updatePendingRequest,
} from "./api";



function App() {

  // State variables for UI and data management
  const [activeTab, setActiveTab] = useState("organizations");


 // Modal visibility control states
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showAddOrg, setShowAddOrg] = useState(false);
  const [showEditOrg, setShowEditOrg] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showPendingRequest, setShowPendingRequest] = useState(false);
  const [pendingRequestOrgName, setPendingRequestOrgName] = useState("");
  const [pendingRequests, setPendingRequests] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

 // Organizations and related state
  const [orgs, setOrgs] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [orgDetails, setOrgDetails] = useState(null);
  const [orgUsers, setOrgUsers] = useState([]);
  const [orgTab, setOrgTab] = useState("details");
  const [user, setUser] = useState(null);
  const [showEditUser, setShowEditUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  
// Authorization checks based on user role
  const isAuthorizedToAddOrg = !!user && ["admin", "org_admin", "super_admin"].includes(user.role);
  const isAuthorizedToAddUser = !!user && ["admin", "org_admin", "super_admin"].includes(user.role);
// Load organizations on first render
  useEffect(() => {
    getOrganizations().then(res => {
      setOrgs(Array.isArray(res.data) ? res.data : res.data.results || []);
    });
  }, []);
  // Load pending requests if on dashboard tab and user is super admin
  useEffect(() => {
    if (activeTab === "dashboard" && user?.role === "super_admin") {
      getPendingRequests()
        .then(res => {
          setPendingRequests(Array.isArray(res.data) ? res.data : res.data.results || []);
        })
        .catch(err => {
          console.error("Failed to fetch pending requests:", err);
        });
    }
  }, [activeTab, user]);

    // Update profile handler
  const handleProfileUpdate = async (userId, formData) => {
    try {
      const res = await updateUser(userId, formData);
      setUser(res.data);
      setShowEditProfile(false);
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile: " + (error.response?.data?.detail || error.message));
    }
  };
  
  // When an organization is selected, load its details and users
  const handleOrgClick = async org => {
    setSelectedOrg(org);
    setOrgTab("details");
    setOrgDetails(org); // or fetch details from API if needed
    const usersRes = await getOrgUsers(org.id);
    setOrgUsers(Array.isArray(usersRes.data) ? usersRes.data : usersRes.data.results || []);
  };

   // Add organization handler
  const handleAddOrg = async orgData => {
    if (!isAuthorizedToAddOrg) return;
    
    try {
      const res = await addOrganization(orgData);
      setOrgs(prev => [...prev, res.data]);
      setShowAddOrg(false);
    } catch (error) {
      alert("Failed to add organization: " + (error.response?.data?.detail || error.message));
    }
  };
  
 // Add organization user (member) handler
  const handleAddOrgUser = async (userData, organizationId) => {
    if (!isAuthorizedToAddUser) return;
    const res = await addOrgUser(userData, organizationId);
    setOrgUsers(prev => [...prev, res.data]);
    setShowAddUser(false);
  };
  // Open edit user modal
  const handleEditUserClick = (user) => {
    setSelectedUser(user);
    setShowEditUser(true);
  };

  // Update org user handler
  const handleUpdateOrgUser = async (id, formData) => {
    try {
      const res = await updateOrgUser(id, formData);
      setOrgUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === res.data.id ? res.data : u))
      );
      setShowEditUser(false);
      setSelectedUser(null);
    } catch (error) {
      alert("Failed to update user: " + (error.response?.data?.detail || error.message));
    }
  };

    // Update organization handler
  const handleUpdateOrg = async (id, updatedOrg) => {
    if (!isAuthorizedToAddOrg) {
      alert("You don't have permission to edit organizations");
      return;
    }
    
    try {
      let res = await updateOrganization(id, updatedOrg);
      setOrgDetails(res.data);
      setOrgs(prevOrgs => prevOrgs.map(o => o.id === res.data.id ? res.data : o));
      setShowEditOrg(false);
    } catch (error) {
      alert("Failed to update organization: " + (error.response?.data?.detail || error.message));
    }
  };
    // Filter organizations by search query
  const filteredOrgs = orgs.filter(org => 
    org.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  
   // Login handler
  const handleLogin = async (formData) => {
    try {
      const res = await login(formData);
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      setUser({ ...res.data, role: res.data.role });
    
      setShowLogin(false);
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.detail || "Unknown error"));
    }
  };

// Signup handler
  const handleSignup = async (formData) => {
    try {
      await signup(formData);
      alert("Signup successful! Please log in.");
      setShowSignup(false);
    } catch (err) {
      alert("Signup failed: " + (err.response?.data?.detail || "Unknown error"));
    }
  };

  // Submit pending org request
  const handlePendingRequestSubmit = async (data) => {
    try {
      await createPendingRequest({ org_name: data.org_name, type: "organization" });
      alert("Pending request submitted successfully");
      setShowPendingRequest(false);
      setPendingRequestOrgName("");
    } catch (error) {
      alert("Failed to submit pending request");
    }
  };
 // Logout handler
  const handleLogout = () => setUser(null);

 // Render selected organization details and users
  const renderSelectedOrg = () => (
    <div className="p-8 bg-white rounded-lg shadow">
      {/* Org Banner */}
      <div className="flex items-center gap-8 mb-20">
        <img src={orgDetails?.logo || "/placeholder.png"}
          alt="Org Logo"
          className="w-24 h-24 rounded bg-gray-200 object-cover border"
        />
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold">{orgDetails?.name}</h2>
            {orgDetails?.status && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                ${orgDetails.status === "active" ? "bg-green-100 text-green-700" :
                  orgDetails.status === "blocked" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-500"}`}>
                <span style={{
                  display: "inline-block",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  marginRight: "8px",
                  background: orgDetails.status === "active"
                    ? "#22c55e"
                    : orgDetails.status === "blocked"
                      ? "#ef4444"
                      : "#a3a3a3"
                }} />
                {orgDetails.status.charAt(0).toUpperCase() + orgDetails.status.slice(1)}
              </span>
            )}
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-sm text-gray-500 mt-1">
            <span>{orgDetails?.email}</span>
            <span>{orgDetails?.phone}</span>
            <span>{orgDetails?.website}</span>
          </div>
        </div>
        {isAuthorizedToAddOrg && (
          <button
            className="hover:text-blue-600 hover:bg-blue-50 p-2 rounded transition-all duration-150"
            title="Edit organization"
            onClick={() => setShowEditOrg(true)}
          >
            <FaEdit className="mr-2" /> Edit
          </button>
        )}
      </div>
  
      {/* Tab Navigation */}
      <div className="flex gap-6 mb-8 border-b border-gray-200">
        <button
          onClick={() => setOrgTab("details")}
          className={`py-2 px-1 border-b-2 ${orgTab === "details" ? "border-purple-600 text-purple-600" : "border-transparent text-gray-500"}`}>
          Basic details
        </button>
        <button
          onClick={() => setOrgTab("users")}
          className={`py-2 px-1 border-b-2 ${orgTab === "users" ? "border-purple-600 text-purple-600" : "border-transparent text-gray-500"}`}>
          Users
        </button>
      </div>
  
      {/* Basic Details Section */}
      {orgTab === "details" && orgDetails && (
        <div className="space-y-8">
          {/* Organization details block */}
          <section>
            <h3 className="font-semibold text-gray-800 mb-3">Organization details</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Organization Name</label>
                <div className="w-full py-2 px-3 rounded border border-gray-100 bg-gray-50">{orgDetails.name || "-"}</div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Organization Slug</label>
                <div className="w-full py-2 px-3 rounded border border-gray-100 bg-gray-50">{orgDetails.org_slug || "-"}</div>
              </div>
            </div>
          </section>
  
          {/* Contact details block */}
          <section>
            <h3 className="font-semibold text-gray-800 mb-3">Contact details</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Email</label>
                <div className="w-full py-2 px-3 rounded border border-gray-100 bg-gray-50">{orgDetails.email || "-"}</div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Phone</label>
                <div className="w-full py-2 px-3 rounded border border-gray-100 bg-gray-50">{orgDetails.phone || "-"}</div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Website</label>
                <div className="w-full py-2 px-3 rounded border border-gray-100 bg-gray-50">{orgDetails.website || "-"}</div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Address</label>
                <div className="w-full py-2 px-3 rounded border border-gray-100 bg-gray-50">{orgDetails.address || "-"}</div>
              </div>
            </div>
          </section>
  
          {/* More settings */}
          <section>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Max Coordinators</label>
                <div className="w-full py-2 px-3 rounded border border-gray-100 bg-gray-50">{orgDetails.max_coordinators || "-"}</div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Pending Requests</label>
                <div className="w-full py-2 px-3 rounded border border-gray-100 bg-gray-50">{orgDetails.pending_requests || "-"}</div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Timezone</label>
                <div className="w-full py-2 px-3 rounded border border-gray-100 bg-gray-50">{orgDetails.timezone || "-"}</div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Language</label>
                <div className="w-full py-2 px-3 rounded border border-gray-100 bg-gray-50">{orgDetails.language || "-"}</div>
              </div>
            </div>
          </section>
  
          <section>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Created At</label>
                <div className="w-full py-2 px-3 rounded border border-gray-100 bg-gray-50">{orgDetails.created_at ? new Date(orgDetails.created_at).toLocaleString() : "-"}</div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Last Updated</label>
                <div className="w-full py-2 px-3 rounded border border-gray-100 bg-gray-50">{orgDetails.updated_at ? new Date(orgDetails.updated_at).toLocaleString() : "-"}</div>
              </div>
            </div>
          </section>
        </div>
      )}
  {/* Show organization users */}
  {orgTab === "users" && (
  <div>
    <div className="flex justify-between mb-4">
      <div className="text-xl font-semibold">Users</div>

      {/*  Add User button visible only to authorized admins */}
      {user && (
        <>
          {user.role === "super_admin" && (
            <button
              className="cursor-pointer bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
              onClick={() => setShowAddUser(true)}
            >
              + Add Org User
            </button>
          )}

          {user.role === "org_admin" && user.organization_id === selectedOrg?.id && (
            <button
              className="cursor-pointer bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
              onClick={() => setShowAddUser(true)}
            >
              + Add Org User
            </button>
          )}
        </>
      )}
    </div>

    {orgUsers.length === 0 ? (
      <div className="text-gray-500">No users yet.</div>
    ) : (
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {orgUsers.map((u) => {
          const isAuthorized =
            user?.role === "super_admin" ||
            (user?.role === "org_admin" && user?.organization_id === selectedOrg?.id);

          return (
            <div
  key={u.id}
  className="bg-gray-50 border rounded-lg shadow-sm px-4 py-3 flex flex-col relative hover:shadow-lg hover:bg-white hover:border-purple-200 transition-all duration-200"
>              {/* Users grid with Edit/Delete for authorized */}

              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="font-medium text-lg text-gray-800 truncate">
                  {u.name}
                </div>

                {/* ✅ Show Edit/Delete icons only to authorized users */}
                {isAuthorized && (
                  <div className="flex gap-2">
                    <button
                      className="cursor-pointer p-2 hover:bg-purple-100 rounded"
                      title="Edit"
                      onClick={() => handleEditUserClick(u)}
                    >
                      <FaEdit className="text-purple-600" />
                    </button>

                    <button
                      className="cursor-pointer p-2 hover:bg-purple-100 rounded"
                      title="Delete"
                      onClick={() => {
                        if (window.confirm("Are you sure to delete this user?")) {
                          deleteOrgUser(u.id);
                          setOrgUsers((prev) => prev.filter((x) => x.id !== u.id));
                        }
                      }}
                    >
                      <FaTrash className="text-purple-600" />
                    </button>
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-500 mb-1">
                {u.role && u.role.charAt(0).toUpperCase() + u.role.slice(1)}
              </div>
              <div className="text-xs text-gray-600 truncate">{u.email}</div>

              {u.document_name && (
                <div className="text-xs text-gray-500 mt-2">
                  <strong>Document:</strong> {u.document_name}
                </div>
              )}
            </div>
          );
        })}
      </div>
    )}
  </div>
)}


  
      {/* Back Button */}
      <button 
  className="mt-8 transition-all duration-150 cursor-pointer" 
  style={{
    color: '#a855f7',
    textDecoration: 'underline'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.color = '#7c3aed';
    e.currentTarget.style.textDecoration = 'none';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.color = '#a855f7';
    e.currentTarget.style.textDecoration = 'underline';
  }}
  onClick={() => { 
    setSelectedOrg(null); 
    setOrgDetails(null); 
    setOrgUsers([]); 
  }}
>
  ← Back to Organizations
</button>


    </div>
  );
  
  

  
// Render component JSX
  return (
    <div className="h-full flex flex-col">
      <Header
        user={user}
        onSignupClick={() => setShowSignup(true)}
        onLoginClick={() => setShowLogin(true)}
 
        onProfileClick={() => setShowProfile(true)}
        onEditProfileClick={() => setShowEditProfile(true)}

      />
      {user && (
        <div className="flex justify-end px-8 mt-3">
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Logout
          </button>
        </div>
      )}
{/* Navigation Tabs */}
<div className="bg-white pt-6 px-8 flex gap-8 border-b border-gray-200">
  <button
    className={`text-sm font-medium py-3 border-b-2 transition-all ${
      activeTab === "dashboard" 
        ? "text-purple-600 border-purple-600" 
        : "text-gray-400 border-transparent hover:text-purple-500 hover:border-purple-300"
    }`}
    onClick={() => setActiveTab("dashboard")}
  >
    Dashboard
  </button>
  <button
    className={`text-sm font-medium py-3 border-b-2 transition-all ${
      activeTab === "organizations" 
        ? "text-purple-600 border-purple-600" 
        : "text-gray-400 border-transparent hover:text-purple-500 hover:border-purple-300"
    }`}
    onClick={() => setActiveTab("organizations")}
  >
    Manage Organizations
  </button>
      </div>
{/* Add Organization Button */}
      {activeTab === "organizations" && !selectedOrg && isAuthorizedToAddOrg && (
       
        
        <div className="flex justify-end mt-4 mr-12">
          <button
  className="cursor-pointer bg-purple-600 hover:bg-purple-700 hover:shadow-lg transform hover:scale-105 text-white px-4 py-2 rounded font-medium text-sm transition-all duration-200"
  onClick={() => setShowAddOrg(true)}
>
  + Add Organization
</button>
        </div>
        
      )}
{/* Main Content Section */}
 {/* Render selected org */}
      <main className="p-6 flex-1 space-y-4">
        {activeTab === "organizations" && selectedOrg && renderSelectedOrg()}
        {activeTab === "organizations" && !selectedOrg && (

<>
 {/* Organizations list with search filter */}
<SearchFilter 
  searchQuery={searchQuery}
  setSearchQuery={setSearchQuery}
  resultCount={filteredOrgs.length}
/>

  <div className="bg-white rounded shadow p-8">
    {/* Organizations table */}
  <h2 className="text-2xl font-semibold mb-8">B2B organizations</h2>
  <div className="w-full overflow-x-auto">
    <table
      className="w-full border-separate border-spacing-y-3"
      style={{
        borderCollapse: "separate",
        borderSpacing: "0 16px", // vertical 16px row spacing, no horizontal gap
      }}
    >
      <thead>
        <tr>
          <th className="text-left font-bold px-8 py-4 border-b border-gray-200 bg-white">Sr. No</th>
          <th className="text-left font-bold px-8 py-4 border-b border-gray-200 bg-white">Organizations</th>
          <th className="text-left font-bold px-8 py-4 border-b border-gray-200 bg-white">Pending requests</th>
          <th className="text-left font-bold px-8 py-4 border-b border-gray-200 bg-white">Status</th>
          <th className="text-left font-bold px-8 py-4 border-b border-gray-200 bg-white">Action</th>
        </tr>
      </thead>
      <tbody>
        {filteredOrgs.length === 0 ? (
          <tr>
            <td colSpan="5" className="py-8 text-center text-gray-400 bg-white rounded">
              No organizations added yet.
            </td>
          </tr>
        ) : (
          filteredOrgs.map((org, idx) => (
            <tr
  key={org.id}
  className="bg-white shadow-sm rounded-xl hover:shadow-md hover:bg-gray-50 transition-all duration-200 cursor-pointer"
  style={{
    boxShadow: "0 1px 6px 0 rgba(60,72,88,0.04)",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
  }}
>

              <td className="px-8 py-5">{idx + 1}</td>
              <td className="px-8 py-5">
                <div className="flex items-center gap-6">
                  {org.logo ? (
                    <img
                      src={org.logo}
                      alt=""
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "100%",
                        objectFit: "cover",
                        background: "#f3f4f6",
                        border: "1px solid #e5e7eb",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "100%",
                        background: "#f3f4f6",
                        border: "1px solid #e5e7eb",
                      }}
                    />
                  )}
                  <span className="font-bold text-lg">{org.name}</span>
                </div>
              </td>
              <td className="px-8 py-5 text-base">
                {org.pending_requests} pending requests
              </td>
              <td className="px-8 py-5 text-base">
  {org.status === "active" && (
    <span className="flex items-center gap-2 bg-green-100 text-green-700 text-base px-4 py-1 rounded-full font-medium">
      <span
        style={{
          display: "inline-block",
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          background: "#22c55e", // Tailwind green-500
        }}
      ></span>
      Active
    </span>
  )}
  {org.status === "blocked" && (
    <span className="flex items-center gap-2 bg-red-100 text-red-700 text-base px-4 py-1 rounded-full font-medium">
      <span
        style={{
          display: "inline-block",
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          background: "#ef4444", // Tailwind red-500
        }}
      ></span>
      Blocked
    </span>
  )}
  {org.status === "inactive" && (
    <span className="flex items-center gap-2 bg-gray-100 text-gray-500 text-base px-4 py-1 rounded-full font-medium">
      <span
        style={{
          display: "inline-block",
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          background: "#a3a3a3", // Tailwind gray-400
        }}
      ></span>
      Inactive
    </span>
  )}
</td>


<td className="px-8 py-5">
  <div className="flex gap-6">
  <button
  onClick={() => handleOrgClick(org)}
  className="cursor-pointer p-2 rounded transition-all duration-150"
  title="View"
  style={{ color: '#6b7280' }}
  onMouseEnter={(e) => {
    e.currentTarget.style.color = '#9333ea';
    e.currentTarget.style.backgroundColor = '#f3e8ff';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.color = '#6b7280';
    e.currentTarget.style.backgroundColor = 'transparent';
  }}
>
  <FaEye />
</button>
    {isAuthorizedToAddOrg && (
      <>
    <button
  onClick={() => {
    setShowEditOrg(true);
    setSelectedOrg(org);
  }}
  className="cursor-pointer p-2 rounded transition-all duration-150"
  title="Edit"
  style={{ color: '#6b7280' }}
  onMouseEnter={(e) => {
    e.currentTarget.style.color = '#2563eb';
    e.currentTarget.style.backgroundColor = '#dbeafe';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.color = '#6b7280';
    e.currentTarget.style.backgroundColor = 'transparent';
  }}
>
  <FaEdit />
</button>
        <button
  className="cursor-pointer hover:text-red-600 hover:bg-red-50 p-2 rounded transition-all duration-150"
  title="Delete"
  onClick={async () => {
    if (window.confirm("Are you sure you want to delete this organization?")) {
      try {
        await deleteOrganization(org.id);
        setOrgs(prev => prev.filter(o => o.id !== org.id));
      } catch (error) {
        alert("Failed to delete organization: " + (error.response?.data?.detail || error.message));
      }
    }
  }}
>
  <FaTrash />
</button>

      </>
    )}
  </div>
</td>

            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</div>
</>
)}
 {/* Dashboard tab for pending requests */}
{activeTab === "dashboard" && (
  <div className="bg-white rounded shadow p-8">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Pending Requests Dashboard</h2>
    
    {!user ? (
      <p className="text-gray-500">Please log in to view the dashboard.</p>
    ) : user.role === "super_admin" ? (
      <>
      {pendingRequests.map((request) => (
  <div 
    key={request.id} 
    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
  >
    <div className="flex justify-between items-start gap-4">
      <div className="flex-1">
        <h3 className="font-semibold text-lg mb-2">
          {request.org_name || 'Organization Request'}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Requested by: {request.requested_by_email || request.requested_by}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Type: {request.type}
        </p>
        {request.details && (
          <p className="text-sm text-gray-600 mt-2">
            Details: {request.details}
          </p>
        )}
        <p className="text-sm text-gray-600 mt-2">
          Related Organization: {request.related_org?.name || 'N/A'}
        </p>
      </div>
      <div className="flex flex-col gap-2">
  <button
    onClick={async () => {
      try {
        await updatePendingRequest(request.id, "approved");
        setPendingRequests(prev => prev.filter(r => r.id !== request.id));
        alert("Request approved successfully");
      } catch (error) {
        alert("Failed to approve request: " + (error.response?.data?.detail || error.message));
      }
    }}
    style={{
      backgroundColor: '#9333ea',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      whiteSpace: 'nowrap'
    }}
    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#7e22ce'}
    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#9333ea'}
  >
    Approve
  </button>
  <button
    onClick={async () => {
      try {
        await updatePendingRequest(request.id, "rejected");
        setPendingRequests(prev => prev.filter(r => r.id !== request.id));
        alert("Request rejected successfully");
      } catch (error) {
        alert("Failed to reject request: " + (error.response?.data?.detail || error.message));
      }
    }}
    style={{
      backgroundColor: '#6b7280',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      whiteSpace: 'nowrap'
    }}
    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6b7280'}
  >
    Reject
  </button>
</div>


    </div>
  </div>
))}

      </>
    ) : (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-700 text-lg mb-2">
          This feature is only available for Super Admins
        </p>
        <p className="text-gray-600">
          For more information, please contact the Super Admin at{" "}
          <a href="mailto:tanuja@gmail.com" className="text-purple-600 underline">
            tanuja@gmail.com
          </a>
        </p>
      </div>
    )}
  </div>
)}


      </main>
       {/* SlideOver Modal Components */}

      <SlideOver open={showSignup} onClose={() => setShowSignup(false)}>
        <SignupForm
          onSignup={handleSignup}
          organizations={orgs}
          onSubmitPendingRequest={handlePendingRequestSubmit}
          onOpenPendingRequest={() => setShowPendingRequest(true)}
        />
      </SlideOver>

      <SlideOver open={showLogin} onClose={() => setShowLogin(false)}>
        <LoginForm onLogin={handleLogin} />
      </SlideOver>

      <SlideOver open={showAddOrg} onClose={() => setShowAddOrg(false)}>
        <AddOrganization onAdd={handleAddOrg} />
      </SlideOver>

      <SlideOver open={showEditOrg} onClose={() => setShowEditOrg(false)}>
        <EditOrgForm org={selectedOrg}
         onUpdate={ handleUpdateOrg} />
      </SlideOver>
      <SlideOver open={showEditUser} onClose={() => setShowEditUser(false)}>
  <EditOrgUserForm user={selectedUser} onUpdate={handleUpdateOrgUser} />
</SlideOver>

      <SlideOver open={showAddUser} onClose={() => setShowAddUser(false)}>
  <AddOrgUser 
    organizations={orgs} 
    onAddUser={handleAddOrgUser} 
    organizationId={selectedOrg ? selectedOrg.id : null}
  />
</SlideOver>


      <SlideOver open={showPendingRequest} onClose={() => setShowPendingRequest(false)}>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Submit Organization Request</h2>
          <form onSubmit={e => {
            e.preventDefault();
            if (!pendingRequestOrgName.trim()) {
              alert("Organization name is required");
              return;
            }
            handlePendingRequestSubmit({ org_name: pendingRequestOrgName });
          }}>
            <input
              type="text"
              className="border border-gray-300 rounded w-full mb-4 p-2"
              placeholder="Organization Name"
              value={pendingRequestOrgName}
              onChange={e => setPendingRequestOrgName(e.target.value)}
              autoFocus
            />
            <button type="submit" className="bg-purple-600 text-white rounded px-4 py-2">
              Submit Request
            </button>
            <button
              type="button"
              className="ml-4 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              onClick={() => setShowPendingRequest(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      </SlideOver>
      {/* Only show profile SlideOver if user exists */}
{user && (
  
  <SlideOver open={showProfile} onClose={() => setShowProfile(false)}>
     {/* Profile view and edit modals */}
    <ProfileView
      user={user}
      onEditClick={() => {
        setShowProfile(false);
        setShowEditProfile(true);
      }}
    />
  </SlideOver>
)}

{user && (
  <SlideOver open={showEditProfile} onClose={() => setShowEditProfile(false)}>
    <ProfileEditForm
      user={user}
      onUpdate={handleProfileUpdate}
      onCancel={() => setShowEditProfile(false)}
    />
  </SlideOver>
)}

    </div>
  );
}

export default App;

