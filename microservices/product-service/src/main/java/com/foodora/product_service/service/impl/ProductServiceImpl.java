package com.foodora.product_service.service.impl;

import com.foodora.product_service.dto.*;
import com.foodora.product_service.exception.NotFoundException;
import com.foodora.product_service.model.Category;
import com.foodora.product_service.model.Product;
import com.foodora.product_service.repository.CategoryRepository;
import com.foodora.product_service.repository.ProductRepository;
import com.foodora.product_service.service.ProductService;
import com.foodora.product_service.mapper.ProductMapper;
import com.foodora.product_service.specification.ProductSpecification;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private static final Logger logger = LoggerFactory.getLogger(ProductServiceImpl.class);

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public ProductResponseDTO getProductById(Long id) {
        logger.info("Fetching product by id: {}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Product not found with id: {}", id);
                    return new NotFoundException("Product not found");
                });
        ProductResponseDTO dto = ProductMapper.toDto(product);
        logger.debug("Product found: {}", dto);
        return dto;
    }

  
    @Override
    public ProductListResponseDTO searchProducts(ProductSearchCriteriaDTO criteria, int page, int pageSize) {
        logger.info("Searching products with criteria: {}, page: {}, pageSize: {}", criteria, page, pageSize);

        try {
            Pageable pageable = PageRequest.of(page - 1, pageSize);
            Specification<Product> spec = ProductSpecification.withFilters(criteria);
            Page<Product> productPage = productRepository.findAll(spec, pageable);

            Page<ProductResponseDTO> dtoPage = productPage.map(ProductMapper::toDto);

            ProductListResponseDTO.Meta meta = new ProductListResponseDTO.Meta(
                    page,
                    pageSize,
                    dtoPage.getTotalElements(),
                    dtoPage.getTotalPages()
            );

            ProductListResponseDTO response = ProductListResponseDTO.builder()
                    .data(dtoPage.getContent())
                    .meta(meta)
                    .build();

            logger.debug("Found {} products", dtoPage.getTotalElements());
            return response;
        } catch (Exception e) {
            logger.error("Failed to search products", e);
            throw new IllegalArgumentException("Failed to search products: " + e.getMessage());
        }
    }


    @Override
    @Transactional
    public ProductResponseDTO createProduct(CreateProductRequestDTO dto) {
        logger.info("Creating product with name: {}, supplierId: {}", dto.getName(), dto.getSupplierId());

        if (!categoryRepository.existsById(dto.getCategoryId())) {
            logger.warn("Category not found with id: {}", dto.getCategoryId());
            throw new NotFoundException("Category not found");
        }

        try {
            Product product = Product.builder()
                    .name(dto.getName())
                    .description(dto.getDescription())
                    .price(dto.getPrice())
                    .quantity(dto.getQuantity())
                    .categoryId(dto.getCategoryId())
                    .supplierId(dto.getSupplierId())
                    .status("Pending")
                    .imageUrls(dto.getImageUrls())
                    .build();

            productRepository.save(product);

            ProductResponseDTO responseDTO = ProductMapper.toDto(product);
            logger.debug("Product created successfully with id: {}", responseDTO.getId());
            return responseDTO;

        } catch (Exception e) {
            logger.error("Failed to create product", e);
            throw new IllegalStateException("Failed to create product: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public ProductResponseDTO updateProduct(Long productId, UpdateProductRequestDTO dto) {
        logger.info("Updating product id: {} by supplierId: {}", productId, dto.getSupplierId());

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> {
                    logger.warn("Product not found with id: {}", productId);
                    return new NotFoundException("Product not found.");
                });

        if (!product.getSupplierId().equals(dto.getSupplierId())) {
            logger.warn("Unauthorized update attempt on product id: {} by supplierId: {}", productId, dto.getSupplierId());
            throw new IllegalStateException("You do not have permission to update this product");
        }

        if (dto.getCategoryId() != null && !categoryRepository.existsById(dto.getCategoryId())) {
            logger.warn("Category not found with id: {}", dto.getCategoryId());
            throw new NotFoundException("Category not found");
        }

        if (dto.getName() != null) product.setName(dto.getName());
        if (dto.getDescription() != null) product.setDescription(dto.getDescription());
        if (dto.getPrice() != null) product.setPrice(dto.getPrice());
        if (dto.getQuantity() != null) product.setQuantity(dto.getQuantity());
        if (dto.getStatus() != null) product.setStatus(dto.getStatus());
        if (dto.getCategoryId() != null) product.setCategoryId(dto.getCategoryId());
        if (dto.getImageUrls() != null) product.setImageUrls(dto.getImageUrls());

        

        productRepository.save(product);
        ProductResponseDTO updatedDto = ProductMapper.toDto(product);

        logger.debug("Product updated successfully: {}", updatedDto.getId());
        return updatedDto;
    }

    @Override
    @Transactional
    public void deactivateProduct(Long productId, Long supplierId) {
        logger.info("Deactivating product id: {} by supplierId: {}", productId, supplierId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> {
                    logger.warn("Product not found with id: {}", productId);
                    return new NotFoundException("Product not found");
                });

        if (!product.getSupplierId().equals(supplierId)) {
            logger.warn("Unauthorized deactivate attempt on product id: {} by supplierId: {}", productId, supplierId);
            throw new IllegalStateException("You do not have permission to deactivate this product");
        }

        product.setStatus("Deactivated");
        productRepository.save(product);
        logger.debug("Product deactivated successfully: {}", productId);
    }

    @Override
    @Transactional
    public ProductResponseDTO approveOrRejectProduct(Long productId, String status, Long dataStewardId) {
        logger.info("Approving or rejecting product id: {} with status: {} by dataStewardId: {}", productId, status, dataStewardId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> {
                    logger.warn("Product not found with id: {}", productId);
                    return new NotFoundException("Product not found");
                });

        if (status == null || (!status.equalsIgnoreCase("Approved") && !status.equalsIgnoreCase("Rejected"))) {
            logger.warn("Invalid status: {}", status);
            throw new IllegalArgumentException("Status must be 'Approved' or 'Rejected'");
        }

        if (dataStewardId == null) {
            logger.warn("Missing data steward id for approval/rejection");
            throw new IllegalArgumentException("Data steward ID is required for approval or rejection");
        }

        product.setStatus(status);
        product.setApprovedDataStewardId(dataStewardId);
        productRepository.save(product);

        ProductResponseDTO dto = ProductMapper.toDto(product);
        logger.debug("Product status updated to {} for product id: {}", status, productId);
        return dto;
    }

    @Override
    public List<CategoryResponseDTO> getAllCategories() {
        logger.info("Fetching all product categories");
        List<Category> categories = categoryRepository.findAll();

        if (categories.isEmpty()) {
            logger.warn("No categories found");
            throw new NotFoundException("No categories found");
        }

        List<CategoryResponseDTO> dtoList = categories.stream()
                .map(c -> CategoryResponseDTO.builder()
                        .id(c.getId())
                        .name(c.getName())
                        .build())
                .collect(Collectors.toList());

        logger.debug("Found {} categories", dtoList.size());
        return dtoList;
    }

    @Override
    public CategoryResponseDTO getCategoryById(Long categoryId) {
        logger.info("Fetching category by id: {}", categoryId);
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> {
                    logger.warn("Category not found with id: {}", categoryId);
                    return new NotFoundException("Category not found");
                });

        CategoryResponseDTO dto = CategoryResponseDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .build();

        logger.debug("Category found: {}", dto);
        return dto;
    }
}
