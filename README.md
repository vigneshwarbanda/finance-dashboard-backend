# Finance Dashboard Backend

## 📌 Overview

This project is a backend system for a finance dashboard that manages users, financial records, and provides aggregated analytics.

The system is designed using **role-based access control (RBAC)**, where different users interact with data based on their roles. It exposes REST APIs that can be consumed by any frontend application.

The goal of this project is to demonstrate:

* Backend architecture and organization
* Role-based permissions
* Data processing and aggregation
* Validation and error handling

---

## 🚀 Features

### 🔐 Authentication & Authorization

* JWT-based authentication
* Secure login system
* Protected routes using middleware
* Role-based access control (RBAC)

---

### 👥 User Management (Admin Only)

* Create users with roles:

  * Admin
  * Analyst
  * Viewer
* Update user roles
* Activate / deactivate users
* Restrict access based on role and status

---

### 💰 Financial Records Management

* Create, read, update, delete records
* Fields:

  * amount
  * type (income / expense)
  * category
  * date
  * note
* Filtering support:

  * by type
  * by category
  * by date range
* Pagination support

---

### 📊 Dashboard APIs

* Total income
* Total expenses
* Net balance
* Category-wise breakdown
* Daily / weekly / monthly trends
* Recent activity

---

### 🛡 Validation & Error Handling

* Input validation using Zod
* Proper HTTP status codes
* Invalid ObjectId handling
* Centralized error handling

---

## 🛠 Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT (jsonwebtoken)
* bcryptjs
* Zod

---

## 📂 Project Structure

```
src/
  config/
  controllers/
  middleware/
  models/
  routes/
  validators/
  utils/
  app.js
  server.js
```

---

## ⚙️ Setup Instructions

### 1. Clone repository

```bash
git clone <repo-link>
cd finance-dashboard-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/finance_dashboard
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 4. Start server

```bash
npm run dev
```

Server will run at:

```
http://localhost:5000
```

---

## 🔑 API Endpoints

### Auth

* POST `/api/v1/auth/register`
* POST `/api/v1/auth/login`
* GET `/api/v1/auth/profile`

---

### Users (Admin Only)

* GET `/api/v1/users`
* GET `/api/v1/users/:id`
* PATCH `/api/v1/users/:id/role`
* PATCH `/api/v1/users/:id/status`

---

### Records

* POST `/api/v1/records` (Admin)
* GET `/api/v1/records` (Analyst, Admin)
* GET `/api/v1/records/:id` (Analyst, Admin)
* PATCH `/api/v1/records/:id` (Admin)
* DELETE `/api/v1/records/:id` (Admin)

---

### Dashboard

* GET `/api/v1/dashboard/summary`
* GET `/api/v1/dashboard/category-breakdown`
* GET `/api/v1/dashboard/trends`
* GET `/api/v1/dashboard/recent-activity`

---

## 👤 Role Permissions

### Viewer

* Can access dashboard data only
* Cannot access financial records
* Cannot modify any data

### Analyst

* Can view financial records
* Can access dashboard insights
* Cannot modify records

### Admin

* Full access to users
* Full access to records
* Full access to dashboard

---

## 🧠 Design Assumptions

* The system is a **centralized finance dashboard**, not a per-user personal finance app.
* Financial records are **shared system data**.
* `createdBy` is used for tracking, not access restriction.
* Only admins can modify records.
* Analysts can read records.
* Viewers are restricted to dashboard-level data.
* Inactive users cannot log in.
* Records are permanently deleted (no soft delete).

---

## ⚖️ Tradeoffs Considered

### 1. Shared Data vs User-Specific Data

* Chose shared financial records for simplicity and clarity
* Avoided per-user filtering to reduce complexity

### 2. Hard Delete vs Soft Delete

* Used hard delete for simplicity
* Soft delete could be added in production systems

### 3. Validation Scope

* Focused on core validation scenarios rather than exhaustive validation
* Ensured structure is extensible for additional validation rules

### 4. Testing Scope

* Prioritized functional correctness and RBAC validation
* Did not implement full automated test suite due to time constraints

---

## 🧪 API Testing (Postman Collection)

A Postman collection is included covering:

### Positive Tests
* Authentication
* User management
* Record operations
* Dashboard endpoints
* RBAC validation


### Negative Tests
- Invalid email format → 400
- Empty password → 400
- Unauthorized access → 401
- Forbidden access (RBAC) → 403
- Invalid ObjectId → 400


---

## 📊 Sample Data

The system is tested using:

* Multiple users across roles
* Active and inactive users
* Financial records across multiple months
* Mixed income and expense categories

---

## ⚠️ Error Handling Examples

* Invalid ObjectId → `400 Bad Request`
* Unauthorized → `401 Unauthorized`
* Forbidden → `403 Forbidden`
* Not found → `404 Not Found`
* Validation error → `400 Bad Request`

---

## 🎯 Evaluation Alignment

This project demonstrates:

* Clean backend structure
* Logical RBAC implementation
* Working APIs and data flow
* Proper validation and error handling
* Clear documentation and assumptions


---
