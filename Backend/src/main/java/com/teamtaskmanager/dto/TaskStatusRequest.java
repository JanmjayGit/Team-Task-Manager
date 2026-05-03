package com.teamtaskmanager.dto;

import com.teamtaskmanager.enums.TaskStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TaskStatusRequest {
    @NotNull(message = "Status is required")
    private TaskStatus status;
}
