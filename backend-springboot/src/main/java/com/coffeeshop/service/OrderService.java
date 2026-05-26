package com.coffeeshop.service;

import com.coffeeshop.dto.request.OrderRequest;
import com.coffeeshop.dto.response.OrderResponse;
import com.coffeeshop.entity.Order;
import com.coffeeshop.repository.OrderRepository;
import com.coffeeshop.security.AuthenticatedUser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Business logic for order placement and retrieval.
 */
@Service
public class OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // ── Place a new order ────────────────────────────────────
    @Transactional
    public OrderResponse placeOrder(OrderRequest request, AuthenticatedUser currentUser) {
        // Build order ID — mirrors Express ORD-<timestamp> pattern
        String orderId = "ORD-" + System.currentTimeMillis();

        // Map request items → entity items
        List<Order.OrderItem> orderItems = request.getItems().stream()
                .map(dto -> Order.OrderItem.builder()
                        .id(dto.getId())
                        .name(dto.getName())
                        .price(dto.getPrice())
                        .quantity(dto.getQuantity())
                        .build())
                .toList();

        Order order = Order.builder()
                .id(orderId)
                .userId(currentUser.getId())
                .userName(currentUser.getName())
                .items(orderItems)
                .total(request.getTotal())
                .address(request.getAddress() != null ? request.getAddress() : "Not provided")
                .status("Confirmed")
                .build();

        order = orderRepository.save(order);
        log.info("Order placed: {} for user {}", orderId, currentUser.getEmail());

        return OrderResponse.builder()
                .message("Order placed successfully!")
                .order(mapToOrderDto(order))
                .build();
    }

    // ── Get orders for the authenticated user ────────────────
    @Transactional(readOnly = true)
    public List<OrderResponse.OrderDto> getUserOrders(AuthenticatedUser currentUser) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId())
                .stream()
                .map(this::mapToOrderDto)
                .toList();
    }

    // ── Helper ───────────────────────────────────────────────
    private OrderResponse.OrderDto mapToOrderDto(Order order) {
        return OrderResponse.OrderDto.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .userName(order.getUserName())
                .items(order.getItems())
                .total(order.getTotal())
                .address(order.getAddress())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .build();
    }
}
