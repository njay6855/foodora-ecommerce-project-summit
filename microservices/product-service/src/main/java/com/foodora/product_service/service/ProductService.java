package com.foodora.product_service.service;

import com.foodora.product_service.dto.*;
import java.util.List;

public interface ProductService {
    ProductResponseDTO getProductById(Long id);

    ProductListResponseDTO searchProducts(ProductSearchCriteriaDTO criteria, int page, int pageSize);

    ProductResponseDTO createProduct(CreateProductRequestDTO dto);

    ProductResponseDTO updateProduct(Long productId, UpdateProductRequestDTO dto);

    void deactivateProduct(Long productId, Long supplierId);

    ProductResponseDTO approveOrRejectProduct(Long productId, String status, Long dataStewardId, String stewardNote);

    List<CategoryResponseDTO> getAllCategories();
    
    CategoryResponseDTO getCategoryById(Long categoryId);
}
