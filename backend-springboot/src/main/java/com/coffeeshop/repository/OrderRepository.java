package com.coffeeshop.repository;

import com.coffeeshop.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA Repository for Order entity.
 * Backed by Supabase PostgreSQL "orders" table.
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, String> {

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
}
