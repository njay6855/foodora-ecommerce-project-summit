package com.foodora.cart_service.service.impl;

import com.foodora.cart_service.dto.*;
import com.foodora.cart_service.exception.CartItemNotFoundException;
import com.foodora.cart_service.exception.CartNotFoundException;
import com.foodora.cart_service.mapper.CartMapper;
import com.foodora.cart_service.model.Cart;
import com.foodora.cart_service.model.CartItem;
import com.foodora.cart_service.repository.CartItemRepository;
import com.foodora.cart_service.repository.CartRepository;
import com.foodora.cart_service.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    @Transactional(readOnly = true)
    @Override
    public CartResponseDTO getActiveCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new CartNotFoundException("No active cart found"));

        return CartResponseDTO.builder()
                .data(CartMapper.convertToDTO(cart))
                .build();
    }

    @Transactional
    @Override
    public CartResponseDTO addItemToCart(Long userId, AddCartItemRequest request) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> cartRepository.save(Cart.builder().userId(userId).build()));

        CartItem existingItem = cart.getItems().stream()
                .filter(item -> item.getProductId().equals(request.getProductId()))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
            cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .productId(request.getProductId())
                    .quantity(request.getQuantity())
                    .build();
            cart.addItem(newItem);
            cartItemRepository.save(newItem);
        }

        cartRepository.save(cart);

        return CartResponseDTO.builder()
                .data(CartMapper.convertToDTO(cart))
                .build();
    }

    @Transactional
    @Override
    public void removeCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new CartNotFoundException("Cart not found"));
        cartRepository.delete(cart);
    }

    @Transactional
    @Override
    public CartResponseDTO updateCartItem(Long userId, Long itemId, UpdateCartItemRequest request) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new CartNotFoundException("Cart not found"));

        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new CartItemNotFoundException("Cart item not found"));

        if (!cartItem.getCart().getUserId().equals(userId)) {
            throw new CartItemNotFoundException("Cart item not found in the specified cart");
        }

        cartItem.setQuantity(request.getQuantity());
        cartItemRepository.save(cartItem);

        return CartResponseDTO.builder()
                .data(CartMapper.convertToDTO(cart))
                .build();
    }

    @Transactional
    @Override
    public void removeCartItem(Long userId, Long itemId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new CartNotFoundException("Cart not found"));

        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new CartItemNotFoundException("Cart item not found"));

        if (!cartItem.getCart().getUserId().equals(userId)) {
            throw new CartItemNotFoundException("Cart item not found in the specified cart");
        }

        cart.removeItem(cartItem);
        cartItemRepository.delete(cartItem);
        cartRepository.save(cart);
    }
}
