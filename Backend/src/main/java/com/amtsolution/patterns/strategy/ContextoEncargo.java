package com.amtsolution.patterns.strategy;

import java.math.*;
import java.util.*;
import org.springframework.stereotype.Component;

@Component
// Contexto Strategy: escolhe uma regra de encargo registrada pelo nome informado na simulação.
public class ContextoEncargo {
    private final Map<String, CalculoEncargoStrategy> estrategias;

    public ContextoEncargo(List<CalculoEncargoStrategy> itens) {
        estrategias = new HashMap<>();
        itens.forEach(e -> estrategias.put(e.nome(), e));
    }

    public ResultadoCalculo simular(String nome, BigDecimal valor, BigDecimal percentual, int dias) {
        // [PADRAO:STRATEGY_ENCARGOS] ContaPagarService envia o nome; o mapa seleciona JurosDiarios, Multa ou SemEncargo.
        CalculoEncargoStrategy e = estrategias.get(nome);
        if (e == null)
            throw new IllegalArgumentException("Estratégia de encargo inválida.");
        // A interface comum permite executar a estratégia concreta sem conhecer sua fórmula.
        // [PADRAO:STRATEGY_ENCARGOS] A interface executa calcular() polimorficamente e devolve ResultadoCalculo ao service.
        BigDecimal ajuste = e.calcular(valor, percentual == null ? BigDecimal.ZERO : percentual, dias);
        return new ResultadoCalculo(nome, valor, valor.add(ajuste), ajuste);
    }
}
