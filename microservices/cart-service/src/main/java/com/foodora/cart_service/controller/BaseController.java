package com.foodora.cart_service.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;

/**
 * Generic base controller with common utilities for all controllers in Cart service.
 */
public abstract class BaseController {

    protected final Logger logger = LoggerFactory.getLogger(this.getClass());

    protected <T> ResponseEntity<T> ok(T data) {
        logger.info("Response 200 OK - body: {}", data);
        return ResponseEntity.ok(data);
    }

    protected <T> ResponseEntity<T> created(T data) {
        logger.info("Response 201 Created - body: {}", data);
        return ResponseEntity.status(201).body(data);
    }

    protected ResponseEntity<Void> noContent() {
        logger.info("Response 204 No Content");
        return ResponseEntity.noContent().build();
    }

    protected void logRequest(String action, Object details) {
        logger.info("Request - action: {}, details: {}", action, details);
    }

    protected void logError(String action, Throwable throwable) {
        logger.error("Error during {}: {}", action, throwable.getMessage(), throwable);
    }
}
