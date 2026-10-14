package com.amtsolution.model;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "fornecedores")
// Entidade de fornecedor que pode ser associada opcionalmente a produtos e contas a pagar.
public class Fornecedor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 150)
    private String nome;
    @Column(nullable = false, unique = true, length = 18)
    private String documento;
    @Column(nullable = false, length = 100)
    private String contato;
    @Column(nullable = false, length = 20)
    private String telefone;
    @Column(nullable = false, length = 150)
    private String email;
    @Column(nullable = false)
    private Boolean ativo = true;
    @Column(name = "criado_em", insertable = false, updatable = false)
    private LocalDateTime criadoEm;
    @Column(name = "atualizado_em", insertable = false, updatable = false)
    private LocalDateTime atualizadoEm;

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String v) {
        nome = v;
    }

    public String getDocumento() {
        return documento;
    }

    public void setDocumento(String v) {
        documento = v;
    }

    public String getContato() {
        return contato;
    }

    public void setContato(String v) {
        contato = v;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String v) {
        telefone = v;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String v) {
        email = v;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean v) {
        ativo = v;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public LocalDateTime getAtualizadoEm() {
        return atualizadoEm;
    }
}
