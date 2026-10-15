package com.amtsolution.controller;

import java.net.URI;
import java.util.List;
import com.amtsolution.dto.AvisoRequest;
import com.amtsolution.model.Aviso;
import com.amtsolution.service.AvisoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/avisos")
// Expõe o CRUD REST de avisos e delega as regras de criação manual/automática ao serviço.
public class AvisoController {
    private final AvisoService service;

    public AvisoController(AvisoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Aviso> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public Aviso buscar(@PathVariable Long id) {
        return service.buscar(id);
    }

    @PostMapping
    // [FLUXO:AVISO_CRIAR] POST recebido do avisosService; @Valid valida AvisoRequest antes de AvisoService.criar.
    public ResponseEntity<Aviso> criar(@Valid @RequestBody AvisoRequest r) {
        Aviso a = service.criar(r);
        return ResponseEntity.created(URI.create("/api/avisos/" + a.getId())).body(a);
    }

    @PutMapping("/{id}")
    public Aviso atualizar(@PathVariable Long id, @Valid @RequestBody AvisoRequest r) {
        return service.atualizar(id, r);
    }

    @DeleteMapping("/{id}")
    // [FLUXO:AVISO_EXCLUIR] DELETE recebido do ConfirmDialog; delega a exclusão física ao service e responde 204.
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
