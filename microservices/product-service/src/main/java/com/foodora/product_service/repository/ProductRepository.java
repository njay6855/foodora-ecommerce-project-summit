package com.foodora.product_service.repository;

import com.foodora.product_service.model.Product;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;


public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    Page<Product> findAllBySupplierId(Long supplierId, Pageable pageable);

    Page<Product> findByStatus(String status, Pageable pageable);

   // Search products by name and status
    Page<Product> findByNameContainingIgnoreCaseAndStatus(
        String name, String status, Pageable pageable);

    // Search products by categoryId and status
    Page<Product> findByCategoryIdAndStatus(
        Long categoryId, String status, Pageable pageable);

    // Search products by name, categoryId and status
    Page<Product> findByNameContainingIgnoreCaseAndCategoryIdAndStatus(
        String name, Long categoryId, String status, Pageable pageable);

    // Search product by supplierId
    Page<Product> findBySupplierId(
        Long supplierId, Pageable pageable);

}
