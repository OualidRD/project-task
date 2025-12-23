-- Insert sample user (password: password123)
-- BCrypt hash generated with cost factor 10 using Spring SecurityConfig BCryptPasswordEncoder
INSERT INTO users (email, password_hash, full_name, created_at, updated_at)
VALUES ('test@example.com', '$2a$10$BnPxV7SK2Fq3uYHukXDpUe76ZwemHN2imSekAl39lUCM0wdXU1sQy', 'Test User', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- Insert sample project
INSERT INTO projects (user_id, title, description, created_at, updated_at)
SELECT id, 'My First Project', 'A sample project to get started', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users WHERE email = 'test@example.com'
AND NOT EXISTS (SELECT 1 FROM projects WHERE title = 'My First Project');

-- Insert sample tasks
INSERT INTO tasks (project_id, title, description, due_date, is_completed, created_at, updated_at)
SELECT p.id, 'Setup environment', 'Configure development environment', CURRENT_DATE + INTERVAL '7 days', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN users u ON p.user_id = u.id WHERE u.email = 'test@example.com' AND p.title = 'My First Project'
AND NOT EXISTS (SELECT 1 FROM tasks t WHERE t.project_id = p.id AND t.title = 'Setup environment');

INSERT INTO tasks (project_id, title, description, due_date, is_completed, created_at, updated_at)
SELECT p.id, 'Implement API endpoints', 'Build RESTful API endpoints', CURRENT_DATE + INTERVAL '14 days', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN users u ON p.user_id = u.id WHERE u.email = 'test@example.com' AND p.title = 'My First Project'
AND NOT EXISTS (SELECT 1 FROM tasks t WHERE t.project_id = p.id AND t.title = 'Implement API endpoints');

INSERT INTO tasks (project_id, title, description, due_date, is_completed, created_at, updated_at)
SELECT p.id, 'Create UI components', 'Build React UI components', CURRENT_DATE + INTERVAL '21 days', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM projects p JOIN users u ON p.user_id = u.id WHERE u.email = 'test@example.com' AND p.title = 'My First Project'
AND NOT EXISTS (SELECT 1 FROM tasks t WHERE t.project_id = p.id AND t.title = 'Create UI components');
