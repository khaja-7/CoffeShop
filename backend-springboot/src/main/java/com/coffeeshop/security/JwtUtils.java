package com.coffeeshop.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

/**
 * Utility class for JWT token generation, parsing, and validation.
 */
@Component
public class JwtUtils {

    private static final Logger log = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms}")
    private long jwtExpirationMs;

    // ── Build signing key ───────────────────────────────────
    private SecretKey signingKey() {
        byte[] keyBytes = jwtSecret.getBytes();
        // Pad to 32 bytes if needed for HS256
        if (keyBytes.length < 32) {
            byte[] padded = new byte[32];
            System.arraycopy(keyBytes, 0, padded, 0, keyBytes.length);
            keyBytes = padded;
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // ── Generate token ──────────────────────────────────────
    public String generateToken(Long userId, String email, String name) {
        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("email", email)
                .claim("name", name)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(signingKey())
                .compact();
    }

    // ── Extract user ID from token ──────────────────────────
    public Long getUserIdFromToken(String token) {
        String subject = parseClaims(token).getSubject();
        return Long.parseLong(subject);
    }

    // ── Extract email from token ────────────────────────────
    public String getEmailFromToken(String token) {
        return parseClaims(token).get("email", String.class);
    }

    // ── Extract name from token ─────────────────────────────
    public String getNameFromToken(String token) {
        return parseClaims(token).get("name", String.class);
    }

    // ── Validate token ──────────────────────────────────────
    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.warn("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.warn("JWT token is unsupported: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.warn("JWT token is malformed: {}", e.getMessage());
        } catch (SecurityException e) {
            log.warn("JWT signature validation failed: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }

    // ── Parse claims ────────────────────────────────────────
    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
