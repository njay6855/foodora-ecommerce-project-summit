package com.foodora.cart_service.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CartItemDTO {
    private Long itemId;
    private Long cartId;
    private Long productId;
    private Integer quantity;
}
