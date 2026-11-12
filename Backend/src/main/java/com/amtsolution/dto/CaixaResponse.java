package com.amtsolution.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CaixaResponse(Long id, LocalDateTime abertoEm, LocalDateTime fechadoEm,
        BigDecimal saldoInicial, BigDecimal saldoFinal, BigDecimal saldoAtual, String situacao) {
}
