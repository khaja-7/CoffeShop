package com.coffeeshop.config;

import com.coffeeshop.entity.Product;
import com.coffeeshop.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Seeds the products table in Supabase with the 10 coffee shop products
 * on first startup (only if the table is empty).
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final ProductRepository productRepository;

    public DataSeeder(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        if (productRepository.count() > 0) {
            log.info("☕ Products already seeded. Skipping.");
            return;
        }

        log.info("☕ Seeding products into Supabase...");

        List<Product> products = List.of(
            Product.builder()
                .name("Americano")
                .description("A bold coffee drink prepared by diluting an espresso with hot water, giving it a similar strength to brewed coffee but with a different flavor.")
                .price(150.00)
                .rating(5)
                .category("Hot Coffee")
                .image("/assets/americano.jpg")
                .build(),

            Product.builder()
                .name("Cappuccino")
                .description("An espresso-based coffee drink that originated in Italy, prepared with steamed milk foam for a rich, creamy experience.")
                .price(170.00)
                .rating(5)
                .category("Hot Coffee")
                .image("/assets/cappuccino.jpg")
                .build(),

            Product.builder()
                .name("Macchiato")
                .description("An espresso coffee drink with a small amount of steamed milk, meaning 'stained' or 'spotted' coffee in Italian.")
                .price(200.00)
                .rating(5)
                .category("Hot Coffee")
                .image("/assets/macchiato.jpg")
                .build(),

            Product.builder()
                .name("Espresso")
                .description("A concentrated form of coffee served as shots. The base for many coffee drinks, rich and intense in flavor.")
                .price(120.00)
                .rating(4)
                .category("Hot Coffee")
                .image("/assets/espresso.jpg")
                .build(),

            Product.builder()
                .name("Latte")
                .description("A creamy coffee drink made with espresso and steamed milk, topped with a thin layer of foam. Smooth and mild.")
                .price(180.00)
                .rating(5)
                .category("Hot Coffee")
                .image("/assets/latte.jpg")
                .build(),

            Product.builder()
                .name("Iced Latte")
                .description("Chilled espresso poured over ice and mixed with cold milk for a refreshing and smooth coffee experience.")
                .price(190.00)
                .rating(4)
                .category("Cold Coffee")
                .image("/assets/iced-latte.jpg")
                .build(),

            Product.builder()
                .name("Cold Brew")
                .description("Coffee steeped in cold water for 12-24 hours, producing a smooth, less acidic, and naturally sweet flavor profile.")
                .price(210.00)
                .rating(5)
                .category("Cold Coffee")
                .image("/assets/cold-brew.jpg")
                .build(),

            Product.builder()
                .name("Frappuccino")
                .description("A blended iced coffee drink with milk, ice, and flavored syrups, topped with whipped cream. Sweet and indulgent.")
                .price(250.00)
                .rating(4)
                .category("Cold Coffee")
                .image("/assets/frappuccino.jpg")
                .build(),

            Product.builder()
                .name("Mocha Cookie")
                .description("A delightful combination of chocolate and coffee flavors baked into a crispy cookie. Perfect with any hot drink.")
                .price(80.00)
                .rating(4)
                .category("Snacks")
                .image("/assets/mocha-cookie.jpg")
                .build(),

            Product.builder()
                .name("Croissant")
                .description("A buttery, flaky French pastry perfect for pairing with your morning coffee. Golden and freshly baked.")
                .price(100.00)
                .rating(5)
                .category("Snacks")
                .image("/assets/croissant.jpg")
                .build()
        );

        productRepository.saveAll(products);
        log.info("✅ {} products seeded successfully into Supabase!", products.size());
    }
}
