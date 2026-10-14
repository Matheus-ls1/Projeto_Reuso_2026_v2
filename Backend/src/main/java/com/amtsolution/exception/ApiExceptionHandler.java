package com.amtsolution.exception;

import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    ResponseEntity<Map<String, String>> notFound(ResourceNotFoundException ex) {
        return response(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<Map<String, Object>> validation(MethodArgumentNotValidException ex) {
        Map<String, String> fields = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> fields.put(error.getField(), error.getDefaultMessage()));
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("erro", "Dados inválidos.");
        body.put("campos", fields);
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler({ DataIntegrityViolationException.class, ConflictException.class })
    ResponseEntity<Map<String, String>> conflict(Exception ex) {
        return response(HttpStatus.CONFLICT,
                ex instanceof ConflictException ? ex.getMessage() : "Operação viola uma restrição de integridade.");
    }

    @ExceptionHandler(IllegalArgumentException.class)
    ResponseEntity<Map<String, String>> invalid(Exception ex) {
        return response(HttpStatus.BAD_REQUEST, "Dados inválidos.");
    }

    private ResponseEntity<Map<String, String>> response(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(Map.of("status", String.valueOf(status.value()), "erro", message));
    }
}
