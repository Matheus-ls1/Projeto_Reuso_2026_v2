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

@Service @Transactional
public class UsuarioService {
    private final UsuarioRepository repository; private final PasswordEncoder passwordEncoder;
    public UsuarioService(UsuarioRepository repository,PasswordEncoder passwordEncoder){this.repository=repository;this.passwordEncoder=passwordEncoder;}
    @Transactional(readOnly=true) public List<Usuario> listar(){return repository.findAll();}
    @Transactional(readOnly=true) public Usuario buscar(Long id){return repository.findById(id).orElseThrow(()->new ResourceNotFoundException("Usuário",id));}
    public Usuario criar(UsuarioRequest r){if(repository.existsByEmail(r.email()))throw new ConflictException("E-mail já cadastrado.");return repository.save(preencher(new Usuario(),r));}
    public Usuario atualizar(Long id,UsuarioRequest r){if(repository.existsByEmailAndIdNot(r.email(),id))throw new ConflictException("E-mail já cadastrado.");return repository.save(preencher(buscar(id),r));}
    public void desativar(Long id){Usuario u=buscar(id);u.setAtivo(false);repository.save(u);}
    private Usuario preencher(Usuario u,UsuarioRequest r){u.setNome(r.nome());u.setEmail(r.email());u.setCargo(r.cargo());u.setPerfil(r.perfil());u.setAtivo(r.ativo());if(r.senha()!=null&&!r.senha().isBlank())u.setSenhaHash(passwordEncoder.encode(r.senha()));return u;}
}
