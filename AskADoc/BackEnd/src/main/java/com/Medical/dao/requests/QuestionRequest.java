package com.Medical.dao.requests;

import com.Medical.dao.enums.MedicalCategories;

import lombok.Builder;
import lombok.Setter;
import lombok.Getter;
import jakarta.validation.constraints.*;

@Getter
@Setter
@Builder
public class QuestionRequest {

    @NotNull(message = "Category is required")
    private MedicalCategories category;

    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title must be less than 100 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(max = 500, message = "Description must be less than 500 characters")
    private String description;

    @NotBlank(message = "Keyword is required")
    @Size(max = 50, message = "Keyword must be less than 50 characters")
    private String keyword;
}
