package com.coffeeshop.dto.response;

import com.coffeeshop.entity.Order;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Response DTO for an Order — matches the JSON shape expected by the React frontend.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

    private String message;
    private OrderDto order;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderDto {
        private String id;
        private Long userId;
        private String userName;
        private List<Order.OrderItem> items;
        private Double total;
        private String address;
        private String status;
        private LocalDateTime createdAt;
    }
}
