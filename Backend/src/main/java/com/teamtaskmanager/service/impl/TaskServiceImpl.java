package com.teamtaskmanager.service.impl;

import com.teamtaskmanager.dto.TaskDTO;
import com.teamtaskmanager.entity.Project;
import com.teamtaskmanager.entity.Task;
import com.teamtaskmanager.entity.User;
import com.teamtaskmanager.enums.Role;
import com.teamtaskmanager.enums.TaskStatus;
import com.teamtaskmanager.exceptions.InvalidInputException;
import com.teamtaskmanager.exceptions.ResourceNotFoundException;
import com.teamtaskmanager.mapper.TaskMapper;
import com.teamtaskmanager.repository.ProjectRepository;
import com.teamtaskmanager.repository.TaskRepository;
import com.teamtaskmanager.repository.UserRepository;
import com.teamtaskmanager.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TaskMapper taskMapper;

    @Override
    @Transactional
    public TaskDTO createTask(TaskDTO taskDTO) {
        User assignedTo = userRepository.findById(taskDTO.getAssignedToId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + taskDTO.getAssignedToId()));
        Project project = projectRepository.findById(taskDTO.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + taskDTO.getProjectId()));

        boolean belongsToProject = project.getCreatedBy().getId().equals(assignedTo.getId())
                || project.getMembers().stream().anyMatch(member -> member.getId().equals(assignedTo.getId()));
        if (!belongsToProject) {
            throw new InvalidInputException("Assigned user must be a member of the project");
        }

        Task task = taskMapper.toEntity(taskDTO, assignedTo, project);
        return taskMapper.toDto(taskRepository.save(task));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskDTO> getMyTasks(String requesterEmail) {
        User requester = getUserByEmail(requesterEmail);
        return taskRepository.findByAssignedTo_Id(requester.getId()).stream()
                .map(taskMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TaskDTO updateStatus(Long taskId, TaskStatus status, String requesterEmail) {
        User requester = getUserByEmail(requesterEmail);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        boolean canUpdate = requester.getRole() == Role.ADMIN || task.getAssignedTo().getId().equals(requester.getId());
        if (!canUpdate) {
            throw new InvalidInputException("You can only update tasks assigned to you");
        }

        task.setStatus(status);
        return taskMapper.toDto(taskRepository.save(task));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskDTO> getTasksByProject(Long projectId, String requesterEmail) {
        User requester = getUserByEmail(requesterEmail);
        List<Task> tasks = requester.getRole() == Role.ADMIN
                ? taskRepository.findByProject_Id(projectId)
                : taskRepository.findByProject_IdAndAssignedTo_Id(projectId, requester.getId());

        return tasks.stream()
                .map(taskMapper::toDto)
                .collect(Collectors.toList());
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}
