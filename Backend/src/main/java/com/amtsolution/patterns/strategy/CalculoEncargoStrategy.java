package com.amtsolution.patterns.strategy;

import java.math.BigDecimal;

// Contrato Strategy para os algoritmos intercambiáveis de encargo em contas a pagar.
public interface CalculoEncargoStrategy {
    String nome();

    BigDecimal calcular(BigDecimal valorOriginal, BigDecimal percentual, int dias);
}
