package com.teamtaskmanager.controller;

import com.teamtaskmanager.dto.TaskDTO;
import com.teamtaskmanager.dto.TaskStatusRequest;
import com.teamtaskmanager.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TaskDTO> createTask(@Valid @RequestBody TaskDTO taskDTO) {
        return ResponseEntity.ok(taskService.createTask(taskDTO));
    }

    @GetMapping("/my")
    public ResponseEntity<List<TaskDTO>> getMyTasks(Authentication authentication) {
        return ResponseEntity.ok(taskService.getMyTasks(authentication.getName()));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<TaskDTO> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody TaskStatusRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(taskService.updateStatus(id, request.getStatus(), authentication.getName()));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<TaskDTO>> getTasksByProject(@PathVariable Long projectId, Authentication authentication) {
        return ResponseEntity.ok(taskService.getTasksByProject(projectId, authentication.getName()));
    }
}
