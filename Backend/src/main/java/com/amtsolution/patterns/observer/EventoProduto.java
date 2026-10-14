package com.amtsolution.patterns.observer;

import com.amtsolution.model.Produto;

// Mensagem publicada pelo sujeito após salvar ou atualizar um produto.
public record EventoProduto(Produto produto) {
}
