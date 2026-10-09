package com.amtsolution.patterns.factory;
import com.amtsolution.model.Aviso; import org.springframework.stereotype.Component;
@Component public class CriadorAvisoAutomatico extends CriadorAviso { protected Aviso fabricar(){Aviso a=new Aviso();a.setTipo("ESTOQUE_BAIXO");return a;} public Aviso criarVencimento(DadosAviso dados){Aviso a=criar(dados);a.setTipo("VENCIMENTO_PROXIMO");return a;} }
