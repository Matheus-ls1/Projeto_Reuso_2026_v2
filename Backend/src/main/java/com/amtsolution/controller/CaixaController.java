package com.amtsolution.controller;

import com.amtsolution.dto.AbrirCaixaRequest;
import com.amtsolution.dto.AtualizarMovimentacaoCaixaRequest;
import com.amtsolution.dto.CaixaResponse;
import com.amtsolution.dto.MovimentacaoCaixaRequest;
import com.amtsolution.dto.MovimentacaoCaixaResponse;
import com.amtsolution.service.CaixaService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/caixas")
public class CaixaController {
    private final CaixaService service;

    public CaixaController(CaixaService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<CaixaResponse> abrir(@Valid @RequestBody AbrirCaixaRequest request) {
        CaixaResponse caixa = service.abrir(request);
        return ResponseEntity.created(URI.create("/api/caixas/" + caixa.id())).body(caixa);
    }

    @GetMapping("/aberto")
    public CaixaResponse buscarAberto() {
        return service.buscarAberto();
    }

    @GetMapping("/{id}")
    public CaixaResponse buscar(@PathVariable Long id) {
        return service.buscar(id);
    }

    @PostMapping("/{id}/entradas")
    public ResponseEntity<MovimentacaoCaixaResponse> registrarEntrada(@PathVariable Long id,
            @Valid @RequestBody MovimentacaoCaixaRequest request) {
        MovimentacaoCaixaResponse movimento = service.registrarEntrada(id, request);
        return ResponseEntity.created(URI.create("/api/caixas/movimentacoes/" + movimento.id())).body(movimento);
    }

    @PostMapping("/{id}/saidas")
    public ResponseEntity<MovimentacaoCaixaResponse> registrarSaida(@PathVariable Long id,
            @Valid @RequestBody MovimentacaoCaixaRequest request) {
        MovimentacaoCaixaResponse movimento = service.registrarSaida(id, request);
        return ResponseEntity.created(URI.create("/api/caixas/movimentacoes/" + movimento.id())).body(movimento);
    }

    @GetMapping("/{id}/movimentacoes")
    public List<MovimentacaoCaixaResponse> listarMovimentacoes(@PathVariable Long id) {
        return service.listarMovimentacoes(id);
    }

    @GetMapping("/movimentacoes/{id}")
    public MovimentacaoCaixaResponse buscarMovimentacao(@PathVariable Long id) {
        return service.buscarMovimentacao(id);
    }

    @PutMapping("/movimentacoes/{id}")
    public MovimentacaoCaixaResponse atualizarMovimentacao(@PathVariable Long id,
            @Valid @RequestBody AtualizarMovimentacaoCaixaRequest request) {
        return service.atualizarMovimentacao(id, request);
    }

    @DeleteMapping("/movimentacoes/{id}")
    public ResponseEntity<Void> excluirMovimentacao(@PathVariable Long id) {
        service.excluirMovimentacao(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/fechamento")
    public CaixaResponse fechar(@PathVariable Long id) {
        return service.fechar(id);
    }
}
