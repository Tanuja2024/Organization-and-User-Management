# Organization-and-User-Managment
This project is a full-stack Organization and User Management System built with Django and React. It enables managing multiple organizations, users, and role-based permissions with workflows for signup requests and document verification. Super admins control system-wide settings while organization admins manage their own org and members securely.

## 🎯 Overview

This system provides a comprehensive solution for managing multiple organizations, their admins, and members with role-based access control. It includes user authentication, organization management, pending request workflows, and member management.

**Key Capabilities:**
- Multi-tenant organization management
- Role-based access control (Super Admin, Org Admin, Coordinators)
- JWT-based authentication
- Document verification workflow
- Pending request approval system
- User profile management

---

## ✨ Features

### Super Admin Features
- ✅ View and manage all organizations
- ✅ Approve/reject new organization requests
- ✅ Approve/reject admin join requests
- ✅ Manage super admin profile

### Organization Admin Features
- ✅ Manage their own organization details
- ✅ Add/edit/delete organization members (coordinators)
- ✅ View organizations
- ✅ Upload organization logo
- ✅ Manage organization settings

### General Features
- ✅ User signup with pending request workflow
- ✅ Email-based authentication
- ✅ Profile management
- ✅ Document upload for verification
- ✅ Search and filter organizations


## 🛠 Tech Stack

### Backend
- **Framework:** Django 4.2+
- **API:** Django REST Framework 3.14+
- **Authentication:** djangorestframework-simplejwt (JWT)
- **Database:**  SQLite (dev)
- **CORS:** django-cors-headers

### Frontend
- **Framework:** React 18+
- **HTTP Client:** Axios
- **Styling:** TailwindCSS
- **Icons:** React Icons (FontAwesome)
- **State Management:** React Hooks (useState, useEffect)

---

## 🔐 Authentication & Authorization

### **Authentication Flow**
1. User signs up → Creates PendingRequest
2. Super Admin approves → User account created
3. User logs in → Receives JWT access & refresh tokens
4. Frontend stores tokens in localStorage
5. All API requests include Authorization header



### **Permission Matrix**

Model           |  Action  |  Super Admin  |  Org Admin (own org)  |  Coordinator (OrgUser)
----------------+----------+---------------+-----------------------+-----------------------
Organization    |  add     |  ✅            |  ❌                    |  ❌                    
                |  change  |  ✅            |  ✅                    |  ❌                    
                |  delete  |  ✅            |  ❌                    |  ❌                    
                |  view    |  ✅            |  ✅                    |  ❌                    
User            |  add     |  ✅            |  ❌                    |  ❌                    
                |  change  |  ✅            |  ❌                    |  ✅ (own profile only) 
                |  delete  |  ✅            |  ❌                    |  ❌                    
                |  view    |  ✅            |  ❌                    |  ✅ (own profile only) 
OrgUser         |  add     |  ✅            |  ✅                    |  ❌                    
                |  change  |  ✅            |  ✅                    |  ❌                    
                |  delete  |  ✅            |  ✅                    |  ❌                    
                |  view    |  ✅            |  ✅                    |  ❌                    
PendingRequest  |  add     |  ✅            |  ❌                    |  ❌                    
                |  change  |  ✅            |  ❌                    |  ❌                    
                |  delete  |  ✅            |  ❌                    |  ❌                    
                |  view    |  ✅            |  ❌                    |  ❌                    

---

## 🚀 Installation & Setup

### **Prerequisites**
- Python 3.9+
- Node.js 16+
- PostgreSQL (optional, SQLite for dev)
- Git

### **1. Clone the Repository**

git clone https://github.com/yourusername/org-user-management.git
cd MANAGE_ORGANIZATIONS


### **2. Backend Setup**

Navigate to backend directory
cd backend
cd B2B_org

Create virtual environment
python -m venv venv

Activate virtual environment
On Windows:
venv\Scripts\activate

On Mac/Linux:
source venv/bin/activate

Install dependencies
pip install -r requirements.txt

Create requirements.txt if not exists
pip freeze > requirements.txt

**Required packages:**

Django==4.2.7
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.0
django-cors-headers==4.3.0


**Configure Database** (Edit `settings.py`):

For development (SQLite)
DATABASES = {
'default': {
'ENGINE': 'django.db.backends.sqlite3',
'NAME': BASE_DIR / 'db.sqlite3',
}
}



