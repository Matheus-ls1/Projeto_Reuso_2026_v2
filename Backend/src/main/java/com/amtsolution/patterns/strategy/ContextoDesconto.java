package com.amtsolution.patterns.strategy;

import java.math.*;
import java.util.*;
import org.springframework.stereotype.Component;

@Component
// Contexto Strategy: registra as implementações disponíveis e delega o cálculo à selecionada.
public class ContextoDesconto {
    private final Map<String, CalculoDescontoStrategy> estrategias;

    public ContextoDesconto(List<CalculoDescontoStrategy> itens) {
        estrategias = new HashMap<>();
        itens.forEach(e -> estrategias.put(e.nome(), e));
    }

    public ResultadoCalculo simular(String nome, BigDecimal valor, BigDecimal parametro, int dias) {
        CalculoDescontoStrategy e = estrategias.get(nome);
        if (e == null)
            throw new IllegalArgumentException("Estratégia de desconto inválida.");
        // O polimorfismo permite trocar o algoritmo sem condicional para cada tipo de desconto.
        BigDecimal ajuste = e.calcular(valor, parametro == null ? BigDecimal.ZERO : parametro, dias);
        return new ResultadoCalculo(nome, valor, valor.subtract(ajuste), ajuste);
    }
}
