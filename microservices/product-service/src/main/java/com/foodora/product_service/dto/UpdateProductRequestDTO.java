package com.foodora.product_service.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateProductRequestDTO {

    private String name;

    private String description;

    private Double price;

    private Integer quantity;

    private Long categoryId;

    private Long supplierId; 

    private String status; 

    private List<String> imageUrls;
}
