package com.amtsolution.patterns.strategy;
import java.math.BigDecimal;
public interface CalculoEncargoStrategy { String nome(); BigDecimal calcular(BigDecimal valorOriginal, BigDecimal percentual, int dias); }
