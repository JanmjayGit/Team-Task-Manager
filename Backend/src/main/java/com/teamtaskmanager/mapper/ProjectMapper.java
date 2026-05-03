package com.teamtaskmanager.mapper;

import com.teamtaskmanager.dto.ProjectDTO;
import com.teamtaskmanager.entity.Project;
import com.teamtaskmanager.entity.User;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.stream.Collectors;

@Component
public class ProjectMapper {

    public Project toEntity(ProjectDTO projectDTO, User createdBy) {
        return Project.builder()
                .name(projectDTO.getName())
                .description(projectDTO.getDescription())
                .createdBy(createdBy)
                .members(new HashSet<>())
                .build();
    }

    public ProjectDTO toDto(Project project) {
        if (project == null) {
            return null;
        }
        return ProjectDTO.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .createdById(project.getCreatedBy().getId())
                .createdByName(project.getCreatedBy().getName())
                .memberIds(project.getMembers().stream().map(User::getId).collect(Collectors.toSet()))
                .build();
    }
}