**Run Migrations:**
python manage.py makemigrations
python manage.py migrate

**Create Superuser:**
python manage.py createsuperuser
Backend runs at http://localhost:8000


### **3. Frontend Setup**


**Run Development Server:**
python manage.py runserver

Backend runs at http://localhost:8000
text

### **3. Frontend Setup**

Navigate to frontend directory
cd org-management-frontend

Install dependencies
npm install

Required packages (package.json)
Start development server
npm start

Frontend runs at http://localhost:3000

### **5. Access the Application**

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000/api`
- Django Admin: `http://localhost:8000/admin`

---

## 👥 User Roles & Permissions

### **1. Super Admin**
- **Access:** Entire system
- **Capabilities:**
  - Create/edit/delete any organization
  - Approve/reject signup requests
  - View dashboard of all pending requests
  - Manage all users
  - No organization assignment (org = null)

### **2. Organization Admin**
- **Access:** Own organization only
- **Capabilities:**
  - Edit own organization details
  - Add/edit/delete organization members
  - View organization dashboard
  - Manage organization settings
  - Cannot access other organizations

### **3. other Users** 
- **Access:** Limited to viewing
- **Capabilities:**
  - View organization details
  - View member list
  - No management permissions

---
---

## 👤 User Guide - Getting Started

### **For New Users**

This guide will walk you through using the Organization and User Management System from start to finish.

---

## 📖 Step-by-Step Walkthrough

### **Scenario 1: Joining an Existing Organization**

#### **Step 1: Sign Up**
1. Visit the application homepage
2. Click the **"Sign Up"** button in the header
3. Fill in the registration form:
   - **Name:** Your full name
   - **Email:** Your email address (will be your username)
   - **Password:** Create a secure password
   - **Organization:** Select an existing organization from the dropdown
   - **Upload Document:** (Optional) Verification document
4. Click **"Submit Request"**
5. ✅ **Success!** You'll see: "Request submitted successfully! Please wait for approval."

#### **Step 2: Wait for Approval**
- Your request is sent to the **Super Admin** for approval
- You'll receive a notification once approved (check email)
- Status: **Pending** → **Approved**

#### **Step 3: Login After Approval**
1. Once approved, click **"Login"** button
2. Enter your **email** and **password**
3. Click **"Login"**
4. ✅ You're in! You'll be redirected to your organization dashboard

---

### **Scenario 2: Creating a New Organization**

#### **Step 1: Request New Organization**
1. Click **"Sign Up"** button
2. Fill in the registration form:
   - **Name:** Your full name
   - **Email:** Your email address
   - **Password:** Create a secure password
   - **Organization:** Select **"Request New Organization"**
   - **New Organization Name:** Enter your organization name
   - **Upload Document:** (Optional) Business registration document
3. Click **"Submit Request"**
4. ✅ Your request is submitted for review

#### **Step 2: Admin Approval**
- **Super Admin** reviews your request
- They can:
  - ✅ **Approve:** Creates your organization and your admin account
  - ❌ **Reject:** You'll receive notification to resubmit

#### **Step 3: Start Managing Your Organization**
After approval:
1. **Login** with your credentials
2. Navigate to **"Manage Organizations"** tab
3. You can now:
   - ✏️ Edit organization details
   - 👥 Add organization members (coordinators)
   - 🖼️ Upload organization logo
   - ⚙️ Update settings

---

## 🎭 User Roles Explained

### **1. Super Admin (System Administrator)**

**What you can do:**
- ✅ View ALL organizations in the system
- ✅ Approve/Reject signup requests
- ✅ Create new organizations directly
- ✅ Block/Unblock organizations
- ✅ Delete organizations
- ✅ View system-wide dashboard
- ✅ Manage your profile

**How to approve a request:**
1. Go to **"Dashboard"** tab
2. Review pending request details
3. Click **"Approve"** or **"Reject"** button
4. ✅ User is notified immediately

---

### **2. Organization Admin**

**What you can do:**
- ✅ View YOUR organization details
- ✅ Edit YOUR organization information
- ✅ Add/Edit/Delete organization members
- ✅ Upload organization logo
- ✅ View organization members list
- ✅ Update your profile
- ❌ Cannot access other organizations
- ❌ Cannot approve signup requests

**Your Dashboard:**

