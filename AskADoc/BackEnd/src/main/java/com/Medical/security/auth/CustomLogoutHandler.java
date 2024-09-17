package com.Medical.security.auth;

import com.Medical.security.user.Token;
import com.Medical.security.user.TokenRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomLogoutHandler implements LogoutHandler {

    private final TokenRepository tokenRepository;

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        System.out.println("Authorization header: " + authHeader);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // Extract token
            System.out.println("Extracted token: " + token);
            Token storedToken = tokenRepository.findByToken(token).orElse(null);

            if (storedToken != null) {
                // Token found, invalidate or remove it
                tokenRepository.delete(storedToken); // Example of removing the token
                System.out.println("Token invalidated: " + token);
            } else {
                System.out.println("Token not found: " + token);
            }
        } else {
            System.out.println("Authorization header is missing or does not start with Bearer");
        }
    }

}
