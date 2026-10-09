package com.amtsolution.service;
import java.util.List;
import com.amtsolution.dto.ProdutoRequest;
import com.amtsolution.exception.ConflictException;
import com.amtsolution.exception.ResourceNotFoundException;
import com.amtsolution.model.Fornecedor;
import com.amtsolution.model.Produto;
import com.amtsolution.repository.FornecedorRepository;
import com.amtsolution.repository.ProdutoRepository;
import com.amtsolution.patterns.observer.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @Transactional
public class ProdutoService {
    private final ProdutoRepository repository; private final FornecedorRepository fornecedores; private final SujeitoProduto sujeito;
    public ProdutoService(ProdutoRepository repository,FornecedorRepository fornecedores,SujeitoProduto sujeito){this.repository=repository;this.fornecedores=fornecedores;this.sujeito=sujeito;}
    @Transactional(readOnly=true) public List<Produto> listar(){return repository.findAll();}
    @Transactional(readOnly=true) public Produto buscar(Long id){return repository.findById(id).orElseThrow(()->new ResourceNotFoundException("Produto",id));}
    public Produto criar(ProdutoRequest r){if(repository.existsByCodigo(r.codigo())) throw new ConflictException("Código já cadastrado.");Produto p=repository.save(preencher(new Produto(),r));sujeito.publicar(new EventoProduto(p));return p;}
    public Produto atualizar(Long id,ProdutoRequest r){if(repository.existsByCodigoAndIdNot(r.codigo(),id)) throw new ConflictException("Código já cadastrado.");Produto p=repository.save(preencher(buscar(id),r));sujeito.publicar(new EventoProduto(p));return p;}
    public void desativar(Long id){Produto p=buscar(id);p.setAtivo(false);repository.save(p);}
    private Produto preencher(Produto p,ProdutoRequest r){p.setTipo(r.tipo());p.setCodigo(r.codigo());p.setNome(r.nome());p.setCategoria(r.categoria());p.setUnidade(r.unidade());p.setPrecoVenda(r.precoVenda());p.setQuantidadeEstoque(r.quantidadeEstoque());p.setQuantidadeMinima(r.quantidadeMinima());p.setAlergenos(r.alergenos());p.setLote(r.lote());p.setDataValidade(r.dataValidade());p.setAtivo(r.ativo());p.setFornecedor(fornecedor(r.fornecedorId()));return p;}
    private Fornecedor fornecedor(Long id){if(id==null)return null;return fornecedores.findById(id).orElseThrow(()->new ResourceNotFoundException("Fornecedor",id));}
}
