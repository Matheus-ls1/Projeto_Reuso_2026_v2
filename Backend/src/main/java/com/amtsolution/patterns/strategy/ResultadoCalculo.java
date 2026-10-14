package com.amtsolution.patterns.strategy;

import java.math.BigDecimal;

/** Resultado de uma simulação; não altera a conta persistida. */
public record ResultadoCalculo(String estrategia, BigDecimal valorOriginal, BigDecimal valorCalculado,
        BigDecimal ajuste) {
}
