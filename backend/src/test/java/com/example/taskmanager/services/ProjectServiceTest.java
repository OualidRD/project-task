package com.example.taskmanager.services;

import com.example.taskmanager.dtos.CreateProjectRequest;
import com.example.taskmanager.dtos.ProjectDTO;
import com.example.taskmanager.exceptions.ResourceNotFoundException;
import com.example.taskmanager.models.Project;
import com.example.taskmanager.models.User;
import com.example.taskmanager.repositories.ProjectRepository;
import com.example.taskmanager.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ProjectService Unit Tests")
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ProjectService projectService;

    private User testUser;
    private Project testProject;
    private CreateProjectRequest createProjectRequest;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setName("Test User");

        testProject = new Project();
        testProject.setId(1L);
        testProject.setTitle("Test Project");
        testProject.setDescription("Test Description");
        testProject.setUser(testUser);
        testProject.setCreatedAt(LocalDateTime.now());

        createProjectRequest = new CreateProjectRequest();
        createProjectRequest.setTitle("New Project");
        createProjectRequest.setDescription("New Description");
    }

    @Test
    @DisplayName("Should create project successfully")
    void testCreateProject_Success() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(projectRepository.save(any(Project.class))).thenReturn(testProject);

        // Act
        ProjectDTO result = projectService.createProject(1L, createProjectRequest);

        // Assert
        assertNotNull(result);
        assertEquals("Test Project", result.getTitle());
        assertEquals("Test Description", result.getDescription());
        verify(userRepository, times(1)).findById(1L);
        verify(projectRepository, times(1)).save(any(Project.class));
    }

    @Test
    @DisplayName("Should throw exception when user not found")
    void testCreateProject_UserNotFound() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            projectService.createProject(1L, createProjectRequest);
        });
        verify(projectRepository, never()).save(any(Project.class));
    }

    @Test
    @DisplayName("Should get user projects with pagination")
    void testGetUserProjects_Success() {
        // Arrange
        List<Project> projects = new ArrayList<>();
        projects.add(testProject);
        Page<Project> projectPage = new PageImpl<>(projects, PageRequest.of(0, 10), 1);

        when(projectRepository.findByUserId(1L, PageRequest.of(0, 10))).thenReturn(projectPage);

        // Act
        Page<ProjectDTO> result = projectService.getUserProjects(1L, PageRequest.of(0, 10));

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals("Test Project", result.getContent().get(0).getTitle());
        verify(projectRepository, times(1)).findByUserId(1L, PageRequest.of(0, 10));
    }

    @Test
    @DisplayName("Should get project by ID successfully")
    void testGetProjectById_Success() {
        // Arrange
        when(projectRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(testProject));

        // Act
        ProjectDTO result = projectService.getProjectById(1L, 1L);

        // Assert
        assertNotNull(result);
        assertEquals("Test Project", result.getTitle());
        verify(projectRepository, times(1)).findByIdAndUserId(1L, 1L);
    }

    @Test
    @DisplayName("Should throw exception when project not found")
    void testGetProjectById_NotFound() {
        // Arrange
        when(projectRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            projectService.getProjectById(1L, 1L);
        });
    }

    @Test
    @DisplayName("Should update project successfully")
    void testUpdateProject_Success() {
        // Arrange
        when(projectRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(testProject));
        when(projectRepository.save(any(Project.class))).thenReturn(testProject);

        CreateProjectRequest updateRequest = new CreateProjectRequest();
        updateRequest.setTitle("Updated Project");
        updateRequest.setDescription("Updated Description");

        // Act
        ProjectDTO result = projectService.updateProject(1L, 1L, updateRequest);

        // Assert
        assertNotNull(result);
        verify(projectRepository, times(1)).findByIdAndUserId(1L, 1L);
        verify(projectRepository, times(1)).save(any(Project.class));
    }

    @Test
    @DisplayName("Should delete project successfully")
    void testDeleteProject_Success() {
        // Arrange
        when(projectRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(testProject));
        doNothing().when(projectRepository).delete(testProject);

        // Act
        projectService.deleteProject(1L, 1L);

        // Assert
        verify(projectRepository, times(1)).findByIdAndUserId(1L, 1L);
        verify(projectRepository, times(1)).delete(testProject);
    }

    @Test
    @DisplayName("Should throw exception when deleting non-existent project")
    void testDeleteProject_NotFound() {
        // Arrange
        when(projectRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            projectService.deleteProject(1L, 1L);
        });
        verify(projectRepository, never()).delete(any(Project.class));
    }
}
