package com.amtsolution.controller;
import java.net.URI;
import java.util.List;
import com.amtsolution.dto.ContaPagarRequest;
import com.amtsolution.dto.SituacaoRequest;
import com.amtsolution.model.ContaPagar;
import com.amtsolution.service.ContaPagarService;
import com.amtsolution.service.VerificadorVencimentosService;
import com.amtsolution.patterns.strategy.ResultadoCalculo;
import java.math.BigDecimal;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/contas-pagar")
public class ContaPagarController {
    private final ContaPagarService service; private final VerificadorVencimentosService vencimentos; public ContaPagarController(ContaPagarService service,VerificadorVencimentosService vencimentos){this.service=service;this.vencimentos=vencimentos;}
    @GetMapping public List<ContaPagar> listar(){return service.listar();}
    @GetMapping("/{id}") public ContaPagar buscar(@PathVariable Long id){return service.buscar(id);}
    @PostMapping public ResponseEntity<ContaPagar> criar(@Valid @RequestBody ContaPagarRequest r){ContaPagar c=service.criar(r);return ResponseEntity.created(URI.create("/api/contas-pagar/"+c.getId())).body(c);}
    @PutMapping("/{id}") public ContaPagar atualizar(@PathVariable Long id,@Valid @RequestBody ContaPagarRequest r){return service.atualizar(id,r);}
    @PatchMapping("/{id}/situacao") public ContaPagar situacao(@PathVariable Long id,@Valid @RequestBody SituacaoRequest r){return service.atualizarSituacao(id,r.situacao());}
    @GetMapping("/{id}/simulacao-encargos") public ResultadoCalculo simular(@PathVariable Long id,@RequestParam String estrategia,@RequestParam(required=false) BigDecimal percentual,@RequestParam(defaultValue="0") int dias){return service.simularEncargos(id,estrategia,percentual,dias);}
    @PostMapping("/verificar-vencimentos") public java.util.Map<String,Integer> verificarVencimentos(){return java.util.Map.of("contasVerificadas",vencimentos.verificar());}
    @DeleteMapping("/{id}") public ResponseEntity<Void> excluir(@PathVariable Long id){service.excluir(id);return ResponseEntity.noContent().build();}
}
