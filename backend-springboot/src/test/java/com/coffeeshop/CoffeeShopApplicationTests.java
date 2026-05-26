package com.coffeeshop;

import com.coffeeshop.repository.ProductRepository;
import com.coffeeshop.repository.UserRepository;
import com.coffeeshop.repository.OrderRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.assertj.core.api.Assertions.*;

/**
 * Integration tests for Coffee Shop API.
 * These tests run against the real Supabase database (use a test DB in CI).
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class CoffeeShopApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    // ── Context Loads ────────────────────────────────────────
    @Test
    @DisplayName("Spring application context loads successfully")
    void contextLoads() {
        assertThat(productRepository).isNotNull();
        assertThat(userRepository).isNotNull();
        assertThat(orderRepository).isNotNull();
    }

    // ── Health Endpoint ──────────────────────────────────────
    @Test
    @DisplayName("GET /api/health returns 200 OK with status ok")
    void healthEndpointReturnsOk() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ok"))
                .andExpect(jsonPath("$.message").exists());
    }

    // ── Products Endpoint ────────────────────────────────────
    @Test
    @DisplayName("GET /api/products returns product list (public)")
    void getProductsReturnsPublicList() throws Exception {
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    // ── Auth — Register Validation ───────────────────────────
    @Test
    @DisplayName("POST /api/auth/register with empty body returns 400")
    void registerWithEmptyBodyReturnsBadRequest() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").exists());
    }

    // ── Auth — Login Validation ──────────────────────────────
    @Test
    @DisplayName("POST /api/auth/login with invalid credentials returns 401")
    void loginWithInvalidCredentialsReturns401() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "email": "nonexistent@test.com",
                                    "password": "wrongpassword"
                                }
                                """))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").exists());
    }

    // ── Orders — Unauthorized without JWT ───────────────────
    @Test
    @DisplayName("GET /api/orders without JWT returns 401")
    void getOrdersWithoutJwtReturns401() throws Exception {
        mockMvc.perform(get("/api/orders"))
                .andExpect(status().isUnauthorized());
    }

    // ── Orders — Post without JWT ────────────────────────────
    @Test
    @DisplayName("POST /api/orders without JWT returns 401")
    void postOrderWithoutJwtReturns401() throws Exception {
        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "items": [{"id":1,"name":"Americano","price":150.0,"quantity":1}],
                                    "total": 150.0
                                }
                                """))
                .andExpect(status().isUnauthorized());
    }
}
