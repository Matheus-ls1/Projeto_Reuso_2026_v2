package com.amtsolution.repository;
import com.amtsolution.model.Aviso;
import org.springframework.data.jpa.repository.JpaRepository;
public interface AvisoRepository extends JpaRepository<Aviso, Long> { boolean existsByChaveEvento(String chaveEvento); boolean existsByChaveEventoAndIdNot(String chaveEvento, Long id); }
