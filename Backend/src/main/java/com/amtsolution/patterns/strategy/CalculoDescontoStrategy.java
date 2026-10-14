package com.amtsolution.patterns.strategy;

import java.math.BigDecimal;

// Contrato Strategy para os algoritmos intercambiáveis de desconto em contas a receber.
public interface CalculoDescontoStrategy {
    String nome();

    BigDecimal calcular(BigDecimal valorOriginal, BigDecimal parametro, int dias);
}
