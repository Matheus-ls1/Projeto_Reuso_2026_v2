package com.amtsolution.service;

import java.util.List;
import com.amtsolution.dto.ProdutoRequest;
import com.amtsolution.exception.ConflictException;
import com.amtsolution.exception.ResourceNotFoundException;
import com.amtsolution.model.Fornecedor;
import com.amtsolution.model.Produto;
import com.amtsolution.repository.FornecedorRepository;
import com.amtsolution.repository.AvisoRepository;
import com.amtsolution.repository.ProdutoRepository;
import com.amtsolution.patterns.observer.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
// Implementa as regras de cadastro de produtos e publica eventos de estoque para os observadores.
public class ProdutoService {
    private final ProdutoRepository repository;
    private final FornecedorRepository fornecedores;
    private final AvisoRepository avisos;
    private final SujeitoProduto sujeito;

    public ProdutoService(ProdutoRepository repository, FornecedorRepository fornecedores, AvisoRepository avisos,
            SujeitoProduto sujeito) {
        this.repository = repository;
        this.fornecedores = fornecedores;
        this.avisos = avisos;
        this.sujeito = sujeito;
    }

    @Transactional(readOnly = true)
    public List<Produto> listar() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Produto buscar(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Produto", id));
    }

    public Produto criar(ProdutoRequest r) {
        // [FLUXO:PRODUTO_ESTOQUE] Controller chama este método; valida código, salva em ProdutoRepository e publica EventoProduto.
        // [PADRAO:OBSERVER_ESTOQUE] O sujeito notifica ObservadorEstoqueBaixo sem o service conhecer a regra de criação de aviso.
        if (repository.existsByCodigo(r.codigo()))
            throw new ConflictException("Código já cadastrado.");
        Produto p = repository.save(preencher(new Produto(), r));
        // Após persistir, o sujeito notifica observadores sem acoplar o serviço à regra de aviso.
        sujeito.publicar(new EventoProduto(p));
        return p;
    }

    public Produto atualizar(Long id, ProdutoRequest r) {
        // [FLUXO:PRODUTO_ESTOQUE] Atualização valida unicidade, persiste e republica o evento para reavaliar o estoque.
        if (repository.existsByCodigoAndIdNot(r.codigo(), id))
            throw new ConflictException("Código já cadastrado.");
        Produto p = repository.save(preencher(buscar(id), r));
        sujeito.publicar(new EventoProduto(p));
        return p;
    }

    public Produto alterarAtivo(Long id, Boolean ativo) {
        // [FLUXO:PRODUTO_DESATIVAR] Diferente de excluir: mantém o registro e muda somente o campo ativo.
        Produto p = buscar(id);
        p.setAtivo(ativo);
        return repository.save(p);
    }

    public void excluir(Long id) {
        // [FLUXO:PRODUTO_EXCLUIR] Exclusão física só ocorre se AvisoRepository não encontrar histórico referenciando o produto.
        Produto p = buscar(id);
        // Impede exclusão física quando um aviso histórico ainda referencia o produto.
        if (avisos.existsByProdutoOrigem_Id(id))
            throw new ConflictException("Não é possível excluir este produto porque existem avisos vinculados a ele.");
        repository.delete(p);
        repository.flush();
    }

    private Produto preencher(Produto p, ProdutoRequest r) {
        p.setTipo(r.tipo());
        p.setCodigo(r.codigo());
        p.setNome(r.nome());
        p.setCategoria(r.categoria());
        p.setUnidade(r.unidade());
        p.setPrecoVenda(r.precoVenda());
        p.setQuantidadeEstoque(r.quantidadeEstoque());
        p.setQuantidadeMinima(r.quantidadeMinima());
        p.setAlergenos(r.alergenos());
        p.setLote(r.lote());
        p.setDataValidade(r.dataValidade());
        p.setAtivo(r.ativo());
        p.setFornecedor(fornecedor(r.fornecedorId()));
        return p;
    }

    private Fornecedor fornecedor(Long id) {
        if (id == null)
            return null;
        return fornecedores.findById(id).orElseThrow(() -> new ResourceNotFoundException("Fornecedor", id));
    }
}
