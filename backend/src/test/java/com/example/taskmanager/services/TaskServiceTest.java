package com.example.taskmanager.services;

import com.example.taskmanager.dtos.CreateTaskRequest;
import com.example.taskmanager.dtos.TaskDTO;
import com.example.taskmanager.exceptions.ResourceNotFoundException;
import com.example.taskmanager.models.Project;
import com.example.taskmanager.models.Task;
import com.example.taskmanager.models.User;
import com.example.taskmanager.repositories.ProjectRepository;
import com.example.taskmanager.repositories.TaskRepository;
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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("TaskService Unit Tests")
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private TaskService taskService;

    private User testUser;
    private Project testProject;
    private Task testTask;
    private CreateTaskRequest createTaskRequest;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");

        testProject = new Project();
        testProject.setId(1L);
        testProject.setTitle("Test Project");
        testProject.setUser(testUser);

        testTask = new Task();
        testTask.setId(1L);
        testTask.setTitle("Test Task");
        testTask.setDescription("Test Description");
        testTask.setDueDate(LocalDate.now());
        testTask.setIsCompleted(false);
        testTask.setProject(testProject);
        testTask.setCreatedAt(LocalDateTime.now());

        createTaskRequest = new CreateTaskRequest();
        createTaskRequest.setTitle("New Task");
        createTaskRequest.setDescription("New Description");
        createTaskRequest.setDueDate(LocalDate.now());
    }

    @Test
    @DisplayName("Should create task successfully")
    void testCreateTask_Success() {
        // Arrange
        when(projectRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(testProject));
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        // Act
        TaskDTO result = taskService.createTask(1L, 1L, createTaskRequest);

        // Assert
        assertNotNull(result);
        assertEquals("Test Task", result.getTitle());
        assertEquals("Test Description", result.getDescription());
        verify(projectRepository, times(1)).findByIdAndUserId(1L, 1L);
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    @DisplayName("Should throw exception when project not found for task creation")
    void testCreateTask_ProjectNotFound() {
        // Arrange
        when(projectRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            taskService.createTask(1L, 1L, createTaskRequest);
        });
        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    @DisplayName("Should get project tasks with pagination")
    void testGetProjectTasks_Success() {
        // Arrange
        List<Task> tasks = new ArrayList<>();
        tasks.add(testTask);
        Page<Task> taskPage = new PageImpl<>(tasks, PageRequest.of(0, 10), 1);

        when(projectRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(testProject));
        when(taskRepository.findByProjectId(1L, PageRequest.of(0, 10))).thenReturn(taskPage);

        // Act
        Page<TaskDTO> result = taskService.getProjectTasks(1L, 1L, PageRequest.of(0, 10));

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals("Test Task", result.getContent().get(0).getTitle());
        verify(taskRepository, times(1)).findByProjectId(1L, PageRequest.of(0, 10));
    }

    @Test
    @DisplayName("Should search tasks successfully")
    void testSearchTasks_Success() {
        // Arrange
        List<Task> tasks = new ArrayList<>();
        tasks.add(testTask);
        Page<Task> taskPage = new PageImpl<>(tasks, PageRequest.of(0, 10), 1);

        when(projectRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(testProject));
        when(taskRepository.searchTasks(1L, "Test", PageRequest.of(0, 10))).thenReturn(taskPage);

        // Act
        Page<TaskDTO> result = taskService.searchTasks(1L, 1L, "Test", PageRequest.of(0, 10));

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        verify(taskRepository, times(1)).searchTasks(1L, "Test", PageRequest.of(0, 10));
    }

    @Test
    @DisplayName("Should get task by ID successfully")
    void testGetTaskById_Success() {
        // Arrange
        when(projectRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(testProject));
        when(taskRepository.findByIdAndProjectId(1L, 1L)).thenReturn(Optional.of(testTask));

        // Act
        TaskDTO result = taskService.getTaskById(1L, 1L, 1L);

        // Assert
        assertNotNull(result);
        assertEquals("Test Task", result.getTitle());
        verify(taskRepository, times(1)).findByIdAndProjectId(1L, 1L);
    }

    @Test
    @DisplayName("Should update task successfully")
    void testUpdateTask_Success() {
        // Arrange
        when(projectRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(testProject));
        when(taskRepository.findByIdAndProjectId(1L, 1L)).thenReturn(Optional.of(testTask));
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        CreateTaskRequest updateRequest = new CreateTaskRequest();
        updateRequest.setTitle("Updated Task");
        updateRequest.setDescription("Updated Description");
        updateRequest.setDueDate(LocalDate.now());

        // Act
        TaskDTO result = taskService.updateTask(1L, 1L, 1L, updateRequest);

        // Assert
        assertNotNull(result);
        verify(taskRepository, times(1)).findByIdAndProjectId(1L, 1L);
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    @DisplayName("Should mark task as completed successfully")
    void testMarkTaskCompleted_Success() {
        // Arrange
        when(projectRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(testProject));
        when(taskRepository.findByIdAndProjectId(1L, 1L)).thenReturn(Optional.of(testTask));
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        // Act
        TaskDTO result = taskService.markTaskCompleted(1L, 1L, 1L);

        // Assert
        assertNotNull(result);
        verify(taskRepository, times(1)).findByIdAndProjectId(1L, 1L);
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    @DisplayName("Should delete task successfully")
    void testDeleteTask_Success() {
        // Arrange
        when(projectRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(testProject));
        when(taskRepository.findByIdAndProjectId(1L, 1L)).thenReturn(Optional.of(testTask));
        doNothing().when(taskRepository).delete(testTask);

        // Act
        taskService.deleteTask(1L, 1L, 1L);

        // Assert
        verify(taskRepository, times(1)).findByIdAndProjectId(1L, 1L);
        verify(taskRepository, times(1)).delete(testTask);
    }

    @Test
    @DisplayName("Should throw exception when task not found")
    void testDeleteTask_NotFound() {
        // Arrange
        when(projectRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(testProject));
        when(taskRepository.findByIdAndProjectId(1L, 1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            taskService.deleteTask(1L, 1L, 1L);
        });
        verify(taskRepository, never()).delete(any(Task.class));
    }

    @Test
    @DisplayName("Should calculate project progress correctly")
    void testGetProjectProgress_Success() {
        // Arrange
        List<Task> tasks = new ArrayList<>();
        Task completedTask = new Task();
        completedTask.setIsCompleted(true);
        completedTask.setProject(testProject);

        Task pendingTask = new Task();
        pendingTask.setIsCompleted(false);
        pendingTask.setProject(testProject);

        tasks.add(completedTask);
        tasks.add(pendingTask);

        when(projectRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(testProject));
        when(taskRepository.findByProjectId(1L)).thenReturn(tasks);

        // Act
        var result = taskService.getProjectProgress(1L, 1L);

        // Assert
        assertNotNull(result);
        assertEquals(50, result.getProgress());
        assertEquals(1, result.getCompletedCount());
        assertEquals(2, result.getTotalCount());
    }
}
