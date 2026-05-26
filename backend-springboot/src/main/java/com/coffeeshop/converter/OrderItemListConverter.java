package com.coffeeshop.converter;

import com.coffeeshop.entity.Order.OrderItem;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Collections;
import java.util.List;

/**
 * JPA AttributeConverter: converts List<OrderItem> ↔ JSON String
 * so order items can be stored as a JSON column in PostgreSQL.
 */
@Converter
public class OrderItemListConverter implements AttributeConverter<List<OrderItem>, String> {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<OrderItem> items) {
        try {
            if (items == null || items.isEmpty()) return "[]";
            return MAPPER.writeValueAsString(items);
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize order items to JSON", e);
        }
    }

    @Override
    public List<OrderItem> convertToEntityAttribute(String json) {
        try {
            if (json == null || json.isBlank()) return Collections.emptyList();
            return MAPPER.readValue(json, new TypeReference<List<OrderItem>>() {});
        } catch (Exception e) {
            throw new RuntimeException("Failed to deserialize order items from JSON", e);
        }
    }
}
