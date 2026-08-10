package com.anuj.ems.security;

import com.anuj.ems.entity.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private static final long EXPIRATION_TIME =
            1000 * 60 * 60; // 1 hour

    private final SecretKey key;

    public JwtService(
            @Value("${jwt.secret}") String secret) {

        this.key = Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );
    }

    public SecretKey getKey() {
        return key;
    }

    public String generateToken(User user) {

        Date now = new Date();

        Date expiration =
                new Date(
                        now.getTime()
                                + EXPIRATION_TIME
                );

        return Jwts.builder()
                .subject(user.getEmail())
                .claim(
                        "role",
                        user.getRole().name()
                )
                .claim(
                        "userId",
                        user.getId()
                )
                .issuedAt(now)
                .expiration(expiration)
                .signWith(key)
                .compact();
    }
}