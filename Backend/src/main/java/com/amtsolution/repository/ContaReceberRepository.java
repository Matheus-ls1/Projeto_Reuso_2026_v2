package com.amtsolution.repository;

import com.amtsolution.model.ContaReceber;
import org.springframework.data.jpa.repository.JpaRepository;

// [INFRA:JPA] Repositório JPA usado por ContaReceberService para as operações persistentes do CRUD.
public interface ContaReceberRepository extends JpaRepository<ContaReceber, Long> {
}
