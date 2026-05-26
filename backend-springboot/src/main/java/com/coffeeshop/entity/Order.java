package com.coffeeshop.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Order entity mapped to the "orders" table in Supabase PostgreSQL.
 * OrderItems are stored as JSON (JSONB in PostgreSQL) via a converter.
 */
@Entity
@Table(name = "orders")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @Column(length = 50)
    private String id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "user_name", nullable = false, length = 100)
    private String userName;

    /**
     * Stores order items as a JSON array in PostgreSQL.
     * Converted via OrderItemListConverter.
     */
    @Column(columnDefinition = "TEXT", nullable = false)
    @Convert(converter = com.coffeeshop.converter.OrderItemListConverter.class)
    private List<OrderItem> items;

    @Column(nullable = false)
    private Double total;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String status = "Confirmed";

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // ── Embedded OrderItem value object ────────────────────
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderItem {
        private Long id;
        private String name;
        private Double price;
        private Integer quantity;
    }
}
