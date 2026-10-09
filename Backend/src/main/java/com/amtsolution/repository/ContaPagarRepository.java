package com.amtsolution.repository;
import com.amtsolution.model.ContaPagar;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ContaPagarRepository extends JpaRepository<ContaPagar, Long> { List<ContaPagar> findBySituacaoInAndVencimentoBetween(Collection<String> situacoes, LocalDate inicio, LocalDate fim); }
