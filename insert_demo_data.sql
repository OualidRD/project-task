-- Insert demo data for presentation
-- Task Manager Application project
INSERT INTO projects (user_id, title, description, created_at, updated_at)
SELECT id, 'Task Manager Application', 'Full-stack project management app built with Spring Boot & React', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users WHERE email = 'test@example.com'
AND NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Task Manager Application');

-- Mobile App Redesign project
INSERT INTO projects (user_id, title, description, created_at, updated_at)
SELECT id, 'Mobile App Redesign', 'Complete redesign of mobile application with modern UI/UX', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users WHERE email = 'test@example.com'
AND NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Mobile App Redesign');

-- Database Migration project
INSERT INTO projects (user_id, title, description, created_at, updated_at)
SELECT id, 'Database Migration', 'Migrate legacy database to PostgreSQL', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users WHERE email = 'test@example.com'
AND NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Database Migration');

-- Tasks for Task Manager Application
INSERT INTO tasks (project_id, title, description, due_date, is_completed, created_at, updated_at)
SELECT p.id, 'Setup Spring Boot project', 'Initialize Spring Boot 3.3 project with dependencies', CURRENT_DATE + INTERVAL '3 days', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN users u ON p.user_id = u.id
WHERE u.email = 'test@example.com' AND p.title = 'Task Manager Application'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE project_id = p.id AND title = 'Setup Spring Boot project');

INSERT INTO tasks (project_id, title, description, due_date, is_completed, created_at, updated_at)
SELECT p.id, 'Implement JWT authentication', 'Build JWT token validation', CURRENT_DATE + INTERVAL '7 days', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN users u ON p.user_id = u.id
WHERE u.email = 'test@example.com' AND p.title = 'Task Manager Application'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE project_id = p.id AND title = 'Implement JWT authentication');

INSERT INTO tasks (project_id, title, description, due_date, is_completed, created_at, updated_at)
SELECT p.id, 'Create database schema', 'PostgreSQL schema with migrations', CURRENT_DATE + INTERVAL '5 days', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN users u ON p.user_id = u.id
WHERE u.email = 'test@example.com' AND p.title = 'Task Manager Application'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE project_id = p.id AND title = 'Create database schema');

INSERT INTO tasks (project_id, title, description, due_date, is_completed, created_at, updated_at)
SELECT p.id, 'Build REST API endpoints', 'CRUD operations for projects/tasks', CURRENT_DATE + INTERVAL '10 days', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN users u ON p.user_id = u.id
WHERE u.email = 'test@example.com' AND p.title = 'Task Manager Application'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE project_id = p.id AND title = 'Build REST API endpoints');

INSERT INTO tasks (project_id, title, description, due_date, is_completed, created_at, updated_at)
SELECT p.id, 'Create React frontend', 'Material-UI components with React 19', CURRENT_DATE + INTERVAL '14 days', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN users u ON p.user_id = u.id
WHERE u.email = 'test@example.com' AND p.title = 'Task Manager Application'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE project_id = p.id AND title = 'Create React frontend');

INSERT INTO tasks (project_id, title, description, due_date, is_completed, created_at, updated_at)
SELECT p.id, 'Add animations', 'Implement Framer Motion effects', CURRENT_DATE + INTERVAL '12 days', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN users u ON p.user_id = u.id
WHERE u.email = 'test@example.com' AND p.title = 'Task Manager Application'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE project_id = p.id AND title = 'Add animations');

INSERT INTO tasks (project_id, title, description, due_date, is_completed, created_at, updated_at)
SELECT p.id, 'Setup Docker', 'Containerize backend and frontend', CURRENT_DATE + INTERVAL '21 days', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN users u ON p.user_id = u.id
WHERE u.email = 'test@example.com' AND p.title = 'Task Manager Application'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE project_id = p.id AND title = 'Setup Docker');

INSERT INTO tasks (project_id, title, description, due_date, is_completed, created_at, updated_at)
SELECT p.id, 'Record demo video', 'Create professional 2-minute demo', CURRENT_DATE + INTERVAL '22 days', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN users u ON p.user_id = u.id
WHERE u.email = 'test@example.com' AND p.title = 'Task Manager Application'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE project_id = p.id AND title = 'Record demo video');

-- Tasks for Mobile App Redesign
INSERT INTO tasks (project_id, title, description, due_date, is_completed, created_at, updated_at)
SELECT p.id, 'Research competitors', 'Analyze 5 competitor apps', CURRENT_DATE + INTERVAL '4 days', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN users u ON p.user_id = u.id
WHERE u.email = 'test@example.com' AND p.title = 'Mobile App Redesign'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE project_id = p.id AND title = 'Research competitors');

INSERT INTO tasks (project_id, title, description, due_date, is_completed, created_at, updated_at)
SELECT p.id, 'Create wireframes', 'Design all main screens', CURRENT_DATE + INTERVAL '10 days', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN users u ON p.user_id = u.id
WHERE u.email = 'test@example.com' AND p.title = 'Mobile App Redesign'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE project_id = p.id AND title = 'Create wireframes');

INSERT INTO tasks (project_id, title, description, due_date, is_completed, created_at, updated_at)
SELECT p.id, 'Design UI mockups', 'High-fidelity Figma mockups', CURRENT_DATE + INTERVAL '15 days', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN users u ON p.user_id = u.id
WHERE u.email = 'test@example.com' AND p.title = 'Mobile App Redesign'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE project_id = p.id AND title = 'Design UI mockups');

INSERT INTO tasks (project_id, title, description, due_date, is_completed, created_at, updated_at)
SELECT p.id, 'Client feedback', 'Present designs for review', CURRENT_DATE + INTERVAL '18 days', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN users u ON p.user_id = u.id
WHERE u.email = 'test@example.com' AND p.title = 'Mobile App Redesign'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE project_id = p.id AND title = 'Client feedback');

-- Tasks for Database Migration
INSERT INTO tasks (project_id, title, description, due_date, is_completed, created_at, updated_at)
SELECT p.id, 'Backup legacy DB', 'Full backup of MySQL database', CURRENT_DATE + INTERVAL '2 days', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN users u ON p.user_id = u.id
WHERE u.email = 'test@example.com' AND p.title = 'Database Migration'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE project_id = p.id AND title = 'Backup legacy DB');

INSERT INTO tasks (project_id, title, description, due_date, is_completed, created_at, updated_at)
SELECT p.id, 'Design schema', 'Normalized PostgreSQL schema', CURRENT_DATE + INTERVAL '6 days', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN users u ON p.user_id = u.id
WHERE u.email = 'test@example.com' AND p.title = 'Database Migration'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE project_id = p.id AND title = 'Design schema');

INSERT INTO tasks (project_id, title, description, due_date, is_completed, created_at, updated_at)
SELECT p.id, 'Write migration scripts', 'Python migration automation', CURRENT_DATE + INTERVAL '12 days', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN users u ON p.user_id = u.id
WHERE u.email = 'test@example.com' AND p.title = 'Database Migration'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE project_id = p.id AND title = 'Write migration scripts');

INSERT INTO tasks (project_id, title, description, due_date, is_completed, created_at, updated_at)
SELECT p.id, 'Test integrity', 'Verify data migration success', CURRENT_DATE + INTERVAL '15 days', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN users u ON p.user_id = u.id
WHERE u.email = 'test@example.com' AND p.title = 'Database Migration'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE project_id = p.id AND title = 'Test integrity');
