package com.teamtaskmanager.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(
        name = "projects",
        indexes = {
                @Index(name = "idx_projects_name", columnList = "name"),
                @Index(name = "idx_projects_created_by", columnList = "created_by")
        },
        uniqueConstraints = @UniqueConstraint(name = "uk_projects_name", columnNames = "name")
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Project name cannot be blank")
    @Column(nullable = false, unique = true, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "project_members",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"),
            indexes = {
                    @Index(name = "idx_project_members_project", columnList = "project_id"),
                    @Index(name = "idx_project_members_user", columnList = "user_id")
            }
    )
    @Builder.Default
    private Set<User> members = new HashSet<>();
}
