# CIS 3339 Homework 1 - Student Management System

A full-stack Student Management System. The original HTML/JavaScript frontend was migrated to **Vue 3 (Composition API)** with **Vue Router** and **Pinia**, and the JSON file storage was replaced with **MongoDB** (Mongoose). Express serves both the REST API and the Vue production build.

## Features

- **Students** - add, search (by name or student ID), list, and delete
- **Courses** - add, list, and delete
- **Enrollments** - enroll a student in a course and list the students in a course
- Validation on the form and on the server, duplicate checks, and cascading deletes (deleting a student or a course also removes its enrollments)

## Required Software

- [Node.js](https://nodejs.org/) 20 or newer (includes npm)
- [MongoDB Community Edition](https://www.mongodb.com/docs/manual/administration/install-community/) running locally on the default port `27017`
- A modern web browser

## Environment Variables

The backend reads its settings from `backend/.env`, which is included in the repository:

| Variable      | Value                                         | Description                      |
| ------------- | --------------------------------------------- | -------------------------------- |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/cis3339_homework1` | Local MongoDB connection string  |
| `PORT`        | `3000`                                        | Port the Express server runs on  |

No passwords or cloud accounts are needed.

## Start MongoDB

MongoDB has to be running before the server is started.

**macOS (Homebrew)**

```bash
brew services start mongodb-community
```

**Windows** - MongoDB is installed as a service and normally starts automatically. If it is not running:

```bash
net start MongoDB
```

**Linux**

```bash
sudo systemctl start mongod
```

You do not have to create the database or any collections. The `cis3339_homework1` database, its collections, and the unique indexes are created automatically when the server starts.

## Install, Build, and Run

Run these from the root of the repository:

```bash
npm install
npm run build
npm start
```

- `npm install` installs the dependencies for both `backend/` and `frontend/` (npm workspaces)
- `npm run build` builds the Vue app into `frontend/dist`
- `npm start` starts the Express server, which serves the API and the built Vue app

Then open **http://localhost:3000** in a browser.

## Development Mode (optional)

To work on the frontend with hot reload, run the backend and the Vite dev server in two terminals:

```bash
npm run dev:backend
npm run dev:frontend
```

The Vite dev server runs at http://localhost:5173 and proxies `/api` requests to the backend on port 3000.

## Project Structure

```
backend/
  .env                  MongoDB connection string and port
  server.js             loads .env, connects to MongoDB, starts the server
  app.js                Express app (API routes + serves frontend/dist)
  db.js                 MongoDB connection and index setup
  models/               Mongoose schemas: Student, Course, Enrollment
  routes/               students, courses, enrollments
  middleware/           error handling
frontend/
  src/
    main.js             creates the app, Pinia, and the router
    App.vue             layout (nav + router view)
    router/             Vue Router routes
    stores/             Pinia stores: students, courses, enrollments, notifications
    services/api.js     fetch calls to the backend
    views/              StudentsView, CoursesView, EnrollmentsView, NotFoundView
    components/         forms, tables, nav, status and toast messages
```

## API Endpoints

| Method | Endpoint                    | Description                                             |
| ------ | --------------------------- | ------------------------------------------------------- |
| GET    | `/api/students`             | List students (`?search=` filters by name or student ID) |
| POST   | `/api/students`             | Add a student `{ name, studentId, phone, zip }`          |
| DELETE | `/api/students/:id`         | Delete a student and that student's enrollments          |
| GET    | `/api/courses`              | List courses                                             |
| POST   | `/api/courses`              | Add a course `{ courseId, name }`                        |
| DELETE | `/api/courses/:id`          | Delete a course and that course's enrollments            |
| GET    | `/api/courses/:id/students` | List the students enrolled in a course                   |
| GET    | `/api/enrollments`          | List all enrollments                                     |
| POST   | `/api/enrollments`          | Enroll a student `{ studentId, courseId }`               |
| DELETE | `/api/enrollments/:id`      | Remove an enrollment                                     |

Status codes: `201` created, `400` validation error, `404` not found, `409` duplicate, `503` database not available. Errors are returned as `{ "error": "message" }`.

In `POST /api/enrollments`, `studentId` and `courseId` are the MongoDB `_id` values of the student and course.

## Data Model

- **Student** - `name`, `studentId` (unique), `phone`, `zip`
- **Course** - `courseId` (unique, saved in uppercase), `name`
- **Enrollment** - `student` (reference to Student), `course` (reference to Course), with a unique index on the pair so a student cannot be enrolled in the same course twice

## Troubleshooting

- **"Could not connect to MongoDB"** - MongoDB is not running. Start it with the command for your system above and run `npm start` again.
- **"Frontend build not found"** - run `npm run build` and restart the server.
- **Port 3000 is already in use** - change `PORT` in `backend/.env`.
