# API Reference

## Authentication Endpoints

### Login
**POST** `/api/auth/login`

Authenticate user with email and password.

**Request:**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400000,
  "user": {
    "id": 1,
    "email": "test@example.com",
    "fullName": "Test User",
    "createdAt": "2024-12-17T10:30:00"
  }
}
```

**Errors:**
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Invalid credentials

---

## Project Endpoints

### List Projects
**GET** `/api/projects?page=0&size=10`

Retrieve paginated list of user's projects.

**Query Parameters:**
- `page`: Page number (0-indexed)
- `size`: Items per page

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "title": "Website Redesign",
      "description": "Redesign company website",
      "userId": 1,
      "createdAt": "2024-12-17T10:30:00",
      "updatedAt": "2024-12-17T10:30:00"
    }
  ],
  "totalElements": 5,
  "totalPages": 1,
  "currentPage": 0
}
```

---

### Create Project
**POST** `/api/projects`

Create a new project.

**Request:**
```json
{
  "title": "Mobile App Development",
  "description": "Build iOS and Android app"
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "title": "Mobile App Development",
  "description": "Build iOS and Android app",
  "userId": 1,
  "createdAt": "2024-12-17T11:00:00",
  "updatedAt": "2024-12-17T11:00:00"
}
```

---

### Get Project
**GET** `/api/projects/{id}`

Retrieve a specific project.

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Website Redesign",
  "description": "Redesign company website",
  "userId": 1,
  "createdAt": "2024-12-17T10:30:00",
  "updatedAt": "2024-12-17T10:30:00"
}
```

---

### Update Project
**PUT** `/api/projects/{id}`

Update project information.

**Request:**
```json
{
  "title": "Website Redesign - Updated",
  "description": "Updated description"
}
```

**Response (200 OK):** Updated project object

---

### Delete Project
**DELETE** `/api/projects/{id}`

Delete a project and all associated tasks.

**Response (204 No Content)**

---

## Task Endpoints

### List Tasks
**GET** `/api/projects/{projectId}/tasks?page=0&size=20`

List all tasks in a project.

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "title": "Design Homepage",
      "description": "Create homepage mockup",
      "dueDate": "2024-12-31",
      "isCompleted": false,
      "projectId": 1,
      "createdAt": "2024-12-17T10:30:00",
      "updatedAt": "2024-12-17T10:30:00"
    }
  ],
  "totalElements": 3,
  "totalPages": 1,
  "currentPage": 0
}
```

---

### Create Task
**POST** `/api/projects/{projectId}/tasks`

Create a new task in a project.

**Request:**
```json
{
  "title": "Create API Endpoints",
  "description": "Implement REST API endpoints",
  "dueDate": "2024-12-25"
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "title": "Create API Endpoints",
  "description": "Implement REST API endpoints",
  "dueDate": "2024-12-25",
  "isCompleted": false,
  "projectId": 1,
  "createdAt": "2024-12-17T11:00:00",
  "updatedAt": "2024-12-17T11:00:00"
}
```

---

### Get Task
**GET** `/api/projects/{projectId}/tasks/{taskId}`

Retrieve a specific task.

**Response (200 OK):** Task object

---

### Update Task
**PUT** `/api/projects/{projectId}/tasks/{taskId}`

Update task details.

**Request:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "dueDate": "2024-12-30"
}
```

**Response (200 OK):** Updated task object

---

### Complete Task
**PUT** `/api/projects/{projectId}/tasks/{taskId}/complete`

Mark a task as completed.

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Design Homepage",
  "description": "Create homepage mockup",
  "dueDate": "2024-12-31",
  "isCompleted": true,
  "projectId": 1,
  "createdAt": "2024-12-17T10:30:00",
  "updatedAt": "2024-12-17T11:15:00"
}
```

---

### Delete Task
**DELETE** `/api/projects/{projectId}/tasks/{taskId}`

Delete a task.

**Response (204 No Content)**

---

### Search Tasks
**GET** `/api/projects/{projectId}/tasks/search?searchTerm=design&page=0&size=20`

Search tasks by title or description.

**Query Parameters:**
- `searchTerm`: Search keyword
- `page`: Page number
- `size`: Items per page

**Response (200 OK):** Paginated list of matching tasks

---

## Progress Endpoints

### Get Project Progress
**GET** `/api/projects/{projectId}/tasks/progress`

Get progress statistics for a project.

**Response (200 OK):**
```json
{
  "totalTasks": 10,
  "completedTasks": 7,
  "progressPercentage": 70.0
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "status": 400,
  "message": "Validation failed",
  "errors": {
    "title": "Title must be between 3 and 200 characters",
    "email": "Email should be valid"
  },
  "timestamp": "2024-12-17T11:20:00",
  "path": "/api/projects"
}
```

### 401 Unauthorized
```json
{
  "status": 401,
  "message": "Invalid email or password",
  "timestamp": "2024-12-17T11:20:00",
  "path": "/api/auth/login"
}
```

### 404 Not Found
```json
{
  "status": 404,
  "message": "Project not found",
  "timestamp": "2024-12-17T11:20:00",
  "path": "/api/projects/999"
}
```

### 500 Internal Server Error
```json
{
  "status": 500,
  "message": "An unexpected error occurred",
  "timestamp": "2024-12-17T11:20:00",
  "path": "/api/projects"
}
```

---

## Authentication

All endpoints (except `/api/auth/login`) require authentication.

**Header:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Example:**
```bash
curl -X GET http://localhost:8080/api/projects \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Rate Limiting

Currently not implemented. Can be added using Spring Cloud Gateway or custom interceptor.

---

## Pagination

Default pagination:
- Page number: 0-indexed
- Default size: 10-20 items
- Maximum: 100 items per request

**Example:**
```
/api/projects?page=0&size=10
/api/projects/1/tasks?page=1&size=20
```

---

## Sorting

Sorting not currently implemented. Can be added with `@PageableDefault` and `Sort` parameters.
