package com.example.taskmanager.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressDTO {
    private Long totalTasks;
    private Long completedTasks;
    private Double progressPercentage;
}
