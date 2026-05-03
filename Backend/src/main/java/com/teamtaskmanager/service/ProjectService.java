package com.teamtaskmanager.service;

import com.teamtaskmanager.dto.ProjectDTO;

import java.util.List;

public interface ProjectService {
    ProjectDTO createProject(ProjectDTO projectDTO, String creatorEmail);

    List<ProjectDTO> getProjects(String requesterEmail);

    ProjectDTO addMember(Long projectId, Long userId);
}
