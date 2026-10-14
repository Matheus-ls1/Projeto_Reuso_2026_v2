package com.amtsolution.patterns.strategy;

import java.math.BigDecimal;
import org.springframework.stereotype.Component;

@Component
// Estratégia nula usada quando a conta não deve receber desconto.
public class SemDescontoStrategy implements CalculoDescontoStrategy {
    public String nome() {
        return "SEM_DESCONTO";
    }

    public BigDecimal calcular(BigDecimal v, BigDecimal p, int d) {
        return BigDecimal.ZERO;
    }
}
