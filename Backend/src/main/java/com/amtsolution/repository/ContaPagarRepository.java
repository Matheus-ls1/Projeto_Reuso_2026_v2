package com.amtsolution.repository;

import com.amtsolution.model.ContaPagar;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

// Consulta as contas em situações monitoradas dentro da janela de vencimento do Observer.
// [INFRA:JPA] Além do CRUD, VerificadorVencimentosService usa a consulta derivada por situação e período.
public interface ContaPagarRepository extends JpaRepository<ContaPagar, Long> {
    List<ContaPagar> findBySituacaoInAndVencimentoBetween(Collection<String> situacoes, LocalDate inicio,
            LocalDate fim);
}
