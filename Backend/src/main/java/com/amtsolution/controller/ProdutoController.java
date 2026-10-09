package com.amtsolution.controller;
import java.net.URI;
import java.util.List;
import com.amtsolution.dto.ProdutoRequest;
import com.amtsolution.model.Produto;
import com.amtsolution.service.ProdutoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/produtos")
public class ProdutoController {
    private final ProdutoService service; public ProdutoController(ProdutoService service){this.service=service;}
    @GetMapping public List<Produto> listar(){return service.listar();}
    @GetMapping("/{id}") public Produto buscar(@PathVariable Long id){return service.buscar(id);}
    @PostMapping public ResponseEntity<Produto> criar(@Valid @RequestBody ProdutoRequest r){Produto p=service.criar(r);return ResponseEntity.created(URI.create("/api/produtos/"+p.getId())).body(p);}
    @PutMapping("/{id}") public Produto atualizar(@PathVariable Long id,@Valid @RequestBody ProdutoRequest r){return service.atualizar(id,r);}
    @DeleteMapping("/{id}") public ResponseEntity<Void> desativar(@PathVariable Long id){service.desativar(id);return ResponseEntity.noContent().build();}
}
