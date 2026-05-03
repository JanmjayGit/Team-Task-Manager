package com.teamtaskmanager.repository;

import com.teamtaskmanager.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findDistinctByCreatedBy_IdOrMembers_Id(Long createdById, Long memberId);
}
