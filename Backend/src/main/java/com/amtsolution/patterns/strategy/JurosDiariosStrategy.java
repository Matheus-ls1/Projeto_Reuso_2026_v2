package com.amtsolution.patterns.strategy;

import java.math.*;
import org.springframework.stereotype.Component;

@Component
// Estratégia concreta que calcula juros proporcionais ao número de dias informado.
public class JurosDiariosStrategy implements CalculoEncargoStrategy {
    public String nome() {
        return "JUROS_DIARIOS";
    }

    public BigDecimal calcular(BigDecimal valor, BigDecimal percentual, int dias) {
        if (valor == null || valor.signum() < 0 || percentual == null || percentual.signum() < 0 || dias < 0)
            throw new IllegalArgumentException("Valores de encargo inválidos.");
        return valor.multiply(percentual).multiply(BigDecimal.valueOf(dias)).divide(BigDecimal.valueOf(100), 2,
                RoundingMode.HALF_UP);
    }
}
