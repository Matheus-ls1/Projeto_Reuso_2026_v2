package com.amtsolution.patterns;

import static org.junit.jupiter.api.Assertions.*;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;
import com.amtsolution.patterns.strategy.*;
import com.amtsolution.patterns.factory.*;
import com.amtsolution.model.*;

class PadroesTest {
    @Test void strategyEncargosCalculaSemMultaEJurosDiarios() {
        assertEquals(new BigDecimal("0"), new SemEncargoStrategy().calcular(new BigDecimal("100"), BigDecimal.TEN, 2));
        assertEquals(new BigDecimal("10.00"), new MultaPercentualStrategy().calcular(new BigDecimal("100"), BigDecimal.TEN, 0));
        assertEquals(new BigDecimal("20.00"), new JurosDiariosStrategy().calcular(new BigDecimal("100"), BigDecimal.TEN, 2));
    }
    @Test void strategyDescontosNuncaUltrapassaValorOriginal() {
        assertEquals(new BigDecimal("10.00"), new DescontoPercentualStrategy().calcular(new BigDecimal("100"), BigDecimal.TEN, 0));
        assertEquals(new BigDecimal("100.00"), new DescontoValorFixoStrategy().calcular(new BigDecimal("100"), new BigDecimal("150"), 0));
    }
    @Test void factoryDeAvisosDefineOrigemCorreta() {
        DadosAviso dados=new DadosAviso("t","c","MEDIA","Todos",java.time.LocalDate.now(),null,"PUBLICADO","x",null,null,null);
        assertEquals("MANUAL",new CriadorAvisoManual().criar(dados).getTipo());
        assertEquals("ESTOQUE_BAIXO",new CriadorAvisoAutomatico().criar(dados).getTipo());
    }
    @Test void factoryFinanceiraCriaEntidadesDistintas() {
        assertTrue(new CriadorContaPagar().criar().entidade() instanceof ContaPagar);
        assertTrue(new CriadorContaReceber().criar().entidade() instanceof ContaReceber);
    }
}
