package com.amtsolution.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UsuarioRequest(@NotBlank @Size(max = 150) String nome, @NotBlank @Email @Size(max = 150) String email,
        @NotBlank @Size(max = 100) String cargo, @NotBlank @Size(max = 80) String perfil,
        @Size(min = 8, max = 100) String senha, @NotNull Boolean ativo) {}
