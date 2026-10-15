package com.amtsolution.controller;

import java.net.URI;
import java.util.List;
import com.amtsolution.dto.ProdutoRequest;
import com.amtsolution.dto.AtivoRequest;
import com.amtsolution.model.Produto;
import com.amtsolution.service.ProdutoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/produtos")
// Expõe o CRUD de produtos e insumos, cuja persistência também pode publicar evento de estoque.
public class ProdutoController {
    private final ProdutoService service;

    public ProdutoController(ProdutoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Produto> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public Produto buscar(@PathVariable Long id) {
        return service.buscar(id);
    }

    @PostMapping
    // [FLUXO:PRODUTO_ESTOQUE] POST valida ProdutoRequest e chama ProdutoService, que pode publicar o evento de estoque.
    public ResponseEntity<Produto> criar(@Valid @RequestBody ProdutoRequest r) {
        Produto p = service.criar(r);
        return ResponseEntity.created(URI.create("/api/produtos/" + p.getId())).body(p);
    }

    @PutMapping("/{id}")
    // [FLUXO:PRODUTO_ESTOQUE] Atualização segue o mesmo service e pode disparar nova verificação pelos observadores.
    public Produto atualizar(@PathVariable Long id, @Valid @RequestBody ProdutoRequest r) {
        return service.atualizar(id, r);
    }

    @PatchMapping("/{id}/ativo")
    // A ativação/desativação é uma operação específica e não remove o registro.
    public Produto alterarAtivo(@PathVariable Long id, @Valid @RequestBody AtivoRequest r) {
        return service.alterarAtivo(id, r.ativo());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
