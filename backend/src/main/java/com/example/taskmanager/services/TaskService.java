package com.example.taskmanager.services;

import com.example.taskmanager.dtos.CreateTaskRequest;
import com.example.taskmanager.dtos.ProgressDTO;
import com.example.taskmanager.dtos.TaskDTO;
import com.example.taskmanager.exceptions.ResourceNotFoundException;
import com.example.taskmanager.models.Project;
import com.example.taskmanager.models.Task;
import com.example.taskmanager.repositories.ProjectRepository;
import com.example.taskmanager.repositories.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

    public TaskDTO createTask(Long projectId, Long userId, CreateTaskRequest request) {
        Project project = projectRepository.findByIdAndUserId(projectId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .dueDate(request.getDueDate())
                .isCompleted(false)
                .project(project)
                .build();

        Task savedTask = taskRepository.save(task);
        return mapToDTO(savedTask);
    }

    @Transactional(readOnly = true)
    public Page<TaskDTO> getProjectTasks(Long projectId, Long userId, Pageable pageable) {
        // Verify project exists and belongs to user
        projectRepository.findByIdAndUserId(projectId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        return taskRepository.findByProjectId(projectId, pageable)
                .map(this::mapToDTO);
    }

    @Transactional(readOnly = true)
    public Page<TaskDTO> searchTasks(Long projectId, Long userId, String searchTerm, Pageable pageable) {
        // Verify project exists and belongs to user
        projectRepository.findByIdAndUserId(projectId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        return taskRepository.searchTasks(projectId, searchTerm, pageable)
                .map(this::mapToDTO);
    }

    @Transactional(readOnly = true)
    public TaskDTO getTaskById(Long taskId, Long projectId, Long userId) {
        projectRepository.findByIdAndUserId(projectId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        Task task = taskRepository.findByIdAndProjectId(taskId, projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        return mapToDTO(task);
    }

    public TaskDTO updateTask(Long taskId, Long projectId, Long userId, CreateTaskRequest request) {
        projectRepository.findByIdAndUserId(projectId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        Task task = taskRepository.findByIdAndProjectId(taskId, projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());

        Task updatedTask = taskRepository.save(task);
        return mapToDTO(updatedTask);
    }

    public TaskDTO completeTask(Long taskId, Long projectId, Long userId) {
        projectRepository.findByIdAndUserId(projectId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        Task task = taskRepository.findByIdAndProjectId(taskId, projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        task.setIsCompleted(true);
        Task updatedTask = taskRepository.save(task);
        return mapToDTO(updatedTask);
    }

    public void deleteTask(Long taskId, Long projectId, Long userId) {
        projectRepository.findByIdAndUserId(projectId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        Task task = taskRepository.findByIdAndProjectId(taskId, projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        taskRepository.delete(task);
    }

    @Transactional(readOnly = true)
    public ProgressDTO getProjectProgress(Long projectId, Long userId) {
        projectRepository.findByIdAndUserId(projectId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        Long totalTasks = taskRepository.countTotalTasks(projectId);
        Long completedTasks = taskRepository.countCompletedTasks(projectId);

        Double progressPercentage = totalTasks > 0 ? (completedTasks.doubleValue() / totalTasks.doubleValue()) * 100 : 0.0;

        return ProgressDTO.builder()
                .totalTasks(totalTasks)
                .completedTasks(completedTasks)
                .progressPercentage(progressPercentage)
                .build();
    }

    private TaskDTO mapToDTO(Task task) {
        return TaskDTO.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .dueDate(task.getDueDate())
                .isCompleted(task.getIsCompleted())
                .projectId(task.getProject().getId())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
