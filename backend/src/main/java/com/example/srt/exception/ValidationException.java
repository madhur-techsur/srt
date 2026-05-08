package com.example.srt.exception;

import java.util.List;

public class ValidationException extends RuntimeException {

    public record FieldError(String field, String message) {}

    private final List<FieldError> fieldErrors;

    public ValidationException(List<FieldError> fieldErrors) {
        super("Validation failed");
        this.fieldErrors = fieldErrors;
    }

    public List<FieldError> getFieldErrors() {
        return fieldErrors;
    }
}
