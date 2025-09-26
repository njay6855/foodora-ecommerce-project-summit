package com.foodora.product_service.dto;

import lombok.Data;

@Data
public class ProductSearchCriteriaDTO {
    private String name;
    private Long categoryId;
    private Long supplierId;
    private String status;
}

