package com.foodora.cart_service.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CartResponseDTO {
    private CartDTO data;
}
