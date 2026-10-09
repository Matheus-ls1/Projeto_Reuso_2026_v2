package com.amtsolution.patterns.factory;
import com.amtsolution.model.ContaPagar; import org.springframework.stereotype.Component;
@Component public class CriadorContaPagar extends CriadorLancamentoFinanceiro { protected LancamentoFinanceiro fabricar(){ContaPagar c=new ContaPagar();return ()->c;} }
