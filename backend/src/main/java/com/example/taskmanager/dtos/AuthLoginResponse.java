package com.example.taskmanager.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthLoginResponse {
    private String token;
    private String tokenType = "Bearer";
    private Long expiresIn;
    private UserDTO user;
}
