package com.example.srt.dto;

import java.util.List;

public class ErrorResponse {

    public record FieldError(String field, String message) {}

    private String errorCode;
    private String message;
    private List<FieldError> fieldErrors;

    public ErrorResponse() {}

    public ErrorResponse(String errorCode, String message, List<FieldError> fieldErrors) {
        this.errorCode = errorCode;
        this.message = message;
        this.fieldErrors = fieldErrors;
    }

    public String getErrorCode() { return errorCode; }
    public void setErrorCode(String errorCode) { this.errorCode = errorCode; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public List<FieldError> getFieldErrors() { return fieldErrors; }
    public void setFieldErrors(List<FieldError> fieldErrors) { this.fieldErrors = fieldErrors; }
}
