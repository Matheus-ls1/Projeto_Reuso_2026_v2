package com.amtsolution.patterns.observer;

// Contrato Observer para reações aos eventos de vencimento de contas a pagar.
public interface ObservadorVencimento {
    void atualizar(EventoVencimento evento);
}
