package com.foodora.product_service.controller;

import com.foodora.product_service.dto.*;
import com.foodora.product_service.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/products")
@RequiredArgsConstructor
public class ProductController extends BaseController {

    private final ProductService productService;

    @Operation(summary = "Search and browse products with optional filters and pagination")
    @GetMapping
    public ResponseEntity<ProductListResponseDTO> searchProducts(
            ProductSearchCriteriaDTO criteria,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {

        logRequest("searchProducts", String.format("criteria=%s, page=%d, pageSize=%d", criteria, page, pageSize));

        ProductListResponseDTO responseBody = productService.searchProducts(criteria, page, pageSize);
        return ok(responseBody);
    }

    @Operation(summary = "Create a new product (Supplier only)")
    @PostMapping
    public ResponseEntity<ProductResponseDTO> createProduct(@Valid @RequestBody CreateProductRequestDTO request) {
        logRequest("createProduct", "supplierId=" + request.getSupplierId());
        ProductResponseDTO created = productService.createProduct(request);
        return created(created);  
    }

    @Operation(summary = "Get detailed product info by ID")
    @GetMapping("/{productId}")
    public ResponseEntity<ProductResponseDTO> getProduct(@PathVariable Long productId) {
        logRequest("getProduct", "productId=" + productId);
        ProductResponseDTO dto = productService.getProductById(productId);
        return ok(dto);
    }

    @Operation(summary = "Update product details (Supplier only)")
    @PutMapping("/{productId}")
    public ResponseEntity<ProductResponseDTO> updateProduct(
            @PathVariable Long productId,
            @RequestBody UpdateProductRequestDTO request) {
        logRequest("updateProduct", String.format("productId=%d, supplierId=%s", productId, request.getSupplierId()));
        ProductResponseDTO updated = productService.updateProduct(productId, request);
        return ok(updated);
    }

    @Operation(summary = "Approve or reject a product by updating status (Data Steward only)")
    @PatchMapping("/{productId}")
    public ResponseEntity<Void> approveOrRejectProduct(
            @PathVariable Long productId,
            @RequestBody ApprovalStatusRequestDTO request) {
        logRequest("approveOrRejectProduct", String.format("productId=%d, status=%s", productId, request.getStatus()));
        productService.approveOrRejectProduct(productId, request.getStatus(), request.getDataStewardId());
        return noContent();
    }

    @Operation(summary = "Deactivate / soft delete product (Supplier only)")
    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deactivateProduct(
            @RequestParam Long supplierId,
            @PathVariable Long productId) {
        logRequest("deactivateProduct", String.format("productId=%d, supplierId=%d", productId, supplierId));
        productService.deactivateProduct(productId, supplierId);
        return noContent();
    }

    @Operation(summary = "List all product categories")
    @GetMapping("/categories")
    public ResponseEntity<List<CategoryResponseDTO>> listCategories() {
        logRequest("listCategories", "no params");
        List<CategoryResponseDTO> categories = productService.getAllCategories();
        return ok(categories);
    }

    @Operation(summary = "Get category details by ID")
    @GetMapping("/categories/{categoryId}")
    public ResponseEntity<CategoryResponseDTO> getCategory(@PathVariable Long categoryId) {
        logRequest("getCategory", "categoryId=" + categoryId);
        CategoryResponseDTO category = productService.getCategoryById(categoryId);
        return ok(category);
    }
}
