package com.foodora.cart_service.mapper;

import java.util.stream.Collectors;

import com.foodora.cart_service.dto.CartDTO;
import com.foodora.cart_service.dto.CartItemDTO;
import com.foodora.cart_service.model.Cart;

public class CartMapper {

     // Helper method to convert Cart entity to DTO
    public static CartDTO convertToDTO(Cart cart) {

        return CartDTO.builder()
                .cartId(cart.getCartId())
                .userId(cart.getUserId())
                .items(cart.getItems().stream()
                        .map(item -> CartItemDTO.builder()
                                .itemId(item.getItemId())
                                .cartId(cart.getCartId())
                                .productId(item.getProductId())
                                .quantity(item.getQuantity())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
    
}
