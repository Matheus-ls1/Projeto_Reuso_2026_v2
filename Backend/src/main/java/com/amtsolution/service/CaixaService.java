package com.amtsolution.service;

import com.amtsolution.databasefirst.mapper.CaixaConsultaMapper;
import com.amtsolution.dto.AbrirCaixaRequest;
import com.amtsolution.dto.AtualizarMovimentacaoCaixaRequest;
import com.amtsolution.dto.CaixaResponse;
import com.amtsolution.dto.MovimentacaoCaixaRequest;
import com.amtsolution.dto.MovimentacaoCaixaResponse;
import com.amtsolution.exception.ConflictException;
import com.amtsolution.exception.ResourceNotFoundException;
import com.amtsolutions.databasefirst.mapper.CaixaGeradoMapper;
import com.amtsolutions.databasefirst.mapper.MovimentacaoCaixaGeradaMapper;
import com.amtsolutions.databasefirst.model.CaixaGerado;
import com.amtsolutions.databasefirst.model.MovimentacaoCaixaGerada;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CaixaService {
    private final CaixaGeradoMapper caixas;
    private final MovimentacaoCaixaGeradaMapper movimentacoes;
    private final CaixaConsultaMapper consultas;

    public CaixaService(CaixaGeradoMapper caixas, MovimentacaoCaixaGeradaMapper movimentacoes,
            CaixaConsultaMapper consultas) {
        this.caixas = caixas;
        this.movimentacoes = movimentacoes;
        this.consultas = consultas;
    }

    @Transactional(transactionManager = "caixaTransactionManager")
    public CaixaResponse abrir(AbrirCaixaRequest request) {
        if (consultas.buscarAbertoParaAtualizacao() != null)
            throw new ConflictException("Já existe um caixa aberto.");
        LocalDateTime agora = LocalDateTime.now();
        CaixaGerado caixa = new CaixaGerado();
        caixa.setAbertoEm(agora);
        caixa.setSaldoInicial(request.saldoInicial());
        caixa.setSituacao("ABERTO");
        caixa.setCriadoEm(agora);
        caixa.setAtualizadoEm(agora);
        caixas.insert(caixa);
        return resposta(caixa, caixa.getSaldoInicial());
    }

    @Transactional(transactionManager = "caixaTransactionManager", readOnly = true)
    public CaixaResponse buscar(Long id) {
        CaixaGerado caixa = buscarGerado(id);
        return resposta(caixa, saldoAtual(caixa));
    }

    @Transactional(transactionManager = "caixaTransactionManager", readOnly = true)
    public CaixaResponse buscarAberto() {
        CaixaGerado caixa = consultas.buscarAberto();
        if (caixa == null)
            throw new ResourceNotFoundException("Caixa aberto", 0L);
        return resposta(caixa, saldoAtual(caixa));
    }

    @Transactional(transactionManager = "caixaTransactionManager")
    public MovimentacaoCaixaResponse registrarEntrada(Long caixaId, MovimentacaoCaixaRequest request) {
        return registrar(caixaId, "ENTRADA", request);
    }

    @Transactional(transactionManager = "caixaTransactionManager")
    public MovimentacaoCaixaResponse registrarSaida(Long caixaId, MovimentacaoCaixaRequest request) {
        return registrar(caixaId, "SAIDA", request);
    }

    @Transactional(transactionManager = "caixaTransactionManager", readOnly = true)
    public List<MovimentacaoCaixaResponse> listarMovimentacoes(Long caixaId) {
        buscarGerado(caixaId);
        return consultas.listarPorCaixa(caixaId).stream().map(this::resposta).toList();
    }

    @Transactional(transactionManager = "caixaTransactionManager", readOnly = true)
    public MovimentacaoCaixaResponse buscarMovimentacao(Long id) {
        return resposta(buscarMovimentacaoGerada(id));
    }

    @Transactional(transactionManager = "caixaTransactionManager")
    public MovimentacaoCaixaResponse atualizarMovimentacao(Long id, AtualizarMovimentacaoCaixaRequest request) {
        MovimentacaoCaixaGerada movimento = buscarMovimentacaoGerada(id);
        garantirAbertoParaAtualizacao(movimento.getCaixaId());
        movimento.setTipo(request.tipo());
        movimento.setValor(request.valor());
        movimento.setDescricao(request.descricao());
        if (request.ocorridoEm() != null)
            movimento.setOcorridoEm(request.ocorridoEm());
        movimento.setAtualizadoEm(LocalDateTime.now());
        movimentacoes.updateByPrimaryKey(movimento);
        return resposta(movimento);
    }

    @Transactional(transactionManager = "caixaTransactionManager")
    public void excluirMovimentacao(Long id) {
        MovimentacaoCaixaGerada movimento = buscarMovimentacaoGerada(id);
        garantirAbertoParaAtualizacao(movimento.getCaixaId());
        movimentacoes.deleteByPrimaryKey(id);
    }

    @Transactional(transactionManager = "caixaTransactionManager")
    public CaixaResponse fechar(Long id) {
        CaixaGerado caixa = garantirAbertoParaAtualizacao(id);
        BigDecimal saldo = saldoAtual(caixa);
        LocalDateTime agora = LocalDateTime.now();
        caixa.setSaldoFinal(saldo);
        caixa.setFechadoEm(agora);
        caixa.setSituacao("FECHADO");
        caixa.setAtualizadoEm(agora);
        caixas.updateByPrimaryKey(caixa);
        return resposta(caixa, saldo);
    }

    private MovimentacaoCaixaResponse registrar(Long caixaId, String tipo, MovimentacaoCaixaRequest request) {
        garantirAbertoParaAtualizacao(caixaId);
        LocalDateTime agora = LocalDateTime.now();
        MovimentacaoCaixaGerada movimento = new MovimentacaoCaixaGerada();
        movimento.setCaixaId(caixaId);
        movimento.setTipo(tipo);
        movimento.setValor(request.valor());
        movimento.setDescricao(request.descricao());
        movimento.setOcorridoEm(agora);
        movimento.setCriadoEm(agora);
        movimento.setAtualizadoEm(agora);
        movimentacoes.insert(movimento);
        return resposta(movimento);
    }

    private CaixaGerado garantirAbertoParaAtualizacao(Long id) {
        CaixaGerado caixa = consultas.buscarPorIdParaAtualizacao(id);
        if (caixa == null)
            throw new ResourceNotFoundException("Caixa", id);
        if (!"ABERTO".equals(caixa.getSituacao()))
            throw new ConflictException("O caixa está fechado.");
        return caixa;
    }

    private CaixaGerado buscarGerado(Long id) {
        CaixaGerado caixa = caixas.selectByPrimaryKey(id);
        if (caixa == null)
            throw new ResourceNotFoundException("Caixa", id);
        return caixa;
    }

    private MovimentacaoCaixaGerada buscarMovimentacaoGerada(Long id) {
        MovimentacaoCaixaGerada movimento = movimentacoes.selectByPrimaryKey(id);
        if (movimento == null)
            throw new ResourceNotFoundException("Movimentação de caixa", id);
        return movimento;
    }

    private BigDecimal saldoAtual(CaixaGerado caixa) {
        return consultas.listarPorCaixa(caixa.getId()).stream().map(m ->
                "ENTRADA".equals(m.getTipo()) ? m.getValor() : m.getValor().negate())
                .reduce(caixa.getSaldoInicial(), BigDecimal::add);
    }

    private CaixaResponse resposta(CaixaGerado caixa, BigDecimal saldoAtual) {
        return new CaixaResponse(caixa.getId(), caixa.getAbertoEm(), caixa.getFechadoEm(),
                caixa.getSaldoInicial(), caixa.getSaldoFinal(), saldoAtual, caixa.getSituacao());
    }

    private MovimentacaoCaixaResponse resposta(MovimentacaoCaixaGerada movimento) {
        return new MovimentacaoCaixaResponse(movimento.getId(), movimento.getCaixaId(), movimento.getTipo(),
                movimento.getValor(), movimento.getDescricao(), movimento.getOcorridoEm());
    }
}
