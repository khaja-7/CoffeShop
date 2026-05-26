package com.coffeeshop.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.util.List;

/**
 * Request DTO for placing a new order.
 */
@Data
public class OrderRequest {

    @NotEmpty(message = "Order must contain at least one item")
    @Valid
    private List<OrderItemDto> items;

    @NotNull(message = "Total amount is required")
    @Positive(message = "Total must be a positive number")
    private Double total;

    private String address;

    // ── Nested DTO ────────────────────────────────────────
    @Data
    public static class OrderItemDto {

        @NotNull(message = "Item ID is required")
        private Long id;

        @NotNull(message = "Item name is required")
        private String name;

        @NotNull(message = "Item price is required")
        @Positive(message = "Price must be positive")
        private Double price;

        @NotNull(message = "Quantity is required")
        @Positive(message = "Quantity must be positive")
        private Integer quantity;
    }
}
