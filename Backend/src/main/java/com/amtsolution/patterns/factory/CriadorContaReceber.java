package com.amtsolution.patterns.factory;
import com.amtsolution.model.ContaReceber; import org.springframework.stereotype.Component;
@Component public class CriadorContaReceber extends CriadorLancamentoFinanceiro { protected LancamentoFinanceiro fabricar(){ContaReceber c=new ContaReceber();return ()->c;} }
