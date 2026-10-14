package com.amtsolution.patterns.observer;

import java.util.List;
import org.springframework.stereotype.Component;

@Component
// Sujeito do Observer: recebe a lista de observadores e publica o evento sem conhecer suas regras.
public class SujeitoProduto {
    private final List<ObservadorProduto> observadores;

    public SujeitoProduto(List<ObservadorProduto> observadores) {
        this.observadores = observadores;
    }

    public void publicar(EventoProduto evento) {
        // Cada observador interessado decide como reagir ao mesmo evento de produto.
        observadores.forEach(o -> o.atualizar(evento));
    }
}
