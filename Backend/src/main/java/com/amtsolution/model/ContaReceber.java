package com.amtsolution.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import jakarta.persistence.*;
import java.sql.Types;
import org.hibernate.annotations.JdbcTypeCode;

@Entity
@Table(name = "contas_receber")
// Entidade de valor a receber, com dados necessários às estratégias de desconto.
public class ContaReceber {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 200)
    private String descricao;
    @Column(nullable = false, length = 80)
    private String categoria;
    @Column(nullable = false, length = 150)
    private String cliente;
    @Column(nullable = false)
    private LocalDate vencimento;
    @Column(name = "valor_original", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorOriginal;
    @Column(name = "estrategia_desconto", nullable = false, length = 20)
    private String estrategiaDesconto;
    @Column(name = "percentual_desconto", nullable = false, precision = 5, scale = 2)
    private BigDecimal percentualDesconto;
    @Column(name = "valor_desconto", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorDesconto;
    @Column(nullable = false, length = 20)
    private String situacao;
    @Column(name = "data_recebimento")
    private LocalDate dataRecebimento;
    @Column(name = "valor_recebido", precision = 10, scale = 2)
    private BigDecimal valorRecebido;
    @Column(name = "forma_recebimento", length = 30)
    private String formaRecebimento;
    @JdbcTypeCode(Types.LONGVARCHAR)
    @Column(columnDefinition = "TEXT")
    private String observacao;
    @Column(name = "criado_em", insertable = false, updatable = false)
    private LocalDateTime criadoEm;
    @Column(name = "atualizado_em", insertable = false, updatable = false)
    private LocalDateTime atualizadoEm;

    public Long getId() {
        return id;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String v) {
        descricao = v;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String v) {
        categoria = v;
    }

    public String getCliente() {
        return cliente;
    }

    public void setCliente(String v) {
        cliente = v;
    }

    public LocalDate getVencimento() {
        return vencimento;
    }

    public void setVencimento(LocalDate v) {
        vencimento = v;
    }

    public BigDecimal getValorOriginal() {
        return valorOriginal;
    }

    public void setValorOriginal(BigDecimal v) {
        valorOriginal = v;
    }

    public String getEstrategiaDesconto() {
        return estrategiaDesconto;
    }

    public void setEstrategiaDesconto(String v) {
        estrategiaDesconto = v;
    }

    public BigDecimal getPercentualDesconto() {
        return percentualDesconto;
    }

    public void setPercentualDesconto(BigDecimal v) {
        percentualDesconto = v;
    }

    public BigDecimal getValorDesconto() {
        return valorDesconto;
    }

    public void setValorDesconto(BigDecimal v) {
        valorDesconto = v;
    }

    public String getSituacao() {
        return situacao;
    }

    public void setSituacao(String v) {
        situacao = v;
    }

    public LocalDate getDataRecebimento() {
        return dataRecebimento;
    }

    public void setDataRecebimento(LocalDate v) {
        dataRecebimento = v;
    }

    public BigDecimal getValorRecebido() {
        return valorRecebido;
    }

    public void setValorRecebido(BigDecimal v) {
        valorRecebido = v;
    }

    public String getFormaRecebimento() {
        return formaRecebimento;
    }

    public void setFormaRecebimento(String v) {
        formaRecebimento = v;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String v) {
        observacao = v;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public LocalDateTime getAtualizadoEm() {
        return atualizadoEm;
    }
}
