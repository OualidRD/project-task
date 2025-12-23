package com.example.taskmanager.services;

import com.example.taskmanager.dtos.CreateProjectRequest;
import com.example.taskmanager.dtos.ProjectDTO;
import com.example.taskmanager.exceptions.ResourceNotFoundException;
import com.example.taskmanager.models.Project;
import com.example.taskmanager.models.User;
import com.example.taskmanager.repositories.ProjectRepository;
import com.example.taskmanager.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectDTO createProject(Long userId, CreateProjectRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Project project = Project.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .user(user)
                .build();

        Project savedProject = projectRepository.save(project);
        return mapToDTO(savedProject);
    }

    @Transactional(readOnly = true)
    public Page<ProjectDTO> getUserProjects(Long userId, Pageable pageable) {
        Page<Project> projects = projectRepository.findByUserId(userId, pageable);
        return projects.map(this::mapToDTO);
    }

    @Transactional(readOnly = true)
    public ProjectDTO getProjectById(Long projectId, Long userId) {
        Project project = projectRepository.findByIdAndUserId(projectId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        return mapToDTO(project);
    }

    public ProjectDTO updateProject(Long projectId, Long userId, CreateProjectRequest request) {
        Project project = projectRepository.findByIdAndUserId(projectId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());

        Project updatedProject = projectRepository.save(project);
        return mapToDTO(updatedProject);
    }

    public void deleteProject(Long projectId, Long userId) {
        Project project = projectRepository.findByIdAndUserId(projectId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        projectRepository.delete(project);
    }

    private ProjectDTO mapToDTO(Project project) {
        return ProjectDTO.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .userId(project.getUser().getId())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }
}
