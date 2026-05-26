package com.coffeeshop.config;

import com.coffeeshop.security.JwtAuthenticationEntryPoint;
import com.coffeeshop.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Spring Security configuration — stateless JWT, CORS, endpoint authorization.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;

    private final JwtAuthenticationFilter jwtFilter;
    private final JwtAuthenticationEntryPoint entryPoint;

    public SecurityConfig(JwtAuthenticationFilter jwtFilter,
                          JwtAuthenticationEntryPoint entryPoint) {
        this.jwtFilter  = jwtFilter;
        this.entryPoint = entryPoint;
    }

    // ── Security Filter Chain ────────────────────────────────
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF — stateless REST API
            .csrf(AbstractHttpConfigurer::disable)

            // CORS configuration
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // Stateless session — no HTTP session
            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // Custom 401 entry point
            .exceptionHandling(ex ->
                    ex.authenticationEntryPoint(entryPoint))

            // Endpoint authorization rules
            .authorizeHttpRequests(auth -> auth
                    // Public endpoints
                    .requestMatchers(
                            "/api/auth/login",
                            "/api/auth/register",
                            "/api/products",
                            "/api/products/**",
                            "/api/health",
                            "/actuator/**"
                    ).permitAll()
                    // All other endpoints require authentication
                    .anyRequest().authenticated()
            )

            // Add JWT filter before Spring's default auth filter
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // ── CORS ────────────────────────────────────────────────
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Parse comma-separated allowed origins from properties
        List<String> origins = Arrays.asList(allowedOrigins.split(","));
        config.setAllowedOrigins(origins);

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    // ── Password Encoder (BCrypt) ────────────────────────────
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    // ── Authentication Manager ───────────────────────────────
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
