package com.foodora.product_service.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalStatusRequestDTO {
    @NotBlank
    private String status;  // "Approved" or "Rejected"
    private Long dataStewardId;
}