package com.amtsolution.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

// DTO de entrada da conta a pagar, incluindo os parâmetros da estratégia de encargo.
// [INFRA:VALIDACAO] ContaPagarController usa @Valid antes de encaminhar a criação/edição ao service.
public record ContaPagarRequest(
    @NotBlank @Size(max = 200) String descricao, @NotBlank @Size(max = 80) String categoria,
    Long fornecedorId, @NotNull LocalDate vencimento, @NotNull @DecimalMin("0.01") BigDecimal valorOriginal,
    @NotBlank @Pattern(regexp = "SEM_ENCARGO|JUROS_SIMPLES|MULTA_JUROS") String estrategiaEncargo,
    @NotNull @DecimalMin("0.00") BigDecimal percentualJuros,
    @NotNull @DecimalMin("0.00") BigDecimal percentualMulta,
    @NotNull @DecimalMin("0.00") BigDecimal valorEncargos,
    @NotBlank @Pattern(regexp = "PENDENTE|PAGO|VENCIDO|CANCELADO") String situacao,
    LocalDate dataPagamento, @DecimalMin("0.00") BigDecimal valorPago,
    @Size(max = 30) String formaPagamento, String observacao) {
}
