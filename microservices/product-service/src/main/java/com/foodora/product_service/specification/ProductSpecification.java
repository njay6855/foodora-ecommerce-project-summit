package com.foodora.product_service.specification;


import com.foodora.product_service.dto.ProductSearchCriteriaDTO;
import com.foodora.product_service.model.Product;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class ProductSpecification {

    public static Specification<Product> withFilters(ProductSearchCriteriaDTO criteria) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (criteria.getName() != null && !criteria.getName().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + criteria.getName().toLowerCase() + "%"));
            }

            if (criteria.getCategoryId() != null) {
                predicates.add(cb.equal(root.get("categoryId"), criteria.getCategoryId()));
            }

            if (criteria.getSupplierId() != null) {
                predicates.add(cb.equal(root.get("supplierId"), criteria.getSupplierId()));
            }

            if (criteria.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), criteria.getStatus()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
