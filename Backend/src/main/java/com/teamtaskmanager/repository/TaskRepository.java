package com.teamtaskmanager.repository;

import com.teamtaskmanager.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedTo_Id(Long userId);

    List<Task> findByProject_Id(Long projectId);

    List<Task> findByProject_IdAndAssignedTo_Id(Long projectId, Long userId);
}
