package com.amtsolution.service;

import java.util.List;
import com.amtsolution.dto.FornecedorRequest;
import com.amtsolution.exception.ConflictException;
import com.amtsolution.exception.ResourceNotFoundException;
import com.amtsolution.model.Fornecedor;
import com.amtsolution.repository.FornecedorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
// Aplica as regras de unicidade e ativação dos fornecedores utilizados pelos cadastros relacionados.
public class FornecedorService {
    private final FornecedorRepository repository;

    public FornecedorService(FornecedorRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Fornecedor> listar() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Fornecedor buscar(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Fornecedor", id));
    }

    public Fornecedor criar(FornecedorRequest r) {
        if (repository.existsByDocumento(r.documento()))
            throw new ConflictException("Documento já cadastrado.");
        return repository.save(preencher(new Fornecedor(), r));
    }

    public Fornecedor atualizar(Long id, FornecedorRequest r) {
        if (repository.existsByDocumentoAndIdNot(r.documento(), id))
            throw new ConflictException("Documento já cadastrado.");
        return repository.save(preencher(buscar(id), r));
    }

    public Fornecedor alterarAtivo(Long id, Boolean ativo) {
        // Alterar o status é uma operação separada da exclusão física exposta pelo CRUD.
        Fornecedor f = buscar(id);
        f.setAtivo(ativo);
        return repository.save(f);
    }

    public void excluir(Long id) {
        repository.delete(buscar(id));
        repository.flush();
    }

    private Fornecedor preencher(Fornecedor f, FornecedorRequest r) {
        f.setNome(r.nome());
        f.setDocumento(r.documento());
        f.setContato(r.contato());
        f.setTelefone(r.telefone());
        f.setEmail(r.email());
        f.setAtivo(r.ativo());
        return f;
    }
}
