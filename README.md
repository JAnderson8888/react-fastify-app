# React + TypeScript + Fastify Application

A full-stack application with React + TypeScript frontend (using Vite) and Fastify backend.

## Project Structure

```
react-fastify-app/
├── frontend/          # React + TypeScript frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
└── backend/           # Fastify backend
    ├── src/
    │   └── server.ts
    ├── package.json
    └── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

1. Install frontend dependencies:
```bash
cd frontend
npm install
```

2. Install backend dependencies:
```bash
cd ../backend
npm install
```

### Running the Application

1. Start the backend server (in the backend directory):
```bash
npm run dev
```
The backend will run on `http://localhost:3000`

2. Start the frontend dev server (in the frontend directory):
```bash
npm run dev
```
The frontend will run on `http://localhost:5173`

## Backend API Endpoints

The backend includes the following example endpoints:

- `GET /api/health` - Health check endpoint
- `GET /api/hello` - Returns a hello message
- `POST /api/greet` - Accepts a JSON body with `name` and returns a personalized greeting

Example POST request:
```bash
curl -X POST http://localhost:3000/api/greet \
  -H "Content-Type: application/json" \
  -d '{"name": "John"}'
```

## Frontend Configuration

The frontend is configured to proxy API requests to the backend through Vite's proxy configuration. All requests to `/api/*` will be forwarded to `http://localhost:3000`.

## Development

- Frontend uses Vite for fast HMR (Hot Module Replacement)
- Backend uses `tsx` with watch mode for automatic reloading
- CORS is configured to allow the frontend to communicate with the backend

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
The built files will be in the `dist` directory.
