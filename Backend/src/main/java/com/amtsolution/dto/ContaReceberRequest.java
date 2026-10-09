package com.amtsolution.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ContaReceberRequest(@NotBlank @Size(max = 200) String descricao, @NotBlank @Size(max = 80) String categoria,
        @NotBlank @Size(max = 150) String cliente, @NotNull LocalDate vencimento, @NotNull @DecimalMin("0.01") BigDecimal valorOriginal,
        @NotBlank @Pattern(regexp = "SEM_DESCONTO|PERCENTUAL|ANTECIPACAO") String estrategiaDesconto,
        @NotNull @DecimalMin("0.00") BigDecimal percentualDesconto, @NotNull @DecimalMin("0.00") BigDecimal valorDesconto,
        @NotBlank @Pattern(regexp = "PENDENTE|RECEBIDO|VENCIDO|CANCELADO") String situacao, LocalDate dataRecebimento,
        @DecimalMin("0.00") BigDecimal valorRecebido, @Size(max = 30) String formaRecebimento, String observacao) {}
