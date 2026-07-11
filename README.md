<div align="center">

# 💰 Fintrak

### Modern Finance Dashboard & Analytics Platform

A full-stack MERN application for tracking income, expenses, and financial insights with secure authentication, interactive analytics, and a clean modern dashboard.

<!-- Add after deployment -->
<!-- Live Demo: https://your-demo.vercel.app -->

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)]()
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)]()
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)]()
[![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens)]()
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)]()

</div>

---

# 📌 Overview

Fintrak is a production-ready full-stack finance management application that enables users to securely manage income and expenses while visualizing financial performance through interactive dashboards and analytics.

The application was designed following modern full-stack development practices including modular architecture, RESTful APIs, JWT authentication, reusable React components, and responsive UI design.

---

# ✨ Features

## 🔐 Authentication

- Secure JWT Authentication
- User Registration
- User Login
- Protected Routes
- Password Hashing using bcrypt
- Profile Management

---

## 💵 Income Management

- Add Income
- Edit Income
- Delete Income
- Search Income
- Category Filtering
- Monthly Analytics
- Export Income Data (Excel)

---

## 💸 Expense Management

- Add Expenses
- Edit Expenses
- Delete Expenses
- Search Expenses
- Category Filtering
- Monthly Analytics
- Export Expense Data (Excel)

---

## 📊 Dashboard Analytics

- Monthly Income
- Monthly Expenses
- Net Savings
- Savings Rate
- Monthly Overview Charts
- Expense Category Distribution
- Recent Transactions
- Real-time Statistics

---

## 🎨 User Experience

- Responsive Layout
- Dark / Light Theme
- Beautiful Dashboard UI
- Empty States
- Interactive Charts
- Toast Notifications
- Smooth Micro Animations

---

# 🛠 Tech Stack

## Frontend

- React 19
- Vite
- Tailwind CSS v4
- React Router v7
- Axios
- Recharts
- React Hook Form
- Lucide React

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- Validator
- XLSX Export

---

## Tools

- Git
- GitHub
- VS Code

---

# 📂 Project Structure

```
Fintrak/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── hooks/
│   ├── context/
│   ├── utils/
│   └── assets/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
└── README.md
```

---

# 🔐 Authentication Flow

```
User

↓

Register/Login

↓

JWT Generated

↓

Stored Securely

↓

Authenticated Requests

↓

Protected Backend APIs

↓

MongoDB
```

---

# 📊 Dashboard Preview

### Dashboard

> Displays overall financial summary including income, expenses, savings, and visual analytics.

---

### Income Management

> Manage and monitor all income sources with category-wise filtering and export support.

---

### Expense Management

> Track expenses with detailed analytics and category distribution.

---

### Profile & Settings

> Manage profile details, preferences, notifications, and appearance.

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/AnujMalviya2154/Fintrak-Finance-Dashboard-Analytics.git

cd Fintrak-Finance-Dashboard-Analytics
```

---

## Backend Setup

```bash
cd backend

npm install

npm start
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## Environment Variables

Create a `.env` file inside the **backend** folder:

```env
PORT=4000
NODE_ENV=development
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_LONG_RANDOM_SECRET
TOKEN_EXPIRES=24h
CLIENT_ORIGINS=
```

Create a `.env` file inside the **frontend** folder:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

> Copy `.env.example` from each directory as a starting template.

---

# 🚀 Deployment

## Frontend — Vercel

1. Connect your GitHub repo to [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Set **Build Command** to `npm run build`.
4. Set **Output Directory** to `dist`.
5. Add environment variable: `VITE_API_BASE_URL=https://your-backend.onrender.com/api`.

## Backend — Render

1. Connect your GitHub repo to [Render](https://render.com).
2. Set **Root Directory** to `backend`.
3. Set **Start Command** to `node server.js`.
4. Add all environment variables from `backend/.env.example`.
5. Set `CLIENT_ORIGINS=https://your-app.vercel.app`.

---

# 📸 Screenshots

<img width="1917" height="870" alt="image" src="https://github.com/user-attachments/assets/e96d24d4-f3e6-4d63-8f6b-60aeb0ec56bb" />
<img width="1917" height="877" alt="image" src="https://github.com/user-attachments/assets/506c7d25-f507-45cd-9d04-10b943145bed" />
<img width="1906" height="865" alt="image" src="https://github.com/user-attachments/assets/4589522f-30c1-4fef-8e99-fc4bc94a5c5d" />
<img width="1916" height="862" alt="image" src="https://github.com/user-attachments/assets/882a5305-0c61-4cdc-bfe6-f9349694f124" />
<img width="1915" height="870" alt="image" src="https://github.com/user-attachments/assets/88aae4c1-072c-4144-8462-7d6c8f9efec2" />
<img width="1917" height="866" alt="image" src="https://github.com/user-attachments/assets/0178a172-dff6-4f4b-b510-a9cea4750e86" />




Example:

```
Dashboard

Income

Expense

Dark Mode

Profile

Settings
```

---

# 🌟 Highlights

- Production-ready MERN Architecture
- RESTful API Design
- JWT Authentication
- Responsive Dashboard
- Interactive Analytics
- Dark Mode Support
- Excel Export
- Modular Folder Structure
- Clean UI Components
- Reusable React Architecture

---

# 📈 Future Improvements (v2)

- Google OAuth Authentication
- AI-powered Expense Categorization
- Budget Planning
- Savings Goals
- Recurring Transactions
- Email Reports
- PDF Reports
- Multi-currency Support
- Financial Insights using AI
- PWA Support

---

# 🤝 Contributing

Contributions, feature suggestions, and improvements are always welcome.

Feel free to fork the repository and open a Pull Request.

---

# 👨‍💻 Author

## Anuj Malviya

B.Tech Computer Science Engineering

VIT Bhopal University

### Connect with me

- GitHub: https://github.com/AnujMalviya2154
- LinkedIn: https://linkedin.com/in/anujmalviya764

---

<div align="center">

### ⭐ If you found this project helpful, consider giving it a star!

Made with ❤️ using the MERN Stack

</div>
