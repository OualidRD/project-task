# Architecture & Design Decisions

## Overview

This application follows **Clean Architecture** principles with **Domain-Driven Design** concepts to ensure maintainability, testability, and scalability.

## Layered Architecture

### 1. **Controller Layer** (Presentation)
- Handles HTTP requests and responses
- Input validation with `@Valid`
- Returns DTOs (not entities)
- Located in: `controllers/`

### 2. **Service Layer** (Business Logic)
- Contains core business logic
- Orchestrates repositories and external services
- Transaction management
- Located in: `services/`

### 3. **Repository Layer** (Data Access)
- Abstracts database operations
- Uses Spring Data JPA
- Custom query methods for optimization
- Located in: `repositories/`

### 4. **Model Layer** (Domain)
- JPA Entities representing database tables
- Contains business rules validation
- Lifecycle callbacks (@PrePersist, @PreUpdate)
- Located in: `models/`

### 5. **DTO Layer** (Data Transfer)
- Transfer data between layers
- Prevents exposing domain entities
- Input validation annotations
- Located in: `dtos/`

## Security Architecture

### JWT Authentication Flow

```
1. User submits credentials
2. AuthService authenticates against BCrypt hash
3. JwtTokenProvider generates token
4. Client stores token in localStorage
5. JwtAuthenticationFilter extracts token from Authorization header
6. Token validated on each request
7. UserId added to SecurityContext
```

### Authorization

- Method-level security on sensitive endpoints
- User can only access their own resources
- Verified through userId checks in services

## Data Flow

### Create Task Example

```
Frontend (React)
    ↓
POST /api/projects/{projectId}/tasks
    ↓
TaskController.createTask(CreateTaskRequest)
    ↓
TaskService.createTask() - Business Logic
    ↓
TaskRepository.save(Task) - Persistence
    ↓
PostgreSQL Database
```

## Database Design

### Indexes for Performance
- `users.email`: UNIQUE index for login queries
- `projects.user_id`: Index for user projects lookup
- `tasks.project_id`: Index for project tasks lookup
- `tasks.is_completed`: Index for progress calculations

### Foreign Keys
- `projects.user_id` → `users.id` (CASCADE DELETE)
- `tasks.project_id` → `projects.id` (CASCADE DELETE)

## Frontend Architecture

### Component Structure

```
App
├── AuthProvider (Context)
├── Router
│   ├── LoginPage
│   ├── DashboardPage
│   ├── ProjectsPage
│   └── ProjectDetailPage
│       ├── TaskList
│       ├── TaskForm
│       └── ProgressChart
```

### State Management

- **AuthContext**: Global authentication state
- **Local State**: Component-level state for forms and UI
- **Server State**: Fetched data managed locally with re-fetch

## Configuration Strategy

### Profiles

- **dev**: Local development with verbose logging
- **prod**: Production with optimized settings

### Environment Variables

```
JWT_SECRET: Token signing key
JWT_EXPIRATION: Token lifetime
SPRING_DATASOURCE_URL: Database connection
SPRING_PROFILES_ACTIVE: Active profile
VITE_API_URL: Backend URL for frontend
```

## Performance Optimizations

### Backend
1. **Pagination**: Large result sets paginated (default 20 items)
2. **Lazy Loading**: Entity relationships use LAZY fetch type
3. **Database Indexes**: Optimized query performance
4. **Connection Pooling**: HikariCP with configured pool size
5. **Query Optimization**: Specific SELECT clauses instead of full entities

### Frontend
1. **Code Splitting**: Routes lazy-loaded with React.lazy
2. **Memoization**: Components memoized to prevent unnecessary re-renders
3. **Animations**: GPU-accelerated with Framer Motion
4. **Bundling**: Vite builds optimized with tree-shaking

## Error Handling

### Backend
- Global exception handler in `GlobalExceptionHandler`
- Custom exceptions for specific error cases
- Standardized error response format
- HTTP status codes mapped correctly

### Frontend
- API error interceptor
- Toast notifications for user feedback
- Protected routes redirect to login on 401
- Form validation before submission

## Testing Strategy

### Backend (JUnit 5)
- Unit tests for services
- Integration tests for controllers
- Repository tests with test database

### Frontend (Jest)
- Component unit tests
- API service tests
- Hook tests

## Deployment Architecture

### Docker Composition

```
PostgreSQL (postgres:16-alpine)
    ↓
Spring Boot API (openjdk:21-jdk-slim)
    ↓
React Frontend (nginx:alpine)
```

### Startup Order
1. PostgreSQL starts first
2. Health check waits for DB readiness
3. Spring Boot backend starts (Flyway migrations run)
4. Frontend proxy health check
5. All services ready

## Scaling Considerations

### Horizontal Scaling
- Stateless backend enables load balancing
- JWT tokens valid across instances
- Shared database (PostgreSQL)

### Vertical Scaling
- HikariCP connection pool sizing
- Database query optimization
- Frontend CDN distribution

## Security Best Practices

1. **Password Storage**: BCrypt with strength 10
2. **Token Expiration**: 24-hour token lifetime
3. **CORS Configuration**: Frontend domain specified
4. **Input Validation**: All inputs validated
5. **SQL Injection Prevention**: JPA parameterized queries
6. **Environment Variables**: Secrets not in code
7. **HTTPS**: Recommended in production
