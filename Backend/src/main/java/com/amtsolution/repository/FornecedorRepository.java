package com.amtsolution.repository;

import com.amtsolution.model.Fornecedor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FornecedorRepository extends JpaRepository<Fornecedor, Long> {
    boolean existsByDocumento(String documento);

    boolean existsByDocumentoAndIdNot(String documento, Long id);
}
