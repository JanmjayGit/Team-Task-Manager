package com.teamtaskmanager.service;

import com.teamtaskmanager.dto.TaskDTO;
import com.teamtaskmanager.enums.TaskStatus;

import java.util.List;

public interface TaskService {
    TaskDTO createTask(TaskDTO taskDTO);

    List<TaskDTO> getMyTasks(String requesterEmail);

    TaskDTO updateStatus(Long taskId, TaskStatus status, String requesterEmail);

    List<TaskDTO> getTasksByProject(Long projectId, String requesterEmail);
}
