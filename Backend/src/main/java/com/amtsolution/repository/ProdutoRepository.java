package com.amtsolution.repository;

import com.amtsolution.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

// [INFRA:JPA] ProdutoService usa este JpaRepository para CRUD e verificação de código único.
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    boolean existsByCodigo(String codigo);

    boolean existsByCodigoAndIdNot(String codigo, Long id);
}
