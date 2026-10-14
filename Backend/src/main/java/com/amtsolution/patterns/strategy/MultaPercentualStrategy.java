package com.amtsolution.patterns.strategy;

import java.math.*;
import org.springframework.stereotype.Component;

@Component
// Estratégia concreta que aplica uma multa percentual única ao valor da conta.
public class MultaPercentualStrategy implements CalculoEncargoStrategy {
    public String nome() {
        return "MULTA_PERCENTUAL";
    }

    public BigDecimal calcular(BigDecimal valor, BigDecimal percentual, int dias) {
        validar(valor, percentual, dias);
        return valor.multiply(percentual).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
    }

    private void validar(BigDecimal v, BigDecimal p, int d) {
        if (v == null || v.signum() < 0 || p == null || p.signum() < 0 || d < 0)
            throw new IllegalArgumentException("Valores de encargo inválidos.");
    }
}
