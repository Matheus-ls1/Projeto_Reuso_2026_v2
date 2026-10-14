package com.amtsolution.service;

import java.util.List;
import com.amtsolution.dto.AvisoRequest;
import com.amtsolution.exception.ConflictException;
import com.amtsolution.exception.ResourceNotFoundException;
import com.amtsolution.model.Aviso;
import com.amtsolution.model.ContaPagar;
import com.amtsolution.model.Produto;
import com.amtsolution.model.Usuario;
import com.amtsolution.repository.AvisoRepository;
import com.amtsolution.repository.ContaPagarRepository;
import com.amtsolution.repository.ProdutoRepository;
import com.amtsolution.repository.UsuarioRepository;
import com.amtsolution.patterns.factory.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
// Centraliza avisos manuais e automáticos, incluindo a proteção contra eventos duplicados.
public class AvisoService {
    private final AvisoRepository repository;
    private final ProdutoRepository produtos;
    private final ContaPagarRepository contas;
    private final UsuarioRepository usuarios;
    private final CriadorAvisoManual manual;
    private final CriadorAvisoAutomatico automatico;

    public AvisoService(AvisoRepository repository, ProdutoRepository produtos, ContaPagarRepository contas,
            UsuarioRepository usuarios, CriadorAvisoManual manual, CriadorAvisoAutomatico automatico) {
        this.repository = repository;
        this.produtos = produtos;
        this.contas = contas;
        this.usuarios = usuarios;
        this.manual = manual;
        this.automatico = automatico;
    }

    @Transactional(readOnly = true)
    public List<Aviso> listar() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Aviso buscar(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Aviso", id));
    }

    public Aviso criar(AvisoRequest r) {
        // O criador concreto aplica o Factory Method para definir um aviso manual antes da persistência.
        validarChave(r.chaveEvento(), null);
        Aviso a = manual.criar(new DadosAviso(r.titulo(), r.corpo(), r.prioridade(), r.publico(), r.inicio(), r.fim(),
                r.situacao(), r.chaveEvento(), r.produtoOrigemId(), r.contaPagarOrigemId(), r.criadoPorUsuarioId()));
        return repository.save(preencher(a, r));
    }

    public Aviso atualizar(Long id, AvisoRequest r) {
        validarChave(r.chaveEvento(), id);
        return repository.save(preencher(buscar(id), r));
    }

    public void excluir(Long id) {
        repository.delete(buscar(id));
        repository.flush();
    }

    public void criarAvisoEstoque(Produto p, java.time.LocalDate data) {
        String chave = "ESTOQUE:" + p.getId();
        // A chave de evento torna a reação do Observer idempotente para o mesmo produto.
        if (repository.existsByChaveEvento(chave))
            return;
        Aviso a = automatico.criar(new DadosAviso("Estoque baixo: " + p.getNome(),
                "O estoque de " + p.getNome() + " está em " + p.getQuantidadeEstoque() + ", mínimo: "
                        + p.getQuantidadeMinima() + ".",
                "ALTA", "Todos", data, null, "PUBLICADO", chave, p.getId(), null, null));
        a.setProdutoOrigem(p);
        repository.save(a);
    }

    public void criarAvisoVencimento(ContaPagar c, java.time.LocalDate data) {
        String chave = "VENCIMENTO:" + c.getId() + ":" + c.getVencimento();
        // A data de vencimento integra a chave para permitir novo aviso se a conta for reagendada.
        if (repository.existsByChaveEvento(chave))
            return;
        Aviso a = automatico.criarVencimento(
                new DadosAviso("Vencimento próximo: " + c.getDescricao(), "A conta vence em " + c.getVencimento() + ".",
                        "MEDIA", "Todos", data, null, "PUBLICADO", chave, null, c.getId(), null));
        a.setContaPagarOrigem(c);
        repository.save(a);
    }

    private void validarChave(String chave, Long id) {
        if (chave == null || chave.isBlank())
            return;
        boolean existe = id == null ? repository.existsByChaveEvento(chave)
                : repository.existsByChaveEventoAndIdNot(chave, id);
        if (existe)
            throw new ConflictException("Chave de evento já cadastrada.");
    }

    private Aviso preencher(Aviso a, AvisoRequest r) {
        a.setTitulo(r.titulo());
        a.setCorpo(r.corpo());
        a.setTipo(r.tipo());
        a.setPrioridade(r.prioridade());
        a.setPublico(r.publico());
        a.setInicio(r.inicio());
        a.setFim(r.fim());
        a.setSituacao(r.situacao());
        a.setChaveEvento(vazioParaNulo(r.chaveEvento()));
        a.setProdutoOrigem(produto(r.produtoOrigemId()));
        a.setContaPagarOrigem(conta(r.contaPagarOrigemId()));
        a.setCriadoPorUsuario(usuario(r.criadoPorUsuarioId()));
        return a;
    }

    private String vazioParaNulo(String v) {
        return v == null || v.isBlank() ? null : v;
    }

    private Produto produto(Long id) {
        if (id == null)
            return null;
        return produtos.findById(id).orElseThrow(() -> new ResourceNotFoundException("Produto", id));
    }

    private ContaPagar conta(Long id) {
        if (id == null)
            return null;
        return contas.findById(id).orElseThrow(() -> new ResourceNotFoundException("Conta a pagar", id));
    }

    private Usuario usuario(Long id) {
        if (id == null)
            return null;
        return usuarios.findById(id).orElseThrow(() -> new ResourceNotFoundException("Usuário", id));
    }
}
