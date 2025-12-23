package com.example.taskmanager.controllers;

import com.example.taskmanager.dtos.CreateProjectRequest;
import com.example.taskmanager.dtos.ProjectDTO;
import com.example.taskmanager.services.ProjectService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("ProjectController Integration Tests")
class ProjectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProjectService projectService;

    @Autowired
    private ObjectMapper objectMapper;

    private ProjectDTO testProjectDTO;
    private CreateProjectRequest createProjectRequest;

    @BeforeEach
    void setUp() {
        testProjectDTO = new ProjectDTO();
        testProjectDTO.setId(1L);
        testProjectDTO.setTitle("Test Project");
        testProjectDTO.setDescription("Test Description");
        testProjectDTO.setCreatedAt(LocalDateTime.now());

        createProjectRequest = new CreateProjectRequest();
        createProjectRequest.setTitle("New Project");
        createProjectRequest.setDescription("New Description");
    }

    @Test
    @DisplayName("Should create project - POST /api/projects")
    void testCreateProject() throws Exception {
        // Arrange
        when(projectService.createProject(eq(1L), any(CreateProjectRequest.class)))
                .thenReturn(testProjectDTO);

        // Act & Assert
        mockMvc.perform(post("/api/projects")
                .header("Authorization", "Bearer token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createProjectRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Test Project"));
    }

    @Test
    @DisplayName("Should get user projects - GET /api/projects")
    void testGetUserProjects() throws Exception {
        // Arrange
        List<ProjectDTO> projects = new ArrayList<>();
        projects.add(testProjectDTO);
        Page<ProjectDTO> projectPage = new PageImpl<>(projects, PageRequest.of(0, 10), 1);

        when(projectService.getUserProjects(eq(1L), any(PageRequest.class)))
                .thenReturn(projectPage);

        // Act & Assert
        mockMvc.perform(get("/api/projects")
                .header("Authorization", "Bearer token")
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1))
                .andExpect(jsonPath("$.content[0].title").value("Test Project"));
    }

    @Test
    @DisplayName("Should get project by ID - GET /api/projects/{id}")
    void testGetProjectById() throws Exception {
        // Arrange
        when(projectService.getProjectById(1L, 1L))
                .thenReturn(testProjectDTO);

        // Act & Assert
        mockMvc.perform(get("/api/projects/1")
                .header("Authorization", "Bearer token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Test Project"));
    }

    @Test
    @DisplayName("Should update project - PUT /api/projects/{id}")
    void testUpdateProject() throws Exception {
        // Arrange
        ProjectDTO updatedProjectDTO = new ProjectDTO();
        updatedProjectDTO.setId(1L);
        updatedProjectDTO.setTitle("Updated Project");
        updatedProjectDTO.setDescription("Updated Description");

        when(projectService.updateProject(eq(1L), eq(1L), any(CreateProjectRequest.class)))
                .thenReturn(updatedProjectDTO);

        CreateProjectRequest updateRequest = new CreateProjectRequest();
        updateRequest.setTitle("Updated Project");
        updateRequest.setDescription("Updated Description");

        // Act & Assert
        mockMvc.perform(put("/api/projects/1")
                .header("Authorization", "Bearer token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Project"));
    }

    @Test
    @DisplayName("Should delete project - DELETE /api/projects/{id}")
    void testDeleteProject() throws Exception {
        // Arrange
        doNothing().when(projectService).deleteProject(1L, 1L);

        // Act & Assert
        mockMvc.perform(delete("/api/projects/1")
                .header("Authorization", "Bearer token"))
                .andExpect(status().isNoContent());
    }
}
