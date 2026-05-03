package com.teamtaskmanager.dto;

import com.teamtaskmanager.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {
    private Long id;

    @NotBlank(message = "Task title is required")
    private String title;

    private String description;

    @Builder.Default
    private TaskStatus status = TaskStatus.TODO;

    private LocalDate dueDate;

    @NotNull(message = "Assigned user id is required")
    private Long assignedToId;

    private String assignedToName;

    @NotNull(message = "Project id is required")
    private Long projectId;

    private String projectName;
}
