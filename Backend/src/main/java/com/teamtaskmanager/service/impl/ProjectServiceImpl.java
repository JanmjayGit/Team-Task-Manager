package com.teamtaskmanager.service.impl;

import com.teamtaskmanager.dto.ProjectDTO;
import com.teamtaskmanager.entity.Project;
import com.teamtaskmanager.entity.User;
import com.teamtaskmanager.enums.Role;
import com.teamtaskmanager.exceptions.ResourceNotFoundException;
import com.teamtaskmanager.mapper.ProjectMapper;
import com.teamtaskmanager.repository.ProjectRepository;
import com.teamtaskmanager.repository.UserRepository;
import com.teamtaskmanager.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMapper projectMapper;

    @Override
    @Transactional
    public ProjectDTO createProject(ProjectDTO projectDTO, String creatorEmail) {
        User creator = getUserByEmail(creatorEmail);
        Project project = projectMapper.toEntity(projectDTO, creator);
        project.getMembers().add(creator);
        return projectMapper.toDto(projectRepository.save(project));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectDTO> getProjects(String requesterEmail) {
        User requester = getUserByEmail(requesterEmail);
        List<Project> projects = requester.getRole() == Role.ADMIN
                ? projectRepository.findAll()
                : projectRepository.findDistinctByCreatedBy_IdOrMembers_Id(requester.getId(), requester.getId());

        return projects.stream()
                .map(projectMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProjectDTO addMember(Long projectId, Long userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        User member = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        project.getMembers().add(member);
        return projectMapper.toDto(projectRepository.save(project));
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}
