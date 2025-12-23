package com.example.taskmanager.repositories;

import com.example.taskmanager.models.Project;
import com.example.taskmanager.models.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
@DisplayName("ProjectRepository Integration Tests")
class ProjectRepositoryTest {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    private User testUser;
    private Project testProject;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setEmail("test@example.com");
        testUser.setName("Test User");
        testUser.setPassword("hashedpassword");
        testUser = userRepository.save(testUser);

        testProject = new Project();
        testProject.setTitle("Test Project");
        testProject.setDescription("Test Description");
        testProject.setUser(testUser);
        testProject.setCreatedAt(LocalDateTime.now());
        testProject = projectRepository.save(testProject);
    }

    @Test
    @DisplayName("Should save project successfully")
    void testSaveProject() {
        // Arrange
        Project newProject = new Project();
        newProject.setTitle("New Project");
        newProject.setDescription("New Description");
        newProject.setUser(testUser);

        // Act
        Project savedProject = projectRepository.save(newProject);

        // Assert
        assertNotNull(savedProject.getId());
        assertEquals("New Project", savedProject.getTitle());
    }

    @Test
    @DisplayName("Should find project by user ID with pagination")
    void testFindByUserId() {
        // Act
        Page<Project> projects = projectRepository.findByUserId(testUser.getId(), PageRequest.of(0, 10));

        // Assert
        assertNotNull(projects);
        assertTrue(projects.getContent().size() > 0);
        assertEquals(testUser.getId(), projects.getContent().get(0).getUser().getId());
    }

    @Test
    @DisplayName("Should find project by ID and user ID")
    void testFindByIdAndUserId() {
        // Act
        Optional<Project> foundProject = projectRepository.findByIdAndUserId(testProject.getId(), testUser.getId());

        // Assert
        assertTrue(foundProject.isPresent());
        assertEquals(testProject.getId(), foundProject.get().getId());
        assertEquals("Test Project", foundProject.get().getTitle());
    }

    @Test
    @DisplayName("Should return empty when project not found for user")
    void testFindByIdAndUserId_NotFound() {
        // Act
        Optional<Project> foundProject = projectRepository.findByIdAndUserId(999L, testUser.getId());

        // Assert
        assertTrue(foundProject.isEmpty());
    }

    @Test
    @DisplayName("Should delete project successfully")
    void testDeleteProject() {
        // Arrange
        Long projectId = testProject.getId();

        // Act
        projectRepository.delete(testProject);
        Optional<Project> deletedProject = projectRepository.findById(projectId);

        // Assert
        assertTrue(deletedProject.isEmpty());
    }
}
