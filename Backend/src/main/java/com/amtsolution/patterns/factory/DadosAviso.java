package com.amtsolution.patterns.factory;

import java.time.LocalDate;

// Transporta os dados comuns recebidos pelos criadores de aviso.
public record DadosAviso(String titulo, String corpo, String prioridade, String publico, LocalDate inicio,
        LocalDate fim, String situacao, String chaveEvento, Long produtoId, Long contaPagarId, Long usuarioId) {
}
