package com.foodora.product_service.mapper;

import com.foodora.product_service.dto.ProductResponseDTO;
import com.foodora.product_service.model.Product;

public class ProductMapper {

    public static ProductResponseDTO toDto(Product product) {
        return ProductResponseDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .quantity(product.getQuantity())
                .status(product.getStatus())
                .categoryId(product.getCategoryId())
                .supplierId(product.getSupplierId())
                .approvedDataStewardId(product.getApprovedDataStewardId())
                .imageUrls(product.getImageUrls())
                .build();
    }
}
