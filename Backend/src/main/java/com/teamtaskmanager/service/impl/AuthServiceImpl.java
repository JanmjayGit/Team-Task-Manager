package com.teamtaskmanager.service.impl;

import com.teamtaskmanager.dto.AuthRequest;
import com.teamtaskmanager.dto.AuthResponse;
import com.teamtaskmanager.entity.User;
import com.teamtaskmanager.exceptions.InvalidInputException;
import com.teamtaskmanager.mapper.UserMapper;
import com.teamtaskmanager.repository.UserRepository;
import com.teamtaskmanager.security.JwtUtils;
import com.teamtaskmanager.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final JwtUtils jwtUtils;

    @Override
    public AuthResponse signup(AuthRequest authRequest) {
        if (userRepository.existsByEmail(authRequest.getEmail())) {
            throw new InvalidInputException("Email is already registered");
        }

        User user = userRepository.save(userMapper.toEntity(authRequest));
        String token = jwtUtils.generateJwtToken(user.getEmail(), user.getRole().name());
        return buildResponse(user, token);
    }

    @Override
    public AuthResponse login(AuthRequest authRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
        );
        User user = userRepository.findByEmail(authRequest.getEmail())
                .orElseThrow(() -> new InvalidInputException("Invalid email or password"));
        String token = jwtUtils.generateJwtToken(user.getEmail(), user.getRole().name());
        return buildResponse(user, token);
    }

    private AuthResponse buildResponse(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
