package com.amtsolution.service;
import java.util.List;
import java.util.Set;
import com.amtsolution.dto.ContaReceberRequest;
import com.amtsolution.exception.ResourceNotFoundException;
import com.amtsolution.model.ContaReceber;
import com.amtsolution.repository.ContaReceberRepository;
import com.amtsolution.patterns.factory.CriadorContaReceber;
import com.amtsolution.patterns.strategy.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @Transactional
public class ContaReceberService {
    private final ContaReceberRepository repository; private final CriadorContaReceber criador; private final ContextoDesconto descontos;
    public ContaReceberService(ContaReceberRepository repository,CriadorContaReceber criador,ContextoDesconto descontos){this.repository=repository;this.criador=criador;this.descontos=descontos;}
    @Transactional(readOnly=true) public List<ContaReceber> listar(){return repository.findAll();}
    @Transactional(readOnly=true) public ContaReceber buscar(Long id){return repository.findById(id).orElseThrow(()->new ResourceNotFoundException("Conta a receber",id));}
    public ContaReceber criar(ContaReceberRequest r){ContaReceber c=(ContaReceber)criador.criar().entidade();return repository.save(preencher(c,r));}
    public ResultadoCalculo simularDesconto(Long id,String estrategia,java.math.BigDecimal parametro,int dias){ContaReceber c=buscar(id);return descontos.simular(estrategia,c.getValorOriginal(),parametro,dias);}
    public ContaReceber atualizar(Long id,ContaReceberRequest r){return repository.save(preencher(buscar(id),r));}
    public ContaReceber atualizarSituacao(Long id,String situacao){if(!Set.of("PENDENTE","RECEBIDO","VENCIDO","CANCELADO").contains(situacao))throw new IllegalArgumentException();ContaReceber c=buscar(id);c.setSituacao(situacao);return repository.save(c);}
    public void excluir(Long id){repository.delete(buscar(id));}
    private ContaReceber preencher(ContaReceber c,ContaReceberRequest r){c.setDescricao(r.descricao());c.setCategoria(r.categoria());c.setCliente(r.cliente());c.setVencimento(r.vencimento());c.setValorOriginal(r.valorOriginal());c.setEstrategiaDesconto(r.estrategiaDesconto());c.setPercentualDesconto(r.percentualDesconto());c.setValorDesconto(r.valorDesconto());c.setSituacao(r.situacao());c.setDataRecebimento(r.dataRecebimento());c.setValorRecebido(r.valorRecebido());c.setFormaRecebimento(r.formaRecebimento());c.setObservacao(r.observacao());return c;}
}
