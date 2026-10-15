package com.amtsolution.repository;

import com.amtsolution.model.Aviso;
import org.springframework.data.jpa.repository.JpaRepository;

// Consultas derivadas usadas para garantir unicidade de eventos e proteger relações de origem.
// [INFRA:JPA] JpaRepository persiste Aviso; as consultas derivadas abaixo protegem chaves e relações de origem.
public interface AvisoRepository extends JpaRepository<Aviso, Long> {
    boolean existsByChaveEvento(String chaveEvento);

    boolean existsByChaveEventoAndIdNot(String chaveEvento, Long id);

    boolean existsByProdutoOrigem_Id(Long produtoId);

    boolean existsByContaPagarOrigem_Id(Long contaPagarId);
}
