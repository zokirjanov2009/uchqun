# IMHA Platform - Frontend

A modern, accessible web application for parents to monitor their children's activities, progress, meals, and media at special education schools.

## Overview

This is a **frontend-only** React application built with Vite and Tailwind CSS. The application uses mock data and is ready to be connected to a backend API when available.

## Features

- 🎨 Modern, clean UI with Tailwind CSS
- 📱 Fully responsive (mobile, tablet, desktop)
- ♿ Accessible design with proper ARIA labels
- 🔐 Authentication flow (mock)
- 📊 Dashboard with overview statistics
- 👤 Child profile page
- 📝 Daily activities tracking
- 🍽️ Meal and nutrition tracking
- 📷 Media gallery (photos & videos)
- ⚙️ Settings and profile management

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Mock Data** - Local data for development

## Project Structure

```
imha/
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React Context (Auth)
│   │   ├── data/           # Mock data & API functions
│   │   ├── pages/          # All page components
│   │   ├── services/       # API service (ready for backend)
│   │   ├── App.jsx         # Main app with routing
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open browser:
```
http://localhost:5173
```

### Demo Credentials

- **Email**: `parent@example.com`
- **Password**: `password`

## Pages

### 1. Login Page
- Email and password authentication
- Mock authentication (no backend)
- Error handling

### 2. Dashboard
- Overview statistics
- Recent activity
- Quick links to other pages

### 3. Child Profile
- Child's basic information
- School and class details
- Emergency contact information
- Weekly statistics

### 4. Daily Activities
- List of daily activities
- Filter by activity type
- Activity details and notes
- Teacher information

### 5. Meals & Nutrition
- Daily meal records
- Meal types (Breakfast, Lunch, Snack, Dinner)
- Special dietary notes
- Daily summary statistics

### 6. Media Gallery
- Photos and videos grid
- Filter by media type
- Lightbox/modal view
- Activity associations

### 7. Settings
- Profile information
- Password change (UI only)
- Notification preferences
- Account information

## Mock Data

All data is stored in `frontend/src/data/mockData.js`. This includes:
- User information
- Child profile
- Activities
- Meals
- Media files
- Progress data

Mock API functions simulate backend calls with delays.

## Backend Integration

When ready to connect to backend:

1. Update `frontend/src/data/mockData.js`:
   - Replace `mockApi` functions with real API calls
   - Use `fetch` or `axios` for HTTP requests

2. Update `frontend/src/context/AuthContext.jsx`:
   - Replace mock login with real API endpoint
   - Handle real JWT tokens

3. Update environment variables:
   - Add `VITE_API_URL` to `.env` file

Example API integration:
```javascript
// Replace mockApi.login with:
const login = async (email, password) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};
```

## Build for Production

```bash
cd frontend
npm run build
```

Output will be in `frontend/dist/` directory.

## Preview Production Build

```bash
npm run preview
```

## License

MIT
