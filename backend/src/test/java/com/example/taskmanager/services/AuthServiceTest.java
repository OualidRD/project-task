package com.example.taskmanager.services;

import com.example.taskmanager.dtos.AuthLoginRequest;
import com.example.taskmanager.dtos.AuthLoginResponse;
import com.example.taskmanager.dtos.AuthSignUpRequest;
import com.example.taskmanager.exceptions.UnauthorizedException;
import com.example.taskmanager.models.User;
import com.example.taskmanager.repositories.UserRepository;
import com.example.taskmanager.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Unit Tests")
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private User testUser;
    private AuthLoginRequest loginRequest;
    private AuthSignUpRequest signUpRequest;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setName("Test User");
        testUser.setPassword("$2a$10$hashedpassword");

        loginRequest = new AuthLoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password123");

        signUpRequest = new AuthSignUpRequest();
        signUpRequest.setEmail("newuser@example.com");
        signUpRequest.setName("New User");
        signUpRequest.setPassword("password123");
    }

    @Test
    @DisplayName("Should login user successfully")
    void testLogin_Success() {
        // Arrange
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", testUser.getPassword())).thenReturn(true);
        when(jwtTokenProvider.generateToken(1L)).thenReturn("jwt-token");

        // Act
        AuthLoginResponse response = authService.login(loginRequest);

        // Assert
        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        assertEquals(testUser.getEmail(), response.getEmail());
        verify(userRepository, times(1)).findByEmail("test@example.com");
        verify(passwordEncoder, times(1)).matches("password123", testUser.getPassword());
    }

    @Test
    @DisplayName("Should throw exception for invalid credentials")
    void testLogin_InvalidCredentials() {
        // Arrange
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongpassword", testUser.getPassword())).thenReturn(false);

        // Act
        AuthLoginRequest invalidRequest = new AuthLoginRequest();
        invalidRequest.setEmail("test@example.com");
        invalidRequest.setPassword("wrongpassword");

        // Assert
        assertThrows(UnauthorizedException.class, () -> {
            authService.login(invalidRequest);
        });
    }

    @Test
    @DisplayName("Should throw exception when user not found")
    void testLogin_UserNotFound() {
        // Arrange
        when(userRepository.findByEmail("notfound@example.com")).thenReturn(Optional.empty());

        // Act
        AuthLoginRequest notFoundRequest = new AuthLoginRequest();
        notFoundRequest.setEmail("notfound@example.com");
        notFoundRequest.setPassword("password123");

        // Assert
        assertThrows(UnauthorizedException.class, () -> {
            authService.login(notFoundRequest);
        });
    }

    @Test
    @DisplayName("Should signup user successfully")
    void testSignUp_Success() {
        // Arrange
        when(userRepository.findByEmail(signUpRequest.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(signUpRequest.getPassword())).thenReturn("$2a$10$hashedpassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtTokenProvider.generateToken(1L)).thenReturn("jwt-token");

        // Act
        AuthLoginResponse response = authService.signUp(signUpRequest);

        // Assert
        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        verify(userRepository, times(1)).findByEmail(signUpRequest.getEmail());
        verify(passwordEncoder, times(1)).encode(signUpRequest.getPassword());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw exception when user already exists")
    void testSignUp_UserAlreadyExists() {
        // Arrange
        when(userRepository.findByEmail(signUpRequest.getEmail())).thenReturn(Optional.of(testUser));

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            authService.signUp(signUpRequest);
        });
        verify(userRepository, never()).save(any(User.class));
    }
}
