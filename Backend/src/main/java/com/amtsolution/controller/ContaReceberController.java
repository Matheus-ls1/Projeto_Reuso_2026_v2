package com.amtsolution.controller;
import java.net.URI;
import java.util.List;
import com.amtsolution.dto.ContaReceberRequest;
import com.amtsolution.dto.SituacaoRequest;
import com.amtsolution.model.ContaReceber;
import com.amtsolution.service.ContaReceberService;
import com.amtsolution.patterns.strategy.ResultadoCalculo;
import java.math.BigDecimal;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/contas-receber")
public class ContaReceberController {
    private final ContaReceberService service; public ContaReceberController(ContaReceberService service){this.service=service;}
    @GetMapping public List<ContaReceber> listar(){return service.listar();}
    @GetMapping("/{id}") public ContaReceber buscar(@PathVariable Long id){return service.buscar(id);}
    @PostMapping public ResponseEntity<ContaReceber> criar(@Valid @RequestBody ContaReceberRequest r){ContaReceber c=service.criar(r);return ResponseEntity.created(URI.create("/api/contas-receber/"+c.getId())).body(c);}
    @PutMapping("/{id}") public ContaReceber atualizar(@PathVariable Long id,@Valid @RequestBody ContaReceberRequest r){return service.atualizar(id,r);}
    @PatchMapping("/{id}/situacao") public ContaReceber situacao(@PathVariable Long id,@Valid @RequestBody SituacaoRequest r){return service.atualizarSituacao(id,r.situacao());}
    @GetMapping("/{id}/simulacao-descontos") public ResultadoCalculo simular(@PathVariable Long id,@RequestParam String estrategia,@RequestParam(required=false) BigDecimal parametro,@RequestParam(defaultValue="0") int dias){return service.simularDesconto(id,estrategia,parametro,dias);}
    @DeleteMapping("/{id}") public ResponseEntity<Void> excluir(@PathVariable Long id){service.excluir(id);return ResponseEntity.noContent().build();}
}
