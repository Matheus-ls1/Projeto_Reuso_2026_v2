package com.amtsolution.controller;
import java.net.URI;
import java.util.List;
import com.amtsolution.dto.FornecedorRequest;
import com.amtsolution.model.Fornecedor;
import com.amtsolution.service.FornecedorService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/fornecedores")
public class FornecedorController {
    private final FornecedorService service; public FornecedorController(FornecedorService service){this.service=service;}
    @GetMapping public List<Fornecedor> listar(){return service.listar();}
    @GetMapping("/{id}") public Fornecedor buscar(@PathVariable Long id){return service.buscar(id);}
    @PostMapping public ResponseEntity<Fornecedor> criar(@Valid @RequestBody FornecedorRequest r){Fornecedor f=service.criar(r);return ResponseEntity.created(URI.create("/api/fornecedores/"+f.getId())).body(f);}
    @PutMapping("/{id}") public Fornecedor atualizar(@PathVariable Long id,@Valid @RequestBody FornecedorRequest r){return service.atualizar(id,r);}
    @DeleteMapping("/{id}") public ResponseEntity<Void> desativar(@PathVariable Long id){service.desativar(id);return ResponseEntity.noContent().build();}
}
