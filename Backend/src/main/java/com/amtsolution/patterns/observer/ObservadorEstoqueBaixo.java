package com.amtsolution.patterns.observer;

import java.time.LocalDate;
import org.springframework.stereotype.Component;
import com.amtsolution.service.AvisoService;

@Component
// Observador concreto que gera aviso quando um produto ativo atinge o estoque mínimo.
public class ObservadorEstoqueBaixo implements ObservadorProduto {
    private final AvisoService avisos;

    public ObservadorEstoqueBaixo(AvisoService avisos) {
        this.avisos = avisos;
    }

    public void atualizar(EventoProduto e) {
        // [PADRAO:OBSERVER_ESTOQUE] Reação concreta: quando ativo e abaixo do mínimo, delega a criação ao AvisoService.
        var p = e.produto();
        // O serviço de avisos valida a chave do evento antes de persistir, evitando duplicidade.
        if (Boolean.TRUE.equals(p.getAtivo()) && p.getQuantidadeEstoque().compareTo(p.getQuantidadeMinima()) <= 0)
            avisos.criarAvisoEstoque(p, LocalDate.now());
    }
}
