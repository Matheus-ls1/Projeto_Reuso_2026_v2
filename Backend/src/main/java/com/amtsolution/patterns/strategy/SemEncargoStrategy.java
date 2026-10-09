package com.amtsolution.patterns.strategy;
import java.math.BigDecimal;
import org.springframework.stereotype.Component;
@Component public class SemEncargoStrategy implements CalculoEncargoStrategy { public String nome(){return "SEM_ENCARGO";} public BigDecimal calcular(BigDecimal valor,BigDecimal percentual,int dias){return BigDecimal.ZERO;} }
