package com.amtsolution.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record FornecedorRequest(@NotBlank @Size(max = 150) String nome, @NotBlank @Size(max = 18) String documento,
        @NotBlank @Size(max = 100) String contato, @NotBlank @Size(max = 20) String telefone,
        @NotBlank @Email @Size(max = 150) String email, @NotNull Boolean ativo) {}
