package com.amtsolution.dto;

import java.math.BigDecimal;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public record AbrirCaixaRequest(@NotNull @DecimalMin(value = "0.00") BigDecimal saldoInicial) {
}
