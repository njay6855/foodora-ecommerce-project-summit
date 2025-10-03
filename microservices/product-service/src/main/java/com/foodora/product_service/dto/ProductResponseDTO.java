package com.foodora.product_service.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponseDTO {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private Integer quantity;
    private String status;
    private Long categoryId;
    private Long supplierId;
    private Long approvedDataStewardId;
    private List<String> imageUrls;
    private String stewardNote;
}
