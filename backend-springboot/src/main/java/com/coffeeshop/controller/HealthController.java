package com.coffeeshop.controller;

import com.coffeeshop.repository.OrderRepository;
import com.coffeeshop.repository.ProductRepository;
import com.coffeeshop.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.stream.Collectors;

/**
 * Health check endpoint — mirrors GET /api/health from Express server.
 */
@RestController
@RequestMapping("/api")
public class HealthController {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public HealthController(UserRepository userRepository,
                            OrderRepository orderRepository,
                            ProductRepository productRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        long userCount = 0;
        long orderCount = 0;
        long productCount = 0;
        String dbStatus = "UP";
        String dbError = null;

        try {
            userCount = userRepository.count();
            orderCount = orderRepository.count();
            productCount = productRepository.count();
        } catch (Exception e) {
            dbStatus = "DOWN";
            dbError = e.getMessage();
        }

        return ResponseEntity.ok(Map.of(
                "status", "ok",
                "message", "Coffee Shop API is running ☕",
                "database", Map.of(
                        "status", dbStatus,
                        "error", dbError != null ? dbError : "none",
                        "usersCount", userCount,
                        "ordersCount", orderCount,
                        "productsCount", productCount,
                        "recentUsers", userRepository.findAll().stream().map(u -> u.getEmail()).limit(5).collect(Collectors.toList())
                )
        ));
    }
}
