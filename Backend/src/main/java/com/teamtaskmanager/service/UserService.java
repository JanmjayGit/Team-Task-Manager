package com.teamtaskmanager.service;

import com.teamtaskmanager.dto.UserDTO;
import com.teamtaskmanager.entity.User;

import java.util.List;

public interface UserService {
    List<UserDTO> findAll();

    User getEntityById(Long id);

    User getEntityByEmail(String email);
}
