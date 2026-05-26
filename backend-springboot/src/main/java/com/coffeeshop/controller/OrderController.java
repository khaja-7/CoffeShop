package com.coffeeshop.controller;

import com.coffeeshop.dto.request.OrderRequest;
import com.coffeeshop.dto.response.OrderResponse;
import com.coffeeshop.security.AuthenticatedUser;
import com.coffeeshop.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for orders — mirrors /api/orders/* Express routes.
 *
 * POST /api/orders   → place a new order (requires JWT)
 * GET  /api/orders   → get current user's orders (requires JWT)
 */
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // ── POST /api/orders ─────────────────────────────────────
    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(
            @Valid @RequestBody OrderRequest request,
            @AuthenticationPrincipal AuthenticatedUser currentUser) {

        OrderResponse response = orderService.placeOrder(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ── GET /api/orders ──────────────────────────────────────
    @GetMapping
    public ResponseEntity<List<OrderResponse.OrderDto>> getUserOrders(
            @AuthenticationPrincipal AuthenticatedUser currentUser) {

        return ResponseEntity.ok(orderService.getUserOrders(currentUser));
    }
}
