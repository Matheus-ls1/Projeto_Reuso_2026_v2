package com.amtsolution.patterns.observer;

import com.amtsolution.model.ContaPagar;

// Mensagem publicada para cada conta pendente ou vencida dentro do período verificado.
public record EventoVencimento(ContaPagar conta) {
}
