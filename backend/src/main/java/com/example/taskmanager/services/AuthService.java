package com.example.taskmanager.services;

import com.example.taskmanager.dtos.AuthLoginRequest;
import com.example.taskmanager.dtos.AuthLoginResponse;
import com.example.taskmanager.dtos.AuthRegisterRequest;
import com.example.taskmanager.dtos.UserDTO;
import com.example.taskmanager.exceptions.ResourceNotFoundException;
import com.example.taskmanager.exceptions.UnauthorizedException;
import com.example.taskmanager.models.User;
import com.example.taskmanager.repositories.UserRepository;
import com.example.taskmanager.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthLoginResponse login(AuthLoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail());
        Long expirationTime = jwtTokenProvider.getExpirationTime();

        UserDTO userDTO = UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .createdAt(user.getCreatedAt())
                .build();

        return AuthLoginResponse.builder()
                .token(token)
                .expiresIn(expirationTime)
                .user(userDTO)
                .build();
    }

    public User getCurrentUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    public AuthLoginResponse register(AuthRegisterRequest request) {
        // Check if passwords match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Passwords do not match");
        }

        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        // Create new user
        User user = User.builder()
                .email(request.getEmail())
                .fullName(request.getFullName())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .build();

        User savedUser = userRepository.save(user);

        // Generate token for the new user
        String token = jwtTokenProvider.generateToken(savedUser.getId(), savedUser.getEmail());
        Long expirationTime = jwtTokenProvider.getExpirationTime();

        UserDTO userDTO = UserDTO.builder()
                .id(savedUser.getId())
                .email(savedUser.getEmail())
                .fullName(savedUser.getFullName())
                .createdAt(savedUser.getCreatedAt())
                .build();

        return AuthLoginResponse.builder()
                .token(token)
                .expiresIn(expirationTime)
                .user(userDTO)
                .build();
    }
}
