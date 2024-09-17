package com.Medical.dao.requests;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.*;

@Getter
@Setter
@Builder
public class AnswerRequest {

    @NotNull(message = "Question ID is required")
    private Long questionId;

    @NotBlank(message = "Answer content is required")
    @Size(max = 1000, message = "Answer must be less than 1000 characters")
    private String content;
}