**How to add a member:**
1. Go to **"Manage Organizations"** tab
2. Click on your organization name
3. Scroll to **"Organization Members"** section
4. Click **"+ Add Member"** button
5. Fill in member details:
   - Name
   - Email
   - Role (Admin/Coordinator)
   - Document (optional)
6. Click **"Save User"**
7. ✅ Member added successfully!

---

### **3. Coordinator (Organization Member)**

**What you can do:**
- ✅ View organization details
- ✅ View other members
- ✅ Update your own profile
- ❌ Cannot edit organization
- ❌ Cannot add/remove members

---

## 🔑 Common Tasks

### **Task 1: Update Your Profile**

1. Click on your **profile icon** (👤) in the top-right corner
2. Select **"View Profile"** from dropdown
3. Review your details
4. Click **"Edit Profile"** button
5. Update your information
6. Click **"Save Changes"**
7. ✅ Profile updated!

---

### **Task 2: Search for Organizations** (Super Admin only)

1. Go to **"Manage Organizations"** tab
2. Use the **search bar** at the top:
3. Type organization name
4. Results filter automatically
5. Click on any organization to view details

---

### **Task 3: Edit Organization Details** (Org Admin)

1. Go to **"Manage Organizations"** tab
2. Click on your organization
3. Click **"Edit"** button (✏️ icon)
4. Update fields:
- Organization Name
- Email
- Phone
- Address
- Website
- Logo (upload image)
- Max Coordinators
- Status
5. Click **"Save Organization"**
6. ✅ Changes saved!

---

### **Task 4: Delete a Member** (Org Admin)

1. View your organization details
2. Scroll to **"Organization Members"**
3. Find the member you want to remove
4. Click **Delete** button (🗑️ icon)
5. Confirm deletion in popup dialog
6. ✅ Member removed!

---

## 🚨 Troubleshooting

### **Problem: "Cannot login after signup"**
**Solution:** 
- Your account needs to be approved by Super Admin first
- Wait for approval notification
- Check your email for approval status

### **Problem: "Cannot see all organizations"**
**Solution:** 
- You must be a **Super Admin** to view all organizations
- Organization Admins can only see their own organization

### **Problem: "Cannot add members to organization"**
**Solution:** 
- You must be an **Organization Admin** or **Super Admin**
- Coordinators cannot add members

### **Problem: "Profile icon not showing"**
**Solution:** 
- Make sure you're logged in
- Refresh the page
- Clear browser cache

### **Problem: "Forgot password"**
**Solution:** 
- Contact Super Admin to reset your password
- Or use Django admin panel (backend) to reset

---

## 💡 Tips & Best Practices

### **For Super Admins:**
✅ Review pending requests regularly  
✅ Verify documents before approving  
✅ Keep organization statuses updated  
✅ Monitor system activity via dashboard  

### **For Organization Admins:**
✅ Keep organization details up-to-date  
✅ Regularly review member list  
✅ Upload organization logo for branding  
✅ Set appropriate max_coordinators limit  

### **For All Users:**
✅ Use strong passwords  
✅ Keep your profile information current  
✅ Upload verification documents when requested  
✅ Logout when using shared computers  

---

**Dashboard Tab:**
- View pending signup requests (Super Admin only)
- Approve/Reject requests
- See request statistics

**Manage Organizations Tab:**
- View all organizations (Super Admin)
- View your organization (Org Admin)
- Search organizations
- Add new organization (Super Admin)
- Edit/Delete organizations

**Profile Dropdown:**
- View Profile
- Update Profile
- Logout

---

## 🎯 Quick Start Checklist

### **For First-Time Users:**
- [ ] Sign up with valid email
- [ ] Submit request with required details
- [ ] Wait for admin approval
- [ ] Login after approval
- [ ] Update your profile
- [ ] Explore your organization

### **For Organization Admins:**
- [ ] Login to your account
- [ ] Review organization details
- [ ] Upload organization logo
- [ ] Add organization members
- [ ] Update contact information
- [ ] Set max coordinators limit

### **For Super Admins:**
- [ ] Login to admin account
- [ ] Review pending requests
- [ ] Approve/Reject as appropriate
- [ ] Create organizations as needed
- [ ] Monitor system usage
- [ ] Update organization statuses

---



**Welcome to the Organization Management System! 🎉**





## 🙏 Acknowledgments

- Django REST Framework documentation
- React documentation
- TailwindCSS for styling
- React Icons for UI components

---

**Built with ❤️ using Django & React**



