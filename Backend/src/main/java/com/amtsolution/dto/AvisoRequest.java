package com.amtsolution.dto;

import java.time.LocalDate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AvisoRequest(@NotBlank @Size(max = 200) String titulo, @NotBlank String corpo,
        @NotBlank @Pattern(regexp = "MANUAL|ESTOQUE_BAIXO|VENCIMENTO_PROXIMO") String tipo,
        @NotBlank @Pattern(regexp = "ALTA|MEDIA|BAIXA") String prioridade, @NotBlank @Size(max = 50) String publico,
        @NotNull LocalDate inicio, LocalDate fim, @NotBlank @Pattern(regexp = "RASCUNHO|PUBLICADO|ARQUIVADO") String situacao,
        @Size(max = 120) String chaveEvento, Long produtoOrigemId, Long contaPagarOrigemId, Long criadoPorUsuarioId) {}
