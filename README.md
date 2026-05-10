# Team Task Manager

A full-stack task management platform for teams to create projects, assign work, track delivery, and manage users with role-based access.

## Stack

- React + Vite + Tailwind CSS
- Node.js + Express.js
- MongoDB + Mongoose
- JWT authentication

## Features

- User registration and login
- JWT-protected API routes
- Admin and member role separation
- Project creation and team assignment
- Task creation, assignment, and status tracking
- Dashboard analytics for projects and tasks
- Profile management
- Responsive interface

## Roles

### Admin

- Create, edit, and delete projects
- View all users
- Create, edit, and delete tasks
- Assign tasks to project members

### Member

- View assigned tasks
- Update the status of assigned tasks
- View dashboard insights
- Update personal profile

## Setup

### 1. Backend

```bash
cd server
npm install
```

Copy `.env.example` to `.env` and set:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
ADMIN_NAME=System Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123
```

Start the backend:

```bash
npm run dev
```

### 2. Frontend

```bash
cd client
npm install
```

Copy `.env.example` to `.env` and set:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

## Deployment

This repo is an isolated monorepo, so deploy `server/` and `client/` as separate Railway services.

Railway setup:

- Backend service root directory: `/server`
- Frontend service root directory: `/client`
- If Railway does not auto-detect the config file, set:
- Backend config path: `/server/railway.json`
- Frontend config path: `/client/railway.json`

This project is set up to deploy, but you must provide real production environment values.

### Backend environment

Set these on your backend host:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_strong_jwt_secret
CLIENT_URL=https://your-frontend-domain.com
ADMIN_NAME=System Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_strong_admin_password
```

`CLIENT_URL` also supports multiple frontend domains by separating them with commas:

```env
CLIENT_URL=https://your-frontend-domain.com,https://www.your-frontend-domain.com
```

### Frontend environment

Set this on your frontend host:

```env
VITE_API_URL=https://your-backend-domain.com/api
```

### Deployment checklist

- Create two Railway services from the same repo, one rooted at `/server` and one rooted at `/client`
- Use a real MongoDB Atlas connection string
- Set a strong `JWT_SECRET`
- Set the correct deployed frontend URL in `CLIENT_URL`
- Set the correct deployed backend URL in `VITE_API_URL`
- Confirm the backend healthcheck passes at `/health`
- Confirm the backend starts successfully and seeds the admin account from env
- Confirm the frontend builds and starts with `npm start`

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/dashboard/stats`
- `GET /api/projects`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `GET /api/users`
- `PUT /api/users/profile`

## Notes

- Admin access is controlled by `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `server/.env`.
- On server startup, the admin account is created or updated automatically from those env values.
- Public users always register as `member` and must login after registering to reach the dashboard.
- Admins can assign tasks to any registered member.
