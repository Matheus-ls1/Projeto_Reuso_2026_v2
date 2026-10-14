package com.amtsolution.patterns.factory;

// Criador abstrato que delega às subclasses a escolha do lançamento financeiro concreto.
public abstract class CriadorLancamentoFinanceiro {
    public LancamentoFinanceiro criar() {
        return fabricar();
    }

    protected abstract LancamentoFinanceiro fabricar();
}
