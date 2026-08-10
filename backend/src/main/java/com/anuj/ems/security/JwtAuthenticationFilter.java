package com.anuj.ems.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final SecretKey key;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.key = jwtService.getKey();
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader =
                request.getHeader("Authorization");

        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        String token =
                authHeader.substring(7);

        try {

            Claims claims =
                    Jwts.parser()
                            .verifyWith(key)
                            .build()
                            .parseSignedClaims(token)
                            .getPayload();

            String email =
                    claims.getSubject();

            String role =
                    claims.get(
                            "role",
                            String.class
                    );

            if (email != null &&
                    role != null &&
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication() == null) {

                List<SimpleGrantedAuthority>
                        authorities =
                        List.of(
                                new SimpleGrantedAuthority(
                                        "ROLE_" + role
                                )
                        );

                UsernamePasswordAuthenticationToken
                        authentication =
                        new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                authorities
                        );

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(
                                authentication
                        );
            }

        } catch (Exception exception) {

            /*
             * Invalid or expired JWT.
             *
             * Continue without authentication.
             * Spring Security will reject protected
             * endpoints if authentication is required.
             */

        }

        filterChain.doFilter(
                request,
                response
        );
    }
}