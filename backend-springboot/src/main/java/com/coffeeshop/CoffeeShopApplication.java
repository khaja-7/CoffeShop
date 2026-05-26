package com.coffeeshop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Coffee Shop API - Main Application Entry Point
 * Spring Boot 3.x + Supabase PostgreSQL + JWT Security
 */
@SpringBootApplication
@EnableJpaAuditing
public class CoffeeShopApplication {

    public static void main(String[] args) {
        SpringApplication.run(CoffeeShopApplication.class, args);
        System.out.println("""
                ☕ ═══════════════════════════════════════════
                   Coffee Shop API is running!
                   → http://localhost:5000
                   → Health: http://localhost:5000/actuator/health
                ═══════════════════════════════════════════ ☕
                """);
    }
}
