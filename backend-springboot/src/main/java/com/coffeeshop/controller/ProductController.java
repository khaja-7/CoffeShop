package com.coffeeshop.controller;

import com.coffeeshop.entity.Product;
import com.coffeeshop.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for product catalog — mirrors /api/products/* Express routes.
 *
 * GET /api/products          → all products (optional ?category=)
 * GET /api/products/{id}     → single product by ID
 */
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // ── GET /api/products?category=Hot Coffee ────────────────
    @GetMapping
    public ResponseEntity<List<Product>> getProducts(
            @RequestParam(required = false) String category) {

        return ResponseEntity.ok(productService.getProducts(category));
    }

    // ── GET /api/products/{id} ───────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }
}
