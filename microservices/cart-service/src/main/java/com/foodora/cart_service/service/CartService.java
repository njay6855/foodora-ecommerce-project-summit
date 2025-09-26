package com.foodora.cart_service.service;

import com.foodora.cart_service.dto.*;

public interface CartService {

    CartResponseDTO getActiveCart(Long userId);

    CartResponseDTO addItemToCart(Long userId, AddCartItemRequest request);

    void removeCart(Long userId);

    CartResponseDTO updateCartItem(Long userId, Long itemId, UpdateCartItemRequest request);

    void removeCartItem(Long userId, Long itemId);
}
