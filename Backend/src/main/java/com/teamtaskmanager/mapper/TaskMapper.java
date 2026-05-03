package com.teamtaskmanager.mapper;

import com.teamtaskmanager.dto.TaskDTO;
import com.teamtaskmanager.entity.Project;
import com.teamtaskmanager.entity.Task;
import com.teamtaskmanager.entity.User;
import com.teamtaskmanager.enums.TaskStatus;
import org.springframework.stereotype.Component;

@Component
public class TaskMapper {

    public Task toEntity(TaskDTO taskDTO, User assignedTo, Project project) {
        return Task.builder()
                .title(taskDTO.getTitle())
                .description(taskDTO.getDescription())
                .status(taskDTO.getStatus() == null ? TaskStatus.TODO : taskDTO.getStatus())
                .dueDate(taskDTO.getDueDate())
                .assignedTo(assignedTo)
                .project(project)
                .build();
    }

    public TaskDTO toDto(Task task) {
        if (task == null) {
            return null;
        }
        return TaskDTO.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .dueDate(task.getDueDate())
                .assignedToId(task.getAssignedTo().getId())
                .assignedToName(task.getAssignedTo().getName())
                .projectId(task.getProject().getId())
                .projectName(task.getProject().getName())
                .build();
    }
}
