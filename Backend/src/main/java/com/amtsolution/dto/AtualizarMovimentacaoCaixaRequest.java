package com.amtsolution.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AtualizarMovimentacaoCaixaRequest(
        @NotBlank @Pattern(regexp = "ENTRADA|SAIDA") String tipo,
        @NotNull @DecimalMin(value = "0.01") BigDecimal valor,
        @NotBlank @Size(max = 200) String descricao,
        LocalDateTime ocorridoEm) {
}
