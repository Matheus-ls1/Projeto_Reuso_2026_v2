package com.amtsolution.dto;

import jakarta.validation.constraints.NotBlank;

// DTO reduzido para mudanças pontuais de situação financeira.
public record SituacaoRequest(@NotBlank String situacao) {
}
