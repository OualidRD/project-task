package com.example.taskmanager.dtos;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDate dueDate;
    private Boolean isCompleted;
    private Long projectId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
