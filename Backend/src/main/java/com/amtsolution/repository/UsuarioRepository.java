package com.amtsolution.repository;

import com.amtsolution.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Long id);
}
