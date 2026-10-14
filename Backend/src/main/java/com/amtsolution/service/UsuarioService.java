package com.amtsolution.service;

import java.util.List;
import com.amtsolution.dto.UsuarioRequest;
import com.amtsolution.exception.ConflictException;
import com.amtsolution.exception.ResourceNotFoundException;
import com.amtsolution.model.Usuario;
import com.amtsolution.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
// Mantém usuários e garante que senhas recebidas nunca sejam persistidas em texto puro.
public class UsuarioService {
    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<Usuario> listar() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Usuario buscar(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Usuário", id));
    }

    public Usuario criar(UsuarioRequest r) {
        if (repository.existsByEmail(r.email()))
            throw new ConflictException("E-mail já cadastrado.");
        return repository.save(preencher(new Usuario(), r));
    }

    public Usuario atualizar(Long id, UsuarioRequest r) {
        if (repository.existsByEmailAndIdNot(r.email(), id))
            throw new ConflictException("E-mail já cadastrado.");
        return repository.save(preencher(buscar(id), r));
    }

    public Usuario alterarAtivo(Long id, Boolean ativo) {
        Usuario u = buscar(id);
        u.setAtivo(ativo);
        return repository.save(u);
    }

    public void excluir(Long id) {
        repository.delete(buscar(id));
        repository.flush();
    }

    private Usuario preencher(Usuario u, UsuarioRequest r) {
        u.setNome(r.nome());
        u.setEmail(r.email());
        u.setCargo(r.cargo());
        u.setPerfil(r.perfil());
        u.setAtivo(r.ativo());
        // Na atualização, a senha só é substituída quando o formulário a envia preenchida.
        if (r.senha() != null && !r.senha().isBlank())
            u.setSenhaHash(passwordEncoder.encode(r.senha()));
        return u;
    }
}
