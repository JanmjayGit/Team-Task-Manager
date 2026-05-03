package com.teamtaskmanager.service;

import com.teamtaskmanager.dto.AuthRequest;
import com.teamtaskmanager.dto.AuthResponse;

public interface AuthService {
    AuthResponse signup(AuthRequest authRequest);

    AuthResponse login(AuthRequest authRequest);
}
