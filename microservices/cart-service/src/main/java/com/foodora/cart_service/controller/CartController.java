package com.foodora.cart_service.controller;

import com.foodora.cart_service.dto.*;
import com.foodora.cart_service.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Cart", description = "Cart API Endpoints")
@RestController
@RequestMapping("/api/v1/carts")
@RequiredArgsConstructor
public class CartController extends BaseController {

    private final CartService cartService;

    @Operation(summary = "Get current active cart for user", operationId = "getActiveCart")
    @GetMapping("/{userId}")
    public ResponseEntity<CartResponseDTO> getActiveCart(@PathVariable Long userId) {
        logRequest("getActiveCart", "userId=" + userId);
        CartResponseDTO response = cartService.getActiveCart(userId);
        logger.info("Active cart retrieved for userId={}, itemsCount={}", userId, response.getData().getItems().size());
        return ok(response);
    }

    @Operation(summary = "Add item to cart (auto-create cart if none exists)", operationId = "addItemToCart")
    @PostMapping("/{userId}")
    public ResponseEntity<CartResponseDTO> addItemToCart(
            @PathVariable Long userId,
            @Valid @RequestBody AddCartItemRequest request) {

        logRequest("addItemToCart", String.format("userId=%d, productId=%d, quantity=%d",
                userId, request.getProductId(), request.getQuantity()));

        CartResponseDTO response = cartService.addItemToCart(userId, request);

        logger.info("Item added to cart for userId={}, cartId={}, totalItems={}",
                userId, response.getData().getCartId(), response.getData().getItems().size());

        return created(response);
    }

    @Operation(summary = "Delete the cart", operationId = "removeCart")
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> removeCart(@PathVariable Long userId) {
        logRequest("removeCart", "userId=" + userId);
        cartService.removeCart(userId);
        logger.info("Cart removed for userId={}", userId);
        return noContent();
    }

    @Operation(summary = "Update quantity of a cart item", operationId = "updateCartItem")
    @PatchMapping("/{userId}/items/{itemId}")
    public ResponseEntity<CartResponseDTO> updateCartItem(
            @PathVariable Long userId,
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateCartItemRequest request) {

        logRequest("updateCartItem", String.format("userId=%d, itemId=%d, quantity=%d", userId, itemId, request.getQuantity()));

        CartResponseDTO response = cartService.updateCartItem(userId, itemId, request);

        logger.info("Cart item updated itemId={} for userId={}", itemId, userId);

        return ok(response);
    }

    @Operation(summary = "Remove item from cart", operationId = "removeCartItem")
    @DeleteMapping("/{userId}/items/{itemId}")
    public ResponseEntity<Void> removeCartItem(
            @PathVariable Long userId,
            @PathVariable Long itemId) {

        logRequest("removeCartItem", String.format("userId=%d, itemId=%d", userId, itemId));

        cartService.removeCartItem(userId, itemId);

        logger.info("Cart item removed itemId={} from userId={}", itemId, userId);

        return noContent();
    }
}
