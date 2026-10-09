package com.amtsolution.patterns.strategy;
import java.math.*; import org.springframework.stereotype.Component;
@Component public class DescontoPercentualStrategy implements CalculoDescontoStrategy { public String nome(){return "PERCENTUAL";} public BigDecimal calcular(BigDecimal v,BigDecimal p,int d){if(v==null||v.signum()<0||p==null||p.signum()<0||d<0)throw new IllegalArgumentException("Valores de desconto inválidos.");return v.multiply(p).divide(BigDecimal.valueOf(100),2,RoundingMode.HALF_UP).min(v);} }
