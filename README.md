# Lead Management System
The application provides a comprehensive platform for users to manage, track, and organize business leads with a focus on security, efficiency, and a clean user experience.


# 🚀 Live Demo
You can test the live application here.

**Component	Live Link**
```bash
Frontend url - https://lead-management-sys-git-e11197-prachi-saxenas-projects-8b0ba808.vercel.app/
Backend url -	https://lead-management-system-uttk.onrender.com
```


# Test User Credentials:
- Email: [Your Test User's Email]
- Password: [Your Test User's Password]
- Note: The application is pre-seeded with over 100 leads that are immediately visible upon login.

# ✨ Features
- Secure Authentication: User registration and login with JWT authentication stored in secure httpOnly cookies. Passwords are hashed with bcrypt.
- CRUD Operations: Full functionality to Create, Read, Update, and Delete leads.
- Server-Side Pagination: Efficiently handles large datasets by fetching leads in paginated chunks.
- Advanced Filtering: Filters leads on the server-side by various criteria, including string, number, date, and boolean fields, using operators like contains, equals, gt, lt, and between.
- Responsive UI: A user-friendly and responsive interface built with ReactJS.
- Robust APIs: RESTful APIs return appropriate HTTP status codes for all requests (e.g., 200 OK, 201 Created, 401 Unauthorized).

# 🛠️ Tech Stack
1. Frontend:
- ReactJS: A JavaScript library for building the user interface.
- React Router: For client-side routing.
- CSS: Custom styles for a clean and modern design.

2. Backend:
- Express.js: A fast, unopinionated, minimalist web framework for Node.js.
- JWT: For secure token-based authentication.
- bcrypt: For password hashing.

4. Database:
- Mongodb to store the user data.

# 💻 Local Setup & Installation
- To run this project locally, follow these steps.
- Prerequisites:
- Node.js (v14 or higher)
- Git

**1. Backend Setup:**
```bash
- cd backend
- npm install
- Create a .env file with your database URL, JWT secret, etc.
- npm run dev
```

**2. Frontend Setup:**
```bash
- cd ../frontend/vite-project
- npm install
- npm run dev
```

- The frontend will run on http://localhost:5173 and the backend will run on http://localhost:5000.
