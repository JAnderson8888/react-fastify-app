# NASA Near-Earth Objects Explorer

A full-stack application for browsing NASA's list of objects that have come close to earth.

## Project Structure

```
react-fastify-app/
├── backend/
│   ├── src/
│   │   └── server.ts          # Fastify server with NASA API integration
│   ├── .env                   # NASA API key
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── main.tsx            # App entry point
    │   ├── App.tsx             # Root component with routing
    │   ├── pages/
    │   │   ├── Home.tsx        # Date selection page
    │   │   └── List.tsx        # NEO list and details view
    │   ├── components/
    │   │   └── inputs/
    │   │       └── datepicker.tsx
    │   ├── interfaces/
    │   │   └── interfaces.tsx  # TypeScript type definitions
    │   └── utils/
    │       └── helpers.ts      # Utility functions
    ├── index.html
    ├── vite.config.ts
    ├── eslint.config.js
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended preferably 22)
- npm
- A NASA API key (stored in `backend/.env` as `NASA_API_KEY`)

### Installation

1. Install backend dependencies:
```bash
cd backend
npm install
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:3000`.

2. Start the frontend dev server:
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173`.

## Backend API Endpoints

- `GET /api/health` - Health check
- `GET /api?START_DATE=YYYY/MM/DD&END_DATE=YYYY/MM/DD&sort=size|closeness|velocity` - Fetch near-Earth objects for a date range, optionally sorted

## Frontend Pages

- **Home** (`/`) - Select a start date to search for NEOs within a 7-day window
- **List** (`/list`) - Browse the results with sorting (size, closeness, velocity) and view details for each object including estimated diameter and close approach data

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, React Router, React Bootstrap, react-datepicker
- **Backend**: Fastify, TypeScript, NASA API
- **Dev Tools**: ESLint, Prettier, tsx (watch mode)

## Building for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
```
The built files will be in the `frontend/dist` directory.
