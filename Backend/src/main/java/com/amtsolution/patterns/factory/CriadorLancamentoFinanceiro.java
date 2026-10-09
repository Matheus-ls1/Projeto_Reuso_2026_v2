package com.amtsolution.patterns.factory;
public abstract class CriadorLancamentoFinanceiro { public LancamentoFinanceiro criar(){return fabricar();} protected abstract LancamentoFinanceiro fabricar(); }
