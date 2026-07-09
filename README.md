# FinTrak

Finance Dashboard & Analytics Platform

A modern full-stack MERN Finance Dashboard & Analytics Platform featuring secure JWT authentication, income and expense management, interactive analytics, charts, and financial insights.

## Features

- **JWT Authentication:** Secure user registration, login, and protected routes.
- **Income & Expense Tracking:** Add, edit, and delete financial records categorized intuitively.
- **Analytics Visualization:** Interactive charts powered by Recharts for data-driven insights.
- **Excel Exports:** Instantly generate and download spreadsheets of transaction histories.
- **Dark Mode:** System-wide dark theme toggle persisting across sessions.
- **Responsive UI:** Built with Tailwind CSS v4, optimized for desktops and tablets.
- **Secure Architecture:** Data ownership validation, rate-limiting, and error isolation.

## Tech Stack

**Frontend:**
- React 19
- Vite
- Tailwind CSS v4
- React Router DOM
- React Hook Form
- Recharts
- Lucide React

**Backend:**
- Node.js & Express
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- XLSX (for Excel generation)

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd finance-dashboard-platform
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory (refer to `.env.example`).
   ```bash
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   ```
   Create a `.env` file in the `frontend` directory (refer to `.env.example`).
   ```bash
   npm run dev
   ```

## Environment Variables

### Backend (`backend/.env`)
- `PORT` (e.g., 4000)
- `MONGO_URI` (MongoDB connection string)
- `JWT_SECRET` (A strong, random 64-character secret)
- `TOKEN_EXPIRES` (e.g., 24h)
- `CLIENT_ORIGINS` (Comma-separated origins for CORS)

### Frontend (`frontend/.env`)
- `VITE_API_BASE_URL` (e.g., http://localhost:4000/api)

## Folder Structure

```
├── backend/
│   ├── config/          # DB config
│   ├── controllers/     # Route logic
│   ├── middleware/      # Auth, Error Handling, Security
│   ├── models/          # Mongoose Schemas
│   ├── routes/          # Express Routers
│   └── utils/           # Shared utilities (AppError, asyncHandler)
└── frontend/
    ├── public/
    └── src/
        ├── assets/      # Static files & constants
        ├── components/  # Atomic UI components & Layouts
        ├── context/     # Auth & Toast state providers
        ├── pages/       # Route-level view components
        ├── services/    # Axios API abstractions
        └── utils/       # Formatting & helper functions
```

## Future Improvements

- Add comprehensive Unit & Integration Tests (Jest, React Testing Library).
- Refactor massive page components (Income.jsx / Expense.jsx) into smaller modular sub-components.
- Implement server-side pagination integrated with URL search parameters.
- Add OAuth2 (Google/GitHub) authentication.
- Set up a CI/CD pipeline via GitHub Actions.