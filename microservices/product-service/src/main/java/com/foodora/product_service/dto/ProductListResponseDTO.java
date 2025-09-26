package com.foodora.product_service.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductListResponseDTO {
    private List<ProductResponseDTO> data;
    private Meta meta;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Meta {
        private int page;
        private int pageSize;
        private long total;
        private int totalPages;
    }
}
