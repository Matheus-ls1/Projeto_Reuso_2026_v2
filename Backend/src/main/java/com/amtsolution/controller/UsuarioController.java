package com.amtsolution.controller;
import java.net.URI;
import java.util.List;
import com.amtsolution.dto.UsuarioRequest;
import com.amtsolution.model.Usuario;
import com.amtsolution.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/usuarios")
public class UsuarioController {
    private final UsuarioService service; public UsuarioController(UsuarioService service){this.service=service;}
    @GetMapping public List<Usuario> listar(){return service.listar();}
    @GetMapping("/{id}") public Usuario buscar(@PathVariable Long id){return service.buscar(id);}
    @PostMapping public ResponseEntity<Usuario> criar(@Valid @RequestBody UsuarioRequest r){Usuario u=service.criar(r);return ResponseEntity.created(URI.create("/api/usuarios/"+u.getId())).body(u);}
    @PutMapping("/{id}") public Usuario atualizar(@PathVariable Long id,@Valid @RequestBody UsuarioRequest r){return service.atualizar(id,r);}
    @DeleteMapping("/{id}") public ResponseEntity<Void> desativar(@PathVariable Long id){service.desativar(id);return ResponseEntity.noContent().build();}
}
