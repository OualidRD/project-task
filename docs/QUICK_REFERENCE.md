# Quick Reference Guide

## 🚀 Fastest Way to Run the App

### With Docker (Easiest)
```bash
cd TaskManagerApp
docker-compose up --build

# Access:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080/api
# Swagger Docs: http://localhost:8080/api/swagger-ui.html
```

**Demo Credentials:**
```
Email: test@example.com
Password: password123
```

---

## 💻 Local Development Setup

### Prerequisites
- Java 21
- Node.js 20
- PostgreSQL 16 (or Docker for DB only)
- Maven 3.9+
- npm/yarn

### Backend

```bash
# Start PostgreSQL (Docker)
docker run --name taskmanager-db -e POSTGRES_DB=project_task \
  -e POSTGRES_USER=user -e POSTGRES_PASSWORD=pass \
  -p 5432:5432 postgres:16

# Build and run
cd backend
mvn clean install
mvn spring-boot:run

# Server runs at: http://localhost:8080/api
# Swagger UI: http://localhost:8080/api/swagger-ui.html
```

### Frontend

```bash
cd frontend
npm install
npm run dev

# Server runs at: http://localhost:5173
# Auto-proxies /api to http://localhost:8080
```

---

## 📁 Key File Locations

### Backend Configuration
- `backend/src/main/resources/application.yml` - Main config
- `backend/pom.xml` - Dependencies

### Frontend Configuration
- `frontend/vite.config.ts` - Vite config
- `frontend/package.json` - Dependencies
- `frontend/tsconfig.json` - TypeScript config

### Database
- `backend/src/main/resources/db/migration/V1__Initial_schema.sql` - Schema
- `backend/src/main/resources/db/migration/V2__Insert_sample_data.sql` - Sample data

### Docker
- `docker-compose.yml` - Stack configuration
- `backend/Dockerfile` - Backend image
- `frontend/Dockerfile` - Frontend image
- `frontend/nginx.conf` - Nginx configuration

---

## 🔌 API Quick Reference

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Get Projects
```bash
curl -X GET http://localhost:8080/api/projects \
  -H "Authorization: Bearer <TOKEN>"
```

### Create Project
```bash
curl -X POST http://localhost:8080/api/projects \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Project","description":"Description"}'
```

### Get Project Progress
```bash
curl -X GET http://localhost:8080/api/projects/1/tasks/progress \
  -H "Authorization: Bearer <TOKEN>"
```

### Create Task
```bash
curl -X POST http://localhost:8080/api/projects/1/tasks \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Task 1","description":"Do something","dueDate":"2024-12-31"}'
```

### Complete Task
```bash
curl -X PUT http://localhost:8080/api/projects/1/tasks/1/complete \
  -H "Authorization: Bearer <TOKEN>"
```

---

## 🐳 Docker Commands

### Build
```bash
docker-compose build              # Build all
docker-compose build backend      # Build backend only
```

### Run
```bash
docker-compose up                 # Run in foreground
docker-compose up -d              # Run in background
```

### Logs
```bash
docker-compose logs -f                 # All services
docker-compose logs -f backend         # Backend only
docker-compose logs -f db              # Database only
```

### Stop & Clean
```bash
docker-compose stop               # Stop services
docker-compose down               # Stop and remove
docker-compose down -v            # Remove with volumes
```

### Status
```bash
docker-compose ps                 # Running containers
docker-compose exec db psql -U user -d project_task   # Connect to DB
```

---

## 📊 Database Quick Reference

### Connect to PostgreSQL (Docker)
```bash
docker-compose exec db psql -U user -d project_task
```

### Common SQL Queries
```sql
-- List users
SELECT * FROM users;

-- List projects
SELECT * FROM projects;

-- List tasks
SELECT * FROM tasks;

-- Count tasks by project
SELECT p.title, COUNT(t.id) as task_count 
FROM projects p LEFT JOIN tasks t ON p.id = t.project_id 
GROUP BY p.id;

-- Get task completion stats
SELECT 
  COUNT(*) as total_tasks,
  SUM(CASE WHEN is_completed = true THEN 1 ELSE 0 END) as completed_tasks
FROM tasks WHERE project_id = 1;
```

