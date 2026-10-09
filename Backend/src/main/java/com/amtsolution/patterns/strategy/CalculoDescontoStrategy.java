package com.amtsolution.patterns.strategy;
import java.math.BigDecimal;
public interface CalculoDescontoStrategy { String nome(); BigDecimal calcular(BigDecimal valorOriginal, BigDecimal parametro, int dias); }
