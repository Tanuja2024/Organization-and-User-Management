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

| Resource               |Super Admin | Org Admin | Coordinator |
|----------|-------------|------------|-----------|--------------|
| View All Organizations  ✅              ❌           ❌ 
| Create Organization     ✅              ❌           ❌ 
| Edit Own Organization   ✅              ✅           ❌ 
| Delete Organization     ✅              ❌           ❌ 
| Approve Requests        ✅              ❌           ❌ 
| Add Org Members         ✅              ✅           ❌ 
| Edit Org Members        ✅              ✅           ❌ 
| Delete Org Members      ✅              ✅           ❌ 
| View Own Org Details    ✅              ✅           ✅ 
| Update Profile          ✅              ✅           ✅ 

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

## 🙏 Acknowledgments

- Django REST Framework documentation
- React documentation
- TailwindCSS for styling
- React Icons for UI components

---

**Built with ❤️ using Django & React**



