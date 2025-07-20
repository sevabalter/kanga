# Kanga Project

A full-stack application with separate frontend and backend services.

## Project Structure

```
kanga/
├── frontend/             # Vite/React frontend application
│   ├── public/
│   ├── src/
│   ├── .env             # Frontend environment variables
│   ├── package.json
│   └── vite.config.js
├── backend/              # Express.js backend server
│   ├── server.mjs
│   ├── minimal-server.js
│   ├── .env.template    # Template for backend environment variables
│   └── package.json
└── README.md            # This file
```

## Setup

### Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

### Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Copy the environment template:
```bash
cp .env.template .env
```

3. Install dependencies:
```bash
npm install
```

4. Start the server:
```bash
npm start
```

## Deployment

### Frontend (Vercel)

1. Push to GitHub
2. Connect your repository to Vercel
3. Deploy automatically through GitHub integration

### Backend (Railway)

1. Push to GitHub
2. Connect your repository to Railway
3. Deploy automatically through GitHub integration
