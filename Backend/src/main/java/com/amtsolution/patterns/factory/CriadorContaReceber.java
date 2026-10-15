package com.amtsolution.patterns.factory;

import com.amtsolution.model.ContaReceber;
import org.springframework.stereotype.Component;

@Component
// Criador concreto que produz a entidade utilizada pelo cadastro de contas a receber.
public class CriadorContaReceber extends CriadorLancamentoFinanceiro {
    // [PADRAO:FACTORY_FINANCEIRO] Polimorfismo cria ContaReceber e a expõe como LancamentoFinanceiro ao service.
    protected LancamentoFinanceiro fabricar() {
        ContaReceber c = new ContaReceber();
        return () -> c;
    }
}
