# College Club Management System

A full-stack College Club Management System built with Spring Boot and React. It includes role-based authentication for students, club admins, and system admins, membership workflows, event management, announcements, feedback, attendance tracking, and simple dashboard statistics.

## Tech Stack

- Backend: Java 17, Spring Boot 3, Spring MVC, Spring Data JPA, Hibernate, Spring Security, JWT
- Frontend: React + Vite + JavaScript + Axios + React Router
- Database: MySQL

## Project Structure

```
ClubManagement
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/college/clubmanagement
│       ├── config
│       ├── controller
│       ├── dto
│       ├── entity
│       ├── exception
│       ├── repository
│       ├── security
│       ├── service
│       └── ClubManagementApplication.java
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src
├── .gitignore
└── README.md
```

## Prerequisites

- Java 17 or newer
- Maven 3.9+
- Node.js 18+
- MySQL 8+

## MySQL Setup

1. Start MySQL locally.
2. Create a database:
   ```sql
   CREATE DATABASE college_club_management;
   ```
3. Update the backend database configuration in `backend/src/main/resources/application.properties` or set environment variables.

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/college_club_management?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your-password
```

## Backend configuration

The application reads database and JWT values from environment variables when available. For local runs, it also loads an optional `backend/.env` file. Copy `backend/.env.example` to `backend/.env`, then replace the MySQL password and JWT secret. The local `.env` file is ignored by Git.

Example environment variables:

```bash
export DB_URL='jdbc:mysql://localhost:3306/college_club_management?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC'
export DB_USERNAME='root'
export DB_PASSWORD='your-password'
export JWT_SECRET="$(openssl rand -base64 32)"
export SEED_ADMIN_PASSWORD='admin123'
export SEED_ADMIN_2_PASSWORD='admin123'
export SEED_ADMIN_3_PASSWORD='admin123'
export SEED_CLUB_ADMIN_PASSWORD='choose-another-unique-password'
export SEED_STUDENT_PASSWORD='choose-a-third-unique-password'
```

The frontend uses the Vite `/api` proxy during development. Set `VITE_API_BASE_URL` only when the API is hosted at a different base path. Database passwords and JWT secrets have no built-in defaults. `JWT_SECRET` must contain at least 32 characters for HS256. For local development, set `SEED_ADMIN_PASSWORD`, `SEED_ADMIN_2_PASSWORD`, and `SEED_ADMIN_3_PASSWORD` to create three system admin accounts: `admin@college.com`, `admin2@college.com`, and `admin3@college.com`. The VS Code example below uses `admin123` for all three local accounts, as requested. When these variables are set, the seeder configures the matching accounts as system admins and applies the supplied passwords. Do not use these shared demo credentials outside local development. The optional club-admin and student accounts use `SEED_CLUB_ADMIN_PASSWORD` and `SEED_STUDENT_PASSWORD`; sample data is created when both are set along with the first admin password.

## Start backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend runs at:

- http://localhost:8080

## Start frontend

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0
```

The frontend runs at:

- http://localhost:5173

## API overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/clubs`
- `GET /api/events`
- Student: dashboard, club membership requests, event registration and feedback, announcements, and attendance under `/api/student/**`
- Club admin: managed clubs, membership approvals, event and attendance management, announcements, feedback, and statistics under `/api/club-admin/**`
- System admin: dashboard, user and club management, platform listings, and statistics under `/api/admin/**`

## Common issues

- If MySQL is not running, the backend will fail to connect.
- If a port is already used, update the relevant config and restart.
- If JWT errors appear, verify `JWT_SECRET` is set to a random value of at least 32 characters.
- For CORS issues, make sure the frontend runs on `http://localhost:5173`.

## Notes

This project is designed as a beginner-friendly academic application. It uses a layered architecture and can load sample records when the optional seeded accounts are configured.

## Run locally in VS Code on macOS

1. Install Java 17, Maven 3.9+, Node.js 18+, MySQL 8+, and the VS Code Extension Pack for Java.
2. Open this project folder in VS Code. Start MySQL and create the database with `CREATE DATABASE college_club_management;` (the JDBC URL can also create it if the MySQL account has permission).
3. Copy `backend/.env.example` to `backend/.env` and replace `DB_PASSWORD` and `JWT_SECRET` with local values. Keep the `.env` file private; Git ignores it.
4. In VS Code, open **Terminal → New Terminal** and start the backend:

   ```bash
   cd backend
   mvn spring-boot:run
   ```

   The seed variables are optional. Uncomment and set them in `backend/.env` if you want seeded demo accounts; otherwise, register users yourself. In VS Code, the **Run and Debug** panel now includes **Run Club Management API** and loads `backend/.env` for you.
5. Open a second VS Code terminal and start the frontend:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

6. Open `http://localhost:5173`. Register a student or sign in using an account created through the optional seed configuration. Keep both terminals running. Stop either server with **Control+C**.

For subsequent sessions, the backend loads values from `backend/.env`. To point Vite at a separately hosted API, set `VITE_API_BASE_URL` in the frontend terminal before starting Vite.
