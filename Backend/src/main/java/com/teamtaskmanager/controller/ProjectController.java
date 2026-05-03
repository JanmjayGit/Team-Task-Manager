package com.teamtaskmanager.controller;

import com.teamtaskmanager.dto.ProjectDTO;
import com.teamtaskmanager.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProjectDTO> createProject(@Valid @RequestBody ProjectDTO projectDTO, Authentication authentication) {
        return ResponseEntity.ok(projectService.createProject(projectDTO, authentication.getName()));
    }

    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getProjects(Authentication authentication) {
        return ResponseEntity.ok(projectService.getProjects(authentication.getName()));
    }

    @PostMapping("/{id}/add-member")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProjectDTO> addMember(@PathVariable Long id, @RequestParam Long userId) {
        return ResponseEntity.ok(projectService.addMember(id, userId));
    }
}
