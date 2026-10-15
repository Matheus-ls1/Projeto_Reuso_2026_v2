package com.amtsolution.service;

import java.util.List;
import java.util.Set;
import com.amtsolution.dto.ContaPagarRequest;
import com.amtsolution.exception.ResourceNotFoundException;
import com.amtsolution.model.ContaPagar;
import com.amtsolution.model.Fornecedor;
import com.amtsolution.repository.ContaPagarRepository;
import com.amtsolution.repository.FornecedorRepository;
import com.amtsolution.repository.AvisoRepository;
import com.amtsolution.exception.ConflictException;
import com.amtsolution.patterns.factory.CriadorContaPagar;
import com.amtsolution.patterns.strategy.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
// Reúne persistência de contas a pagar, criação por fábrica e simulações de encargos.
public class ContaPagarService {
    private final ContaPagarRepository repository;
    private final FornecedorRepository fornecedores;
    private final AvisoRepository avisos;
    private final CriadorContaPagar criador;
    private final ContextoEncargo encargos;

    public ContaPagarService(ContaPagarRepository repository, FornecedorRepository fornecedores, AvisoRepository avisos,
            CriadorContaPagar criador, ContextoEncargo encargos) {
        this.repository = repository;
        this.fornecedores = fornecedores;
        this.avisos = avisos;
        this.criador = criador;
        this.encargos = encargos;
    }

    @Transactional(readOnly = true)
    public List<ContaPagar> listar() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public ContaPagar buscar(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Conta a pagar", id));
    }

    public ContaPagar criar(ContaPagarRequest r) {
        // [FLUXO:PAGAR_CRIAR] Controller validado chama este método; fábrica cria a entidade e ContaPagarRepository a persiste.
        // [PADRAO:FACTORY_FINANCEIRO] CriadorLancamentoFinanceiro delega fabricar() a CriadorContaPagar e devolve LancamentoFinanceiro.
        // A fábrica fornece a entidade concreta e evita que o serviço conheça a criação do lançamento.
        ContaPagar c = (ContaPagar) criador.criar().entidade();
        return repository.save(preencher(c, r));
    }

    public ResultadoCalculo simularEncargos(Long id, String estrategia, java.math.BigDecimal percentual, int dias) {
        // [PADRAO:STRATEGY_ENCARGOS] Controller chama a simulação; ContextoEncargo seleciona e executa a implementação pelo nome.
        // [FLUXO:PAGAR_ENCARGOS] Busca a conta no repository e devolve ResultadoCalculo ao frontend, sem save.
        ContaPagar c = buscar(id);
        // O contexto seleciona a Strategy pelo nome sem alterar o valor armazenado na conta.
        return encargos.simular(estrategia, c.getValorOriginal(), percentual, dias);
    }

    public ContaPagar atualizar(Long id, ContaPagarRequest r) {
        return repository.save(preencher(buscar(id), r));
    }

    public ContaPagar atualizarSituacao(Long id, String situacao) {
        // [FLUXO:PAGAR_CRIAR] PATCH valida a situação permitida e persiste somente a alteração de estado.
        if (!Set.of("PENDENTE", "PAGO", "VENCIDO", "CANCELADO").contains(situacao))
            throw new IllegalArgumentException();
        ContaPagar c = buscar(id);
        c.setSituacao(situacao);
        return repository.save(c);
    }

    public void excluir(Long id) {
        // [FLUXO:PAGAR_EXCLUIR] Antes do delete, consulta AvisoRepository para preservar referências de avisos automáticos.
        ContaPagar c = buscar(id);
        // Mantém a integridade de avisos que registram a origem financeira do evento.
        if (avisos.existsByContaPagarOrigem_Id(id))
            throw new ConflictException(
                    "Não é possível excluir esta conta a pagar porque existem avisos vinculados a ela.");
        repository.delete(c);
        repository.flush();
    }

    private ContaPagar preencher(ContaPagar c, ContaPagarRequest r) {
        c.setDescricao(r.descricao());
        c.setCategoria(r.categoria());
        c.setFornecedor(fornecedor(r.fornecedorId()));
        c.setVencimento(r.vencimento());
        c.setValorOriginal(r.valorOriginal());
        c.setEstrategiaEncargo(r.estrategiaEncargo());
        c.setPercentualJuros(r.percentualJuros());
        c.setPercentualMulta(r.percentualMulta());
        c.setValorEncargos(r.valorEncargos());
        c.setSituacao(r.situacao());
        c.setDataPagamento(r.dataPagamento());
        c.setValorPago(r.valorPago());
        c.setFormaPagamento(r.formaPagamento());
        c.setObservacao(r.observacao());
        return c;
    }

    private Fornecedor fornecedor(Long id) {
        if (id == null)
            return null;
        return fornecedores.findById(id).orElseThrow(() -> new ResourceNotFoundException("Fornecedor", id));
    }
}
