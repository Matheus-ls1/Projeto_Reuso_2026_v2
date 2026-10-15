package com.amtsolution.patterns.factory;

// Criador abstrato que delega às subclasses a escolha do lançamento financeiro concreto.
public abstract class CriadorLancamentoFinanceiro {
    // [PADRAO:FACTORY_FINANCEIRO] Services financeiros chamam criar(), que despacha fabricar() à subclasse.
    public LancamentoFinanceiro criar() {
        return fabricar();
    }

    // [PADRAO:FACTORY_FINANCEIRO] Factory Method implementado pelos criadores concretos de pagar e receber.
    protected abstract LancamentoFinanceiro fabricar();
}
