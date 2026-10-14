package com.amtsolution.service;

import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.amtsolution.model.ContaPagar;
import com.amtsolution.patterns.observer.*;
import com.amtsolution.repository.ContaPagarRepository;

@Service
// Dispara a verificação periódica/manual de vencimentos próximos sem criar avisos diretamente.
public class VerificadorVencimentosService {
    private final ContaPagarRepository contas;
    private final SujeitoVencimento sujeito;

    public VerificadorVencimentosService(ContaPagarRepository contas, SujeitoVencimento sujeito) {
        this.contas = contas;
        this.sujeito = sujeito;
    }

    @Transactional
    public int verificar() {
        LocalDate hoje = LocalDate.now(), limite = hoje.plusDays(3);
        List<ContaPagar> itens = contas.findBySituacaoInAndVencimentoBetween(List.of("PENDENTE", "VENCIDO"), hoje,
                limite);
        // Cada evento é entregue ao sujeito, que delega a reação ao observador de vencimento.
        itens.forEach(c -> sujeito.publicar(new EventoVencimento(c)));
        return itens.size();
    }
}
