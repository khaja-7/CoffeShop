package com.coffeeshop.service;

import com.coffeeshop.entity.Product;
import com.coffeeshop.exception.NotFoundException;
import com.coffeeshop.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Business logic for product catalog.
 */
@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // ── Get all products, optionally filtered by category ───
    @Transactional(readOnly = true)
    public List<Product> getProducts(String category) {
        if (category != null && !category.isBlank()) {
            return productRepository.findByCategoryIgnoreCase(category);
        }
        return productRepository.findAll();
    }

    // ── Get single product by ID ─────────────────────────────
    @Transactional(readOnly = true)
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found."));
    }
}
