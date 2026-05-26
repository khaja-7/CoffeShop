package com.coffeeshop.repository;

import com.coffeeshop.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA Repository for Product entity.
 * Backed by Supabase PostgreSQL "products" table.
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategoryIgnoreCase(String category);
}
