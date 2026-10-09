package com.amtsolution.patterns.factory;
import com.amtsolution.model.Aviso; import org.springframework.stereotype.Component;
@Component public class CriadorAvisoManual extends CriadorAviso { protected Aviso fabricar(){Aviso a=new Aviso();a.setTipo("MANUAL");return a;} }
