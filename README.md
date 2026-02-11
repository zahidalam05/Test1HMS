# Hostel Management System (MERN Stack)

This is a complete Hostel Management System built with the MERN stack (MongoDB, Express, React, Node.js). It features two separate frontend portals (Student & Admin) and a robust backend API.

## Project Structure

- `backend/`: Node.js Express API with MongoDB.
- `frontend-user/`: React Student Portal.
- `frontend-admin/`: React Admin Portal.

## Prerequisites

- Node.js (v20+)
- MongoDB (Running locally on default port 27017)

## Installation & Setup

You need to set up the backend and both frontends. Open 3 separate terminal windows.

### 1- Setup Backend

```bash
cd backend
npm install
npm run dev
```

*The backend server will run on http://localhost:5000*

### 2- Setup Student Frontend

```bash
cd frontend-user
npm install
npm run dev
```

*The student portal will run on http://localhost:5173*

### 3- Setup Admin Frontend

```bash
cd frontend-admin
npm install
npm run dev
```

*The admin portal will run on http://localhost:5174*

## Features

### Student Portal
- **Dashboard**: View room status and notices.
- **Profile**: View personal and hostel details.
- **Apply**: Apply for hostel allocation based on CGPA.
- **Fees**: Submit fee payments with screenshot upload.
- **Complaints**: Raise and track complaints.

### Admin Portal
- **Dashboard**: View total students, hostels, and pending requests.
- **Students**: View list of all students.
- **Hostels**: Create hostels and add rooms.
- **Applications**: Approval/Reject hostel applications and allocate rooms.
- **Payments**: Verify fee payment screenshots.
- **Complaints**: Resolve student complaints.
- **Notices**: Publish notices.

## Database (MongoDB)

Ensure your connection string in `backend/.env` is correct:
```env
MONGO_URI=mongodb://localhost:27017/hostel_db
```

## First Time Login

Since there is no "Sign Up" for Admins (security reasons), you can register a **Student** via the Student Portal login page ("Contact Admin" link is just placeholder, but you can use Postman to register).

To create the **First Admin**, you can use Postman or modify the database manually.
OR, for testing, you can register a user as a student, then manually change their role to `admin` in MongoDB Compass/Shell.

## Tech Stack
- **Frontend**: React, Vite, TailwindCSS, Axios
- **Backend**: Node.js, Express.js (ES Modules)
- **Database**: MongoDB, Mongoose
- **Auth**: JWT (JSON Web Tokens)
