package com.amtsolution.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record MovimentacaoCaixaResponse(Long id, Long caixaId, String tipo, BigDecimal valor,
        String descricao, LocalDateTime ocorridoEm) {
}
