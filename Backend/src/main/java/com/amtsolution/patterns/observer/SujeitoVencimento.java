package com.amtsolution.patterns.observer;

import java.util.List;
import org.springframework.stereotype.Component;

@Component
// Sujeito do Observer responsável por disseminar eventos de contas próximas do vencimento.
public class SujeitoVencimento {
    private final List<ObservadorVencimento> observadores;

    public SujeitoVencimento(List<ObservadorVencimento> observadores) {
        this.observadores = observadores;
    }

    public void publicar(EventoVencimento evento) {
        // [PADRAO:OBSERVER_VENCIMENTO] VerificadorVencimentosService publica e este sujeito notifica os observadores.
        observadores.forEach(o -> o.atualizar(evento));
    }
}
