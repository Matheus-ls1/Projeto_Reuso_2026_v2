package com.amtsolution.patterns.observer;
import java.time.LocalDate; import org.springframework.stereotype.Component; import com.amtsolution.service.AvisoService;
@Component public class ObservadorEstoqueBaixo implements ObservadorProduto { private final AvisoService avisos; public ObservadorEstoqueBaixo(AvisoService avisos){this.avisos=avisos;} public void atualizar(EventoProduto e){var p=e.produto();if(Boolean.TRUE.equals(p.getAtivo())&&p.getQuantidadeEstoque().compareTo(p.getQuantidadeMinima())<=0)avisos.criarAvisoEstoque(p,LocalDate.now());} }