---

## 🔑 Environment Variables

### Backend (docker-compose.yml)
```yaml
JWT_SECRET=your-secret-key
JWT_EXPIRATION=86400000
SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/project_task
SPRING_DATASOURCE_USERNAME=user
SPRING_DATASOURCE_PASSWORD=pass
SPRING_PROFILES_ACTIVE=prod
```

### Frontend (docker-compose.yml)
```yaml
VITE_API_URL=http://backend:8080
```

---

## 🛠️ Common Tasks

### Add New API Endpoint

1. **Create DTO** (if needed)
   ```java
   // src/main/java/com/example/taskmanager/dtos/YourDTO.java
   ```

2. **Add Repository Method** (if needed)
   ```java
   // src/main/java/com/example/taskmanager/repositories/YourRepository.java
   ```

3. **Add Service Method**
   ```java
   // src/main/java/com/example/taskmanager/services/YourService.java
   ```

4. **Add Controller Method**
   ```java
   // src/main/java/com/example/taskmanager/controllers/YourController.java
   ```

### Add New React Component

1. **Create Component**
   ```typescript
   // frontend/src/components/YourComponent.tsx
   ```

2. **Export from Components**
   ```typescript
   // Update imports in pages as needed
   ```

3. **Use in Pages/Components**

### Update Database Schema

1. **Create Migration File**
   ```sql
   // backend/src/main/resources/db/migration/V3__Your_Migration.sql
   ```

2. **Restart Backend**
   - Flyway runs migrations automatically on startup

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :8080
kill -9 <PID>
```

### Docker Network Issues
```bash
docker network inspect bridge
docker network prune
```

### Database Connection Error
```bash
# Verify PostgreSQL is running
docker-compose ps

# Check logs
docker-compose logs db

# Verify credentials in application.yml
```

### Build Failed
```bash
# Clean Maven cache
mvn clean

# Clear Docker build cache
docker-compose build --no-cache

# Rebuild everything
docker-compose down -v && docker-compose up --build
```

### Frontend API Errors
- Check browser console (F12)
- Verify backend is running
- Check Authorization header in Network tab
- Verify CORS configuration

---

## 📚 File Structure Reference

```
TaskManagerApp/
├── backend/
│   ├── src/main/java/.../
│   │   ├── controllers/     (REST endpoints)
│   │   ├── services/        (Business logic)
│   │   ├── repositories/    (Data access)
│   │   ├── models/          (Database entities)
│   │   ├── dtos/            (Data transfer objects)
│   │   ├── security/        (JWT & Auth)
│   │   ├── config/          (Configuration)
│   │   └── exceptions/      (Custom exceptions)
│   ├── pom.xml
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/           (Page components)
│   │   ├── components/      (Reusable components)
│   │   ├── services/        (API calls)
│   │   ├── context/         (State management)
│   │   ├── hooks/           (Custom hooks)
│   │   └── App.tsx          (Main component)
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 🎯 Development Workflow

### 1. Start Services
```bash
docker-compose up -d
```

### 2. Check Services Running
```bash
docker-compose ps
```

### 3. Make Code Changes
- Backend: Changes auto-reload with Spring DevTools
- Frontend: Changes auto-reload with Vite HMR

### 4. Test Changes
- Backend: Use Postman/curl or Swagger UI
- Frontend: Use browser dev tools

### 5. Push Changes
```bash
git add .
git commit -m "Feature description"
git push
```

---

## 📈 Monitoring

### View Logs
```bash
# All services
docker-compose logs -f --tail=50

# Specific service
docker-compose logs -f backend --tail=50
```

### Health Checks
```bash
# Check services
curl http://localhost:8080/api/health          # Backend health
curl http://localhost:3000                     # Frontend health
```

---

## 🔐 Default Credentials

| Item | Value |
|------|-------|
| Email | test@example.com |
| Password | password123 |
| DB User | user |
| DB Password | pass |
| DB Name | project_task |

---

**💡 Tip:** Bookmark this guide for quick reference during development!
