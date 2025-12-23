package com.example.taskmanager.controllers;

import com.example.taskmanager.dtos.CreateTaskRequest;
import com.example.taskmanager.dtos.ProgressDTO;
import com.example.taskmanager.dtos.TaskDTO;
import com.example.taskmanager.services.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/projects/{projectId}/tasks")
@RequiredArgsConstructor
@Tag(name = "Tasks", description = "Task management endpoints")
@SecurityRequirement(name = "Bearer Authentication")
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    @Operation(summary = "Create task", description = "Create a new task in a project")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Task created successfully",
                    content = @Content(schema = @Schema(implementation = TaskDTO.class))),
            @ApiResponse(responseCode = "400", description = "Validation error"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Project not found")
    })
    public ResponseEntity<TaskDTO> createTask(
            @PathVariable Long projectId,
            @Valid @RequestBody CreateTaskRequest request,
            Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        TaskDTO task = taskService.createTask(projectId, userId, request);
        return new ResponseEntity<>(task, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get project tasks", description = "Retrieve paginated list of tasks in a project")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tasks retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Project not found")
    })
    public ResponseEntity<Page<TaskDTO>> getProjectTasks(
            @PathVariable Long projectId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        Pageable pageable = PageRequest.of(page, size);
        Page<TaskDTO> tasks = taskService.getProjectTasks(projectId, userId, pageable);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/search")
    @Operation(summary = "Search tasks", description = "Search tasks in a project by title or description")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Search results retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Project not found")
    })
    public ResponseEntity<Page<TaskDTO>> searchTasks(
            @PathVariable Long projectId,
            @RequestParam String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        Pageable pageable = PageRequest.of(page, size);
        Page<TaskDTO> tasks = taskService.searchTasks(projectId, userId, searchTerm, pageable);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{taskId}")
    @Operation(summary = "Get task", description = "Retrieve a specific task by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Task retrieved successfully",
                    content = @Content(schema = @Schema(implementation = TaskDTO.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Task or project not found")
    })
    public ResponseEntity<TaskDTO> getTaskById(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        TaskDTO task = taskService.getTaskById(taskId, projectId, userId);
        return ResponseEntity.ok(task);
    }

    @PutMapping("/{taskId}")
    @Operation(summary = "Update task", description = "Update an existing task")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Task updated successfully",
                    content = @Content(schema = @Schema(implementation = TaskDTO.class))),
            @ApiResponse(responseCode = "400", description = "Validation error"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Task or project not found")
    })
    public ResponseEntity<TaskDTO> updateTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @Valid @RequestBody CreateTaskRequest request,
            Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        TaskDTO task = taskService.updateTask(taskId, projectId, userId, request);
        return ResponseEntity.ok(task);
    }

    @PutMapping("/{taskId}/complete")
    @Operation(summary = "Complete task", description = "Mark a task as completed")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Task completed successfully",
                    content = @Content(schema = @Schema(implementation = TaskDTO.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Task or project not found")
    })
    public ResponseEntity<TaskDTO> completeTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        TaskDTO task = taskService.completeTask(taskId, projectId, userId);
        return ResponseEntity.ok(task);
    }

    @DeleteMapping("/{taskId}")
    @Operation(summary = "Delete task", description = "Delete a task")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Task deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Task or project not found")
    })
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        taskService.deleteTask(taskId, projectId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/progress")
    @Operation(summary = "Get project progress", description = "Get progress statistics for a project")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Progress retrieved successfully",
                    content = @Content(schema = @Schema(implementation = ProgressDTO.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Project not found")
    })
    public ResponseEntity<ProgressDTO> getProjectProgress(
            @PathVariable Long projectId,
            Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        ProgressDTO progress = taskService.getProjectProgress(projectId, userId);
        return ResponseEntity.ok(progress);
    }
}
