package com.amtsolution.patterns.factory;

// Produto abstrato da fábrica; expõe a entidade financeira criada sem fixar seu tipo concreto.
public interface LancamentoFinanceiro {
    Object entidade();
}
