package com.amtsolution.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String recurso, Long id) {
        super(recurso + " não encontrado com id " + id + ".");
    }
}
