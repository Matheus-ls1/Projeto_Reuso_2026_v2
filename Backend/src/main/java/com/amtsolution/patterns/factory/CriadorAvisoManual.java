package com.amtsolution.patterns.factory;
import com.amtsolution.model.Aviso; import org.springframework.stereotype.Component;
// Criador concreto usado pelo serviço quando o aviso é cadastrado manualmente.
@Component public class CriadorAvisoManual extends CriadorAviso { protected Aviso fabricar(){Aviso a=new Aviso();a.setTipo("MANUAL");return a;} }
