package com.amtsolution.patterns.factory;

import com.amtsolution.model.ContaPagar;
import org.springframework.stereotype.Component;

@Component
// Criador concreto que produz a entidade utilizada pelo cadastro de contas a pagar.
public class CriadorContaPagar extends CriadorLancamentoFinanceiro {
    // [PADRAO:FACTORY_FINANCEIRO] Polimorfismo cria ContaPagar e a expõe como LancamentoFinanceiro ao service.
    protected LancamentoFinanceiro fabricar() {
        ContaPagar c = new ContaPagar();
        return () -> c;
    }
}
