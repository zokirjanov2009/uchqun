# Uchqun Platform - Project Structure

## Complete Project Structure

```
uchqun/
├── backend-simple/              # Simplified backend (NEW)
│   ├── server.js               # Main server file with all routes
│   ├── package.json            # Backend dependencies
│   ├── .env.example            # Environment variables template
│   ├── .gitignore              # Git ignore file
│   └── README.md               # Backend documentation
│
├── backend/                    # Full-featured backend (existing)
│   ├── server.js
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   └── ...
│
└── frontend/                   # React frontend
    ├── src/
    │   ├── pages/              # Parent pages
    │   │   ├── Login.jsx       # Shared login page
    │   │   ├── Dashboard.jsx
    │   │   ├── Activities.jsx
    │   │   └── ...
    │   │
    │   ├── teacher/            # Teacher pages
    │   │   ├── pages/
    │   │   │   ├── Dashboard.jsx
    │   │   │   ├── Activities.jsx
    │   │   │   └── ...
    │   │   └── components/
    │   │
    │   ├── parent/             # Parent-specific pages (if needed)
    │   │   └── ...
    │   │
    │   ├── shared/             # Shared components
    │   │   ├── components/
    │   │   ├── context/
    │   │   └── services/
    │   │       └── api.js      # API service
    │   │
    │   ├── components/         # Common components
    │   ├── context/            # React contexts
    │   ├── services/           # API services
    │   └── App.jsx             # Main app with routing
    │
    ├── package.json
    └── ...
```

## Frontend Folder Structure

```
frontend/src/
├── App.jsx                      # Main app component with routes
│
├── pages/                       # Parent-facing pages
│   ├── Login.jsx               # Shared login (used by both)
│   ├── Dashboard.jsx
│   ├── Activities.jsx
│   ├── Meals.jsx
│   ├── Media.jsx
│   └── Settings.jsx
│
├── teacher/                     # Teacher-facing pages
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Activities.jsx
│   │   ├── Meals.jsx
│   │   ├── Media.jsx
│   │   └── ParentManagement.jsx
│   └── components/
│       ├── Layout.jsx
│       └── Sidebar.jsx
│
├── parent/                      # Parent-specific (optional)
│   └── ...
│
├── shared/                      # Shared between teacher/parent
│   ├── components/
│   │   ├── Card.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── ...
│   ├── context/
│   │   └── AuthContext.jsx
│   └── services/
│       └── api.js
│
├── components/                  # Common components
│   ├── Layout.jsx
│   ├── Sidebar.jsx
│   ├── TopBar.jsx
│   └── ...
│
├── context/                     # React contexts
│   ├── AuthContext.jsx
│   ├── ToastContext.jsx
│   └── ...
│
└── services/                    # API services
    └── api.js
```

## Backend Structure (Simplified)

```
backend-simple/
├── server.js                    # All routes in one file
│   ├── Middleware
│   ├── Authentication Routes
│   ├── Protected Routes
│   └── Role-based Routes
│
├── package.json
├── .env.example
└── README.md
```

## Key Features

### 1. Single Shared Login
- `frontend/src/pages/Login.jsx` handles both teacher and parent login
- Redirects based on user role after login

### 2. Separate Teacher/Parent Folders
- `frontend/src/teacher/` - All teacher pages
- `frontend/src/pages/` - Parent pages (or can use `frontend/src/parent/`)

### 3. Single Backend
- `backend-simple/server.js` - All API endpoints in one file
- Handles both teacher and parent requests

### 4. Parent-Only Registration
- Teachers cannot register themselves
- Only `/api/auth/register` allows parent registration

### 5. Role-Based Access
- JWT tokens include user role
- Middleware checks role for protected routes

## Routing Structure

### Frontend Routes (App.jsx)

```javascript
/login                    → Login page (shared)
/                         → Parent dashboard
/activities              → Parent activities
/teacher                 → Teacher dashboard
/teacher/activities      → Teacher activities
/teacher/parents         → Parent management (if needed)
```

### Backend Routes

```
POST /api/auth/login           → Login (teacher/parent)
POST /api/auth/register        → Register (parent only)
GET  /api/dashboard            → Role-based dashboard
GET  /api/profile              → User profile
GET  /api/teacher/students     → Teacher only
GET  /api/parent/child         → Parent only
```



