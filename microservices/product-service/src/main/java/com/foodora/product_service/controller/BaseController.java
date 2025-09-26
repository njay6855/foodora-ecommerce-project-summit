package com.foodora.product_service.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;


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

    /**
     * Log request details.
     * @param action Short action description (e.g., method name)
     * @param details Additional details about the request (params, body)
     */
    protected void logRequest(String action, Object details) {
        logger.info("Request - action: {}, details: {}", action, details);
    }

    /**
     * Log error details.
     * @param action Short action description where error occurred
     * @param throwable Exception thrown
     */
    protected void logError(String action, Throwable throwable) {
        logger.error("Error during {}: {}", action, throwable.getMessage(), throwable);
    }
}
