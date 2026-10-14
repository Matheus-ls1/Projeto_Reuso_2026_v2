package com.amtsolution.dto;

import jakarta.validation.constraints.NotNull;

/** Payload exclusivo para ativar ou desativar um cadastro, sem removê-lo. */
// DTO exclusivo para operações que alteram o status sem excluir o cadastro.
public record AtivoRequest(@NotNull Boolean ativo) {
}
