package com.teamtaskmanager.mapper;

import com.teamtaskmanager.dto.AuthRequest;
import com.teamtaskmanager.dto.UserDTO;
import com.teamtaskmanager.entity.User;
import com.teamtaskmanager.enums.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserMapper {
    private final PasswordEncoder passwordEncoder;

    public User toEntity(AuthRequest authRequest) {
        return User.builder()
                .name(authRequest.getName())
                .email(authRequest.getEmail())
                .password(passwordEncoder.encode(authRequest.getPassword()))
                .role(authRequest.getRole() == null ? Role.MEMBER : authRequest.getRole())
                .build();
    }

    public UserDTO toDto(User user) {
        if (user == null) {
            return null;
        }
        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
