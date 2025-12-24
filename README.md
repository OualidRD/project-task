# Task Manager - Full-Stack Project Management Application

A comprehensive, production-ready task management application built with **Spring Boot 3.3.5**, **React 19**, **PostgreSQL 16**, and **Docker**. Designed with clean architecture principles, JWT authentication, and a modern, animated UI.

## � Demo Video

**[Watch Demo Video](https://drive.google.com/drive/u/0/folders/1ZE8eh4NVlb0fJRaUDTIykukZ5EViuWU2)** 

---

- [Demo Video](#demo-video)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Local Development](#local-development)
- [Docker Deployment](#docker-deployment)
- [API Documentation](#api-documentation)
- [Database Setup](#database-setup)
- [Architecture](#architecture)

## ✨ Features

### Backend
- **JWT Authentication**: Secure token-based authentication with Spring Security
- **RESTful API**: Fully documented endpoints with OpenAPI/Swagger
- **Database**: PostgreSQL with Flyway migrations
- **Input Validation**: Bean Validation with comprehensive error handling
- **Pagination & Search**: Advanced task searching and filtering
- **Performance Optimization**: Query optimization with indexes and caching
- **CORS Support**: Cross-origin resource sharing configured

### Frontend
- **Modern UI**: Material-UI components with Framer Motion animations
- **Dashboard**: Dynamic progress charts and animated cards
- **Project Management**: Create, read, update, delete projects
- **Task Management**: Full CRUD operations with task completion tracking
- **Real-time Updates**: Live progress calculations and status updates
- **Responsive Design**: Mobile-first responsive layout
- **Error Handling**: Toast notifications for user feedback
- **Protected Routes**: Authentication-based route protection

### DevOps
- **Docker Support**: Multi-stage builds for both backend and frontend
- **Docker Compose**: Complete stack orchestration with health checks
- **Database Persistence**: Volume management for PostgreSQL data
- **Environment Configuration**: Environment-based configuration management

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.3.5
- **Language**: Java 21
- **ORM**: Spring Data JPA + Hibernate
- **Database**: PostgreSQL 16
- **Authentication**: JWT (jjwt 0.12.3) + Spring Security
- **Validation**: Jakarta Validation
- **Migrations**: Flyway
- **API Documentation**: Springdoc OpenAPI 2.3.0
- **Build Tool**: Maven 3.9.9

### Frontend
- **Framework**: React 19.x
- **Build Tool**: Vite 5.0.8
- **Language**: TypeScript 5.2.2
- **UI Library**: Material-UI 5.14.20
- **Animations**: Framer Motion 10.16.16
- **Charts**: Recharts 2.10.3
- **HTTP Client**: Axios 1.6.7
- **Routing**: React Router v6
- **Notifications**: React Toastify 9.1.3
- **Date Picker**: MUI X Date Pickers 7.2.0

### DevOps
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx (Alpine)
- **Base Images**: 
  - Backend: openjdk:21-jdk-slim
  - Frontend: node:20-alpine, nginx:alpine
  - Database: postgres:16-alpine

## 📁 Project Structure

```
TaskManagerApp/
├── backend/                          # Spring Boot API
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/taskmanager/
│   │   │   │   ├── config/                      # Spring Configuration
│   │   │   │   ├── controllers/                 # REST API Controllers
│   │   │   │   ├── dtos/                        # Data Transfer Objects
│   │   │   │   ├── exceptions/                  # Custom Exception Classes
│   │   │   │   ├── models/                      # JPA Entity Models
│   │   │   │   ├── repositories/                # Data Access Layer (Spring Data JPA)
│   │   │   │   ├── security/                    # JWT & Spring Security Config
│   │   │   │   ├── services/                    # Business Logic Layer
│   │   │   │   ├── GenerateHash.java            # Utility for Password Hashing
│   │   │   │   └── TaskManagerApplication.java  # Main Spring Boot Entry Point
│   │   │   └── resources/
│   │   │       ├── db/migration/                # Flyway SQL Migrations
│   │   │       │   ├── V1__Initial_schema.sql
│   │   │       │   ├── V2__Insert_sample_data.sql
│   │   │       │   └── V3__Add_demo_data.sql
│   │   │       ├── application.yml              # Main Configuration
│   │   │       └── application-profiles.yml     # Profile-specific Config
│   │   └── test/
│   │       ├── java/com/example/taskmanager/
│   │       │   ├── controllers/                 # Controller Unit Tests (@SpringBootTest)
│   │       │   ├── repositories/                # Repository Integration Tests (@DataJpaTest)
│   │       │   └── services/                    # Service Unit Tests (Mockito)
│   │       └── resources/
│   │           └── application-test.yml         # Test Database Config (H2)
│   ├── pom.xml                       # Maven Dependencies & Build Config
│   ├── Dockerfile                    # Multi-stage Docker Build
│   ├── HashPassword.java             # Password Hashing Utility
│   ├── TestBCrypt.java               # BCrypt Testing Utility
│   └── .gitignore
│
├── frontend/                         # React 19 + TypeScript Application
│   ├── src/
│   │   ├── components/               # Reusable React Components
│   │   │   ├── AdvancedCircularProgress.tsx
│   │   │   ├── AnimatedCounter.tsx
│   │   │   ├── AnimatedStat.tsx
│   │   │   ├── DeleteConfirmDialog.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── LoadingOverlay.tsx
│   │   │   ├── ProfessionalNavbar.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── SmartTaskFilter.tsx
│   │   ├── pages/                    # Page Components
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── LandingPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── ProjectDetailPage.tsx
│   │   │   ├── ProjectsPage.tsx
│   │   │   └── SignUpPage.tsx
│   │   ├── services/                 # API Service Layer
│   │   │   ├── api.ts                # Axios HTTP Client Config
│   │   │   ├── authService.ts        # Authentication API Calls
│   │   │   ├── projectService.ts     # Project API Calls
│   │   │   └── taskService.ts        # Task API Calls
│   │   ├── context/                  # React Context API
│   │   │   ├── AuthContext.tsx       # Authentication State Management
│   │   │   └── ThemeContext.tsx      # Dark/Light Theme State
│   │   ├── hooks/                    # Custom React Hooks
│   │   │   └── useToast.ts           # Toast Notification Hook
│   │   ├── assets/                   # Static Assets (Images, Icons)
│   │   ├── App.tsx                   # Main App Component
│   │   ├── main.tsx                  # React Entry Point
│   │   ├── index.css                 # Global Styles
│   │   └── vite-env.d.ts             # Vite Type Definitions
│   ├── public/                       # Static Public Assets
│   ├── package.json                  # npm Dependencies
│   ├── tsconfig.json                 # TypeScript Configuration
│   ├── tsconfig.node.json            # TypeScript Node Config
│   ├── vite.config.ts                # Vite Build Configuration
│   ├── vite.config.d.ts              # Vite Type Definitions
│   ├── vite.config.js                # Vite Config (alternative)
│   ├── eslint.config.js              # ESLint Configuration
│   ├── index.html                    # HTML Template
│   ├── nginx.conf                    # Nginx Production Server Config
│   ├── Dockerfile                    # Multi-stage Docker Build
│   ├── .nvmrc                        # Node Version Management
│   └── .gitignore
│
├── docker-compose.yml                # Docker Compose Orchestration
├── .env.example                      # Environment Variables Template
├── .gitignore                        # Git Ignore Rules
├── insert_demo_data.sql              # Demo Data SQL Script
└── README.md                         # Project Documentation
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose installed
- Or: Java 21, Node.js 20, PostgreSQL 16 (for local development)

### Using Docker Compose (Recommended)

```bash
cd TaskManagerApp
docker-compose up --build
```

Access the application:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **Swagger API Docs**: http://localhost:8080/api/swagger-ui.html

**Demo Credentials:**
- Email: `test@example.com`
- Password: `password123`

## 💻 Local Development

### Backend Setup

```bash
# Navigate to backend
cd backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

**Backend will be available at**: http://localhost:8080/api

### Database Setup (Local)

```bash
# Using Docker for PostgreSQL only
docker run --name taskmanager-db \
  -e POSTGRES_DB=project_task \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=pass \
  -p 5432:5432 \
  postgres:16

# Or update application.yml to use your existing database
```

**Update `backend/src/main/resources/application.yml`:**
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/project_task
    username: user
    password: pass
```

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend will be available at**: http://localhost:5173

## 🐳 Docker Deployment

### Build Images

```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build backend
docker-compose build frontend
```

### Run Full Stack

```bash
# Start services
docker-compose up

# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes (data)
docker-compose down -v
```

### Environment Variables

Create `.env` file in root directory:

```env
JWT_SECRET=your-secret-key-change-in-production-environment-12345678901234567890
JWT_EXPIRATION=86400000
SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/project_task
SPRING_DATASOURCE_USERNAME=user
SPRING_DATASOURCE_PASSWORD=pass
VITE_API_URL=http://backend:8080
```

## 📚 API Documentation

### Authentication

**Login Endpoint**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400000,
  "user": {
    "id": 1,
    "email": "test@example.com",
    "fullName": "Test User"
  }
}
```

### Projects

```
GET    /api/projects              # List projects (paginated)
POST   /api/projects              # Create project
GET    /api/projects/{id}         # Get project details
PUT    /api/projects/{id}         # Update project
DELETE /api/projects/{id}         # Delete project
```

### Tasks

```
GET    /api/projects/{projectId}/tasks              # List tasks
POST   /api/projects/{projectId}/tasks              # Create task
GET    /api/projects/{projectId}/tasks/{taskId}     # Get task
PUT    /api/projects/{projectId}/tasks/{taskId}     # Update task
PUT    /api/projects/{projectId}/tasks/{taskId}/complete  # Complete task
DELETE /api/projects/{projectId}/tasks/{taskId}     # Delete task
GET    /api/projects/{projectId}/tasks/search?searchTerm=...  # Search tasks
```

### Progress

```
GET    /api/projects/{projectId}/tasks/progress     # Get project progress
```

**Response:**
```json
{
  "totalTasks": 10,
  "completedTasks": 7,
  "progressPercentage": 70.0
}
```

### Headers

All requests (except login) require:
```
Authorization: Bearer <JWT_TOKEN>
```

**Full API Documentation**: Available at `/api/swagger-ui.html` when backend is running

## 🗄️ Database Setup

### Schema Overview

**Users Table**
```sql
- id (BIGSERIAL PRIMARY KEY)
- email (VARCHAR UNIQUE)
- password_hash (VARCHAR)
- full_name (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Projects Table**
```sql
- id (BIGSERIAL PRIMARY KEY)
- user_id (BIGINT FOREIGN KEY)
- title (VARCHAR)
- description (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Tasks Table**
```sql
- id (BIGSERIAL PRIMARY KEY)
- project_id (BIGINT FOREIGN KEY)
- title (VARCHAR)
- description (TEXT)
- due_date (DATE)
- is_completed (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Migrations

Migrations are managed with Flyway and automatically applied on startup:
- `V1__Initial_schema.sql`: Creates tables and indexes
- `V2__Insert_sample_data.sql`: Inserts demo user and sample data

## 🏗️ Architecture

### Clean Architecture Principles

The application follows **layered architecture** with **Domain-Driven Design** concepts:

1. **Controllers Layer**: HTTP request handling
2. **Service Layer**: Business logic & orchestration
3. **Repository Layer**: Data access abstraction
4. **Model Layer**: Domain entities
5. **DTO Layer**: Data transfer between layers

### Security

- **JWT Tokens**: Stateless authentication
- **Password Hashing**: BCrypt encryption (strength 10)
- **CORS**: Configured for frontend communication
- **Authorization**: Method-level security on protected endpoints

### Performance

- **Database Indexes**: Optimized on foreign keys and search fields
- **Pagination**: Large result sets handled with pagination
- **Query Optimization**: Efficient JPA queries with projections
- **Lazy Loading**: Entity relationships configured for optimal loading

## 📝 Sample Requests

### Create Project

```bash
curl -X POST http://localhost:8080/api/projects \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Website Redesign",
    "description": "Redesign company website with modern UI"
  }'
```

### Create Task

```bash
curl -X POST http://localhost:8080/api/projects/1/tasks \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Design mockups",
    "description": "Create UI mockups in Figma",
    "dueDate": "2024-12-31"
  }'
```

### Complete Task

```bash
curl -X PUT http://localhost:8080/api/projects/1/tasks/1/complete \
  -H "Authorization: Bearer <TOKEN>"
```

## 🔧 Development Commands

### Backend

```bash
# Build
mvn clean install

# Run
mvn spring-boot:run

# Run tests
mvn test

# Lint/Format (optional, add plugin to pom.xml)
mvn spotless:apply
```

### Frontend

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Lint
npm run lint
```

## 🐛 Troubleshooting

### Docker Issues

**Port already in use:**
```bash
# Change ports in docker-compose.yml or kill existing containers
docker ps
docker stop <container-id>
```

**Database connection error:**
```bash
# Ensure db service is healthy
docker-compose logs db
```

### Frontend Issues

**Vite proxy not working:**
- Ensure backend is running at http://localhost:8080
- Check `vite.config.ts` proxy configuration

**Token expired:**
- Clear localStorage: `localStorage.clear()`
- Login again

### Backend Issues

**Flyway migration fails:**
- Check database permissions
- Review migration SQL syntax
- Check PostgreSQL logs

**API 401 Unauthorized:**
- Ensure JWT token is in Authorization header
- Check token hasn't expired
- Validate token format: `Bearer <TOKEN>`

## 📦 Deployment Checklist

- [ ] Update JWT secret in docker-compose.yml
- [ ] Configure database backup strategy
- [ ] Set up monitoring and logging
- [ ] Configure SSL/TLS certificates
- [ ] Set up CI/CD pipeline
- [ ] Enable rate limiting
- [ ] Configure CORS for production domains
- [ ] Test all endpoints
- [ ] Review security configurations

## 📄 License

MIT License - See LICENSE file for details

## 👥 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request


---

