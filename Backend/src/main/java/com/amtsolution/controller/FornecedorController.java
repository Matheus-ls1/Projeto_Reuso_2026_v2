package com.amtsolution.controller;

import java.net.URI;
import java.util.List;
import com.amtsolution.dto.FornecedorRequest;
import com.amtsolution.dto.AtivoRequest;
import com.amtsolution.model.Fornecedor;
import com.amtsolution.service.FornecedorService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fornecedores")
// Expõe operações REST para fornecedores, inclusive a alteração independente do status ativo.
public class FornecedorController {
    private final FornecedorService service;

    public FornecedorController(FornecedorService service) {
        this.service = service;
    }

    @GetMapping
    public List<Fornecedor> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public Fornecedor buscar(@PathVariable Long id) {
        return service.buscar(id);
    }

    @PostMapping
    // [FLUXO:FORNECEDOR_CRIAR] POST valida FornecedorRequest e encaminha o novo cadastro ao FornecedorService.
    public ResponseEntity<Fornecedor> criar(@Valid @RequestBody FornecedorRequest r) {
        Fornecedor f = service.criar(r);
        return ResponseEntity.created(URI.create("/api/fornecedores/" + f.getId())).body(f);
    }

    @PutMapping("/{id}")
    public Fornecedor atualizar(@PathVariable Long id, @Valid @RequestBody FornecedorRequest r) {
        return service.atualizar(id, r);
    }

    @PatchMapping("/{id}/ativo")
    // [FLUXO:FORNECEDOR_DESATIVAR] PATCH altera o status; é diferente do DELETE permanente abaixo.
    // Esta rota modifica somente a disponibilidade do cadastro; não executa exclusão física.
    public Fornecedor alterarAtivo(@PathVariable Long id, @Valid @RequestBody AtivoRequest r) {
        return service.alterarAtivo(id, r.ativo());
    }

    @DeleteMapping("/{id}")
    // [FLUXO:FORNECEDOR_EXCLUIR] DELETE solicita remoção física ao service.
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
