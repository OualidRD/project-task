-- V3: Add comprehensive demo data for presentation
-- This migration adds sample projects and tasks for the test user

-- Insert/update sample user (password: password123)
INSERT INTO users (email, password_hash, full_name, created_at, updated_at)
VALUES ('test@example.com', '$2a$10$BnPxV7SK2Fq3uYHukXDpUe76ZwemHN2imSekAl39lUCM0wdXU1sQy', 'Test User', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- Get user ID for use in project inserts
WITH test_user AS (
  SELECT id FROM users WHERE email = 'test@example.com'
)

-- Project 1: Task Manager Application (Main Demo Project)
INSERT INTO projects (user_id, title, description, created_at, updated_at)
SELECT u.id, 'Task Manager Application', 'Full-stack project management app built with Spring Boot & React', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM test_user u
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Task Manager Application');

-- Insert tasks for "Task Manager Application" project
INSERT INTO tasks (project_id, title, description, due_date, is_completed, created_at, updated_at)
SELECT p.id, 'Setup Spring Boot project', 'Initialize Spring Boot 3.3 project with all dependencies', CURRENT_DATE + INTERVAL '3 days', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN users u ON p.user_id = u.id 
WHERE u.email = 'test@example.com' AND p.title = 'Task Manager Application'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE project_id = p.id AND title = 'Setup Spring Boot project');

INSERT INTO tasks (project_id, title, description, due_date, is_completed, created_at, updated_at)
SELECT p.id, 'Implement JWT authentication', 'Build JWT token generation and validation system', CURRENT_DATE + INTERVAL '7 days', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN users u ON p.user_id = u.id 
WHERE u.email = 'test@example.com' AND p.title = 'Task Manager Application'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE project_id = p.id AND title = 'Implement JWT authentication');

INSERT INTO tasks (project_id, title, description, due_date, is_completed, created_at, updated_at)
SELECT p.id, 'Create database schema', 'Design and implement PostgreSQL schema with migrations', CURRENT_DATE + INTERVAL '5 days', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN users u ON p.user_id = u.id 
WHERE u.email = 'test@example.com' AND p.title = 'Task Manager Application'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE project_id = p.id AND title = 'Create database schema');

INSERT INTO tasks (project_id, title, description, due_date, is_completed, created_at, updated_at)
SELECT p.id, 'Build REST API endpoints', 'Implement CRUD operations for projects and tasks', CURRENT_DATE + INTERVAL '10 days', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN users u ON p.user_id = u.id 
WHERE u.email = 'test@example.com' AND p.title = 'Task Manager Application'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE project_id = p.id AND title = 'Build REST API endpoints');

INSERT INTO tasks (project_id, title, description, due_date, is_completed, created_at, updated_at)
SELECT p.id, 'Create React frontend', 'Build React 19 UI with Material-UI components', CURRENT_DATE + INTERVAL '14 days', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN users u ON p.user_id = u.id 
WHERE u.email = 'test@example.com' AND p.title = 'Task Manager Application'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE project_id = p.id AND title = 'Create React frontend');

INSERT INTO tasks (project_id, title, description, due_date, is_completed, created_at, updated_at)
SELECT p.id, 'Add animations with Framer Motion', 'Implement smooth animations and transitions', CURRENT_DATE + INTERVAL '12 days', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN users u ON p.user_id = u.id 
WHERE u.email = 'test@example.com' AND p.title = 'Task Manager Application'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE project_id = p.id AND title = 'Add animations with Framer Motion');

INSERT INTO tasks (project_id, title, description, due_date, is_completed, created_at, updated_at)
SELECT p.id, 'Implement pagination', 'Add pagination support for projects and tasks', CURRENT_DATE + INTERVAL '16 days', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN users u ON p.user_id = u.id 
WHERE u.email = 'test@example.com' AND p.title = 'Task Manager Application'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE project_id = p.id AND title = 'Implement pagination');

INSERT INTO tasks (project_id, title, description, due_date, is_completed, created_at, updated_at)
SELECT p.id, 'Add search and filter', 'Implement real-time search and status filtering', CURRENT_DATE + INTERVAL '18 days', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN users u ON p.user_id = u.id 
WHERE u.email = 'test@example.com' AND p.title = 'Task Manager Application'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE project_id = p.id AND title = 'Add search and filter');

INSERT INTO tasks (project_id, title, description, due_date, is_completed, created_at, updated_at)
SELECT p.id, 'Write unit tests', 'Create comprehensive unit tests for services and controllers', CURRENT_DATE + INTERVAL '20 days', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN users u ON p.user_id = u.id 
WHERE u.email = 'test@example.com' AND p.title = 'Task Manager Application'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE project_id = p.id AND title = 'Write unit tests');

