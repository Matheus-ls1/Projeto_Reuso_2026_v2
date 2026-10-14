package com.amtsolution.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.sql.Types;
import org.hibernate.annotations.JdbcTypeCode;

@Entity
@Table(name = "avisos")
// Entidade de comunicados manuais e avisos automáticos ligados opcionalmente à sua origem.
public class Aviso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 200)
    private String titulo;
    @JdbcTypeCode(Types.LONGVARCHAR)
    @Column(nullable = false, columnDefinition = "TEXT")
    private String corpo;
    @Column(nullable = false, length = 25)
    private String tipo;
    @Column(nullable = false, length = 10)
    private String prioridade;
    @Column(nullable = false, length = 50)
    private String publico;
    @Column(nullable = false)
    private LocalDate inicio;
    private LocalDate fim;
    @Column(nullable = false, length = 20)
    private String situacao;
    @Column(name = "chave_evento", unique = true, length = 120)
    private String chaveEvento;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "produto_origem_id")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Produto produtoOrigem;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "conta_pagar_origem_id")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private ContaPagar contaPagarOrigem;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "criado_por_usuario_id")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler", "senhaHash" })
    private Usuario criadoPorUsuario;
    @Column(name = "criado_em", insertable = false, updatable = false)
    private LocalDateTime criadoEm;
    @Column(name = "atualizado_em", insertable = false, updatable = false)
    private LocalDateTime atualizadoEm;

    public Long getId() {
        return id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String v) {
        titulo = v;
    }

    public String getCorpo() {
        return corpo;
    }

    public void setCorpo(String v) {
        corpo = v;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String v) {
        tipo = v;
    }

    public String getPrioridade() {
        return prioridade;
    }

    public void setPrioridade(String v) {
        prioridade = v;
    }

    public String getPublico() {
        return publico;
    }

    public void setPublico(String v) {
        publico = v;
    }

    public LocalDate getInicio() {
        return inicio;
    }

    public void setInicio(LocalDate v) {
        inicio = v;
    }

    public LocalDate getFim() {
        return fim;
    }

    public void setFim(LocalDate v) {
        fim = v;
    }

    public String getSituacao() {
        return situacao;
    }

    public void setSituacao(String v) {
        situacao = v;
    }

    public String getChaveEvento() {
        return chaveEvento;
    }

    public void setChaveEvento(String v) {
        chaveEvento = v;
    }

    public Produto getProdutoOrigem() {
        return produtoOrigem;
    }

    public void setProdutoOrigem(Produto v) {
        produtoOrigem = v;
    }

    public ContaPagar getContaPagarOrigem() {
        return contaPagarOrigem;
    }

    public void setContaPagarOrigem(ContaPagar v) {
        contaPagarOrigem = v;
    }

    public Usuario getCriadoPorUsuario() {
        return criadoPorUsuario;
    }

    public void setCriadoPorUsuario(Usuario v) {
        criadoPorUsuario = v;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public LocalDateTime getAtualizadoEm() {
        return atualizadoEm;
    }
}
