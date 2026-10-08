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

The application reads database and JWT values from environment variables when available.

Example environment variables:

```bash
export DB_URL='jdbc:mysql://localhost:3306/college_club_management?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC'
export DB_USERNAME='root'
export DB_PASSWORD='your-password'
export JWT_SECRET='change-this-secret-key'
```

The frontend uses the Vite `/api` proxy during development. Set `VITE_API_BASE_URL` only when the API is hosted at a different base path. The built-in database and JWT defaults are for local development only; configure strong credentials and a long random JWT secret before deployment.

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

## Test login credentials

These are seeded automatically when the app starts:

- System Admin: `admin@college.com` / `Admin@123`
- Club Admin: `clubadmin@college.com` / `Admin@123`
- Student: `student@college.com` / `Student@123`

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
- If JWT errors appear, verify the `JWT_SECRET` property is set.
- For CORS issues, make sure the frontend runs on `http://localhost:5173`.

## Notes

This project is designed as a beginner-friendly academic application. It uses a clean layered architecture and includes seed data so the app can be demonstrated quickly after setup.
