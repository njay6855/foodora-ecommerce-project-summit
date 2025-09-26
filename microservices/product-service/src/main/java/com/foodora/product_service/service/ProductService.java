package com.foodora.product_service.service;

import com.foodora.product_service.dto.*;
import com.foodora.product_service.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {
    ProductResponseDTO getProductById(Long id);

    //Page<Product> searchProducts(ProductSearchCriteriaDTO criteria, Pageable pageable);
    ProductListResponseDTO searchProducts(ProductSearchCriteriaDTO criteria, int page, int pageSize);

    ProductResponseDTO createProduct(CreateProductRequestDTO dto);

    ProductResponseDTO updateProduct(Long productId, UpdateProductRequestDTO dto);

    void deactivateProduct(Long productId, Long supplierId);

    ProductResponseDTO approveOrRejectProduct(Long productId, String status, Long dataStewardId);

    List<CategoryResponseDTO> getAllCategories();
    
    CategoryResponseDTO getCategoryById(Long categoryId);
}
