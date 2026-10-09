package com.amtsolution.repository;
import com.amtsolution.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ProdutoRepository extends JpaRepository<Produto, Long> { boolean existsByCodigo(String codigo); boolean existsByCodigoAndIdNot(String codigo, Long id); }
