package com.amtsolution.dto;
import jakarta.validation.constraints.NotBlank;
public record SituacaoRequest(@NotBlank String situacao) {}
