package com.amtsolution.patterns.observer;

// Contrato Observer para reações às alterações publicadas por um produto.
public interface ObservadorProduto {
    void atualizar(EventoProduto evento);
}
