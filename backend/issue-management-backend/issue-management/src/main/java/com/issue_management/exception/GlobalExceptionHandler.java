package com.issue_management.exception;

import com.issue_management.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1️⃣ Validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(
            MethodArgumentNotValidException ex,
            HttpServletRequest request
    ) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            errors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }

        return ResponseEntity.badRequest().body(
                new ErrorResponse(
                        400,
                        "VALIDATION_ERROR",
                        errors,
                        request.getRequestURI()
                )
        );
    }

    // 2️⃣ Not found
    @ExceptionHandler(IssueNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(
            IssueNotFoundException ex,
            HttpServletRequest request
    ) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ErrorResponse(
                        404,
                        "NOT_FOUND",
                        ex.getMessage(),
                        request.getRequestURI()
                )
        );
    }

    // 3️⃣ Business rule violation
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorResponse> handleIllegalState(
            IllegalStateException ex,
            HttpServletRequest request
    ) {
        return ResponseEntity.badRequest().body(
                new ErrorResponse(
                        400,
                        "INVALID_STATE",
                        ex.getMessage(),
                        request.getRequestURI()
                )
        );
    }

    // 4️⃣ Generic fallback
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(
            Exception ex,
            HttpServletRequest request
    ) {
        ex.printStackTrace(); // 👈 PRINT REAL ERROR

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new ErrorResponse(
                        500,
                        "INTERNAL_SERVER_ERROR",
                        ex.getMessage(),   // 👈 RETURN REAL MESSAGE
                        request.getRequestURI()
                )
        );
    }

}
