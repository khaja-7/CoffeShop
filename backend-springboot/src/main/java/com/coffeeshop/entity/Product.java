package com.coffeeshop.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Product entity mapped to the "products" table in Supabase PostgreSQL
 */
@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Integer rating;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(length = 300)
    private String image;
}