INSERT INTO tasks (project_id, title, description, due_date, is_completed, created_at, updated_at)
SELECT p.id, 'Setup Docker and Docker Compose', 'Containerize application for production deployment', CURRENT_DATE + INTERVAL '21 days', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN users u ON p.user_id = u.id 
WHERE u.email = 'test@example.com' AND p.title = 'Task Manager Application'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE project_id = p.id AND title = 'Setup Docker and Docker Compose');

INSERT INTO tasks (project_id, title, description, due_date, is_completed, created_at, updated_at)
SELECT p.id, 'Record demo video', 'Create professional 2-minute demo video', CURRENT_DATE + INTERVAL '22 days', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN users u ON p.user_id = u.id 
WHERE u.email = 'test@example.com' AND p.title = 'Task Manager Application'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE project_id = p.id AND title = 'Record demo video');

-- Project 2: Mobile App Redesign
INSERT INTO projects (user_id, title, description, created_at, updated_at)
SELECT u.id, 'Mobile App Redesign', 'Complete redesign of mobile application with modern UI/UX', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM test_user u
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Mobile App Redesign');

INSERT INTO tasks (project_id, title, description, due_date, is_completed, created_at, updated_at)
SELECT p.id, 'Research competitor apps', 'Analyze 5 competitor mobile applications', CURRENT_DATE + INTERVAL '4 days', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN users u ON p.user_id = u.id 
WHERE u.email = 'test@example.com' AND p.title = 'Mobile App Redesign'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE project_id = p.id AND title = 'Research competitor apps');

INSERT INTO tasks (project_id, title, description, due_date, is_completed, created_at, updated_at)
SELECT p.id, 'Create wireframes', 'Design wireframes for all main screens', CURRENT_DATE + INTERVAL '10 days', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN users u ON p.user_id = u.id 
WHERE u.email = 'test@example.com' AND p.title = 'Mobile App Redesign'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE project_id = p.id AND title = 'Create wireframes');

INSERT INTO tasks (project_id, title, description, due_date, is_completed, created_at, updated_at)
SELECT p.id, 'Design UI mockups', 'Create high-fidelity UI mockups in Figma', CURRENT_DATE + INTERVAL '15 days', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN users u ON p.user_id = u.id 
WHERE u.email = 'test@example.com' AND p.title = 'Mobile App Redesign'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE project_id = p.id AND title = 'Design UI mockups');

INSERT INTO tasks (project_id, title, description, due_date, is_completed, created_at, updated_at)
SELECT p.id, 'Get client feedback', 'Present designs to client for review and feedback', CURRENT_DATE + INTERVAL '18 days', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN users u ON p.user_id = u.id 
WHERE u.email = 'test@example.com' AND p.title = 'Mobile App Redesign'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE project_id = p.id AND title = 'Get client feedback');

-- Project 3: Database Migration
INSERT INTO projects (user_id, title, description, created_at, updated_at)
SELECT u.id, 'Database Migration', 'Migrate legacy database to PostgreSQL', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM test_user u
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Database Migration');

INSERT INTO tasks (project_id, title, description, due_date, is_completed, created_at, updated_at)
SELECT p.id, 'Backup legacy database', 'Create full backup of existing MySQL database', CURRENT_DATE + INTERVAL '2 days', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN users u ON p.user_id = u.id 
WHERE u.email = 'test@example.com' AND p.title = 'Database Migration'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE project_id = p.id AND title = 'Backup legacy database');

INSERT INTO tasks (project_id, title, description, due_date, is_completed, created_at, updated_at)
SELECT p.id, 'Design new PostgreSQL schema', 'Plan normalized schema for PostgreSQL', CURRENT_DATE + INTERVAL '6 days', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN users u ON p.user_id = u.id 
WHERE u.email = 'test@example.com' AND p.title = 'Database Migration'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE project_id = p.id AND title = 'Design new PostgreSQL schema');

INSERT INTO tasks (project_id, title, description, due_date, is_completed, created_at, updated_at)
SELECT p.id, 'Write data migration scripts', 'Create Python scripts to migrate data', CURRENT_DATE + INTERVAL '12 days', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN users u ON p.user_id = u.id 
WHERE u.email = 'test@example.com' AND p.title = 'Database Migration'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE project_id = p.id AND title = 'Write data migration scripts');

INSERT INTO tasks (project_id, title, description, due_date, is_completed, created_at, updated_at)
SELECT p.id, 'Test data integrity', 'Verify all data migrated correctly and completely', CURRENT_DATE + INTERVAL '15 days', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN users u ON p.user_id = u.id 
WHERE u.email = 'test@example.com' AND p.title = 'Database Migration'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE project_id = p.id AND title = 'Test data integrity');

INSERT INTO tasks (project_id, title, description, due_date, is_completed, created_at, updated_at)
SELECT p.id, 'Update application connections', 'Update all app database connection strings', CURRENT_DATE + INTERVAL '16 days', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN users u ON p.user_id = u.id 
WHERE u.email = 'test@example.com' AND p.title = 'Database Migration'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE project_id = p.id AND title = 'Update application connections');
