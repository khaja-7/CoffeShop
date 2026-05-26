package com.coffeeshop.security;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Custom principal object stored in Spring Security context.
 * Carries userId, email and name extracted from the JWT token.
 */
@Getter
@AllArgsConstructor
public class AuthenticatedUser {

    private final Long   id;
    private final String email;
    private final String name;
}
