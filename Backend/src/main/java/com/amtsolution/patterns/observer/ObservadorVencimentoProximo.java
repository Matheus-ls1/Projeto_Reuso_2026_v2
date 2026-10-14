package com.amtsolution.patterns.observer;

import java.time.LocalDate;
import org.springframework.stereotype.Component;
import com.amtsolution.service.AvisoService;

@Component
// Observador concreto que delega a criação do aviso para contas encontradas no período de vencimento.
public class ObservadorVencimentoProximo implements ObservadorVencimento {
    private final AvisoService avisos;

    public ObservadorVencimentoProximo(AvisoService avisos) {
        this.avisos = avisos;
    }

    public void atualizar(EventoVencimento e) {
        avisos.criarAvisoVencimento(e.conta(), LocalDate.now());
    }
}
