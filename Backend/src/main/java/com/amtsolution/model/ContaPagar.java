package com.amtsolution.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.sql.Types;
import org.hibernate.annotations.JdbcTypeCode;

@Entity
@Table(name = "contas_pagar")
// Entidade de obrigação financeira, com dados necessários às estratégias de encargo.
public class ContaPagar {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 200)
    private String descricao;
    @Column(nullable = false, length = 80)
    private String categoria;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "fornecedor_id")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Fornecedor fornecedor;
    @Column(nullable = false)
    private LocalDate vencimento;
    @Column(name = "valor_original", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorOriginal;
    @Column(name = "estrategia_encargo", nullable = false, length = 20)
    private String estrategiaEncargo;
    @Column(name = "percentual_juros", nullable = false, precision = 5, scale = 2)
    private BigDecimal percentualJuros;
    @Column(name = "percentual_multa", nullable = false, precision = 5, scale = 2)
    private BigDecimal percentualMulta;
    @Column(name = "valor_encargos", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorEncargos;
    @Column(nullable = false, length = 20)
    private String situacao;
    @Column(name = "data_pagamento")
    private LocalDate dataPagamento;
    @Column(name = "valor_pago", precision = 10, scale = 2)
    private BigDecimal valorPago;
    @Column(name = "forma_pagamento", length = 30)
    private String formaPagamento;
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

    public Fornecedor getFornecedor() {
        return fornecedor;
    }

    public void setFornecedor(Fornecedor v) {
        fornecedor = v;
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

    public String getEstrategiaEncargo() {
        return estrategiaEncargo;
    }

    public void setEstrategiaEncargo(String v) {
        estrategiaEncargo = v;
    }

    public BigDecimal getPercentualJuros() {
        return percentualJuros;
    }

    public void setPercentualJuros(BigDecimal v) {
        percentualJuros = v;
    }

    public BigDecimal getPercentualMulta() {
        return percentualMulta;
    }

    public void setPercentualMulta(BigDecimal v) {
        percentualMulta = v;
    }

    public BigDecimal getValorEncargos() {
        return valorEncargos;
    }

    public void setValorEncargos(BigDecimal v) {
        valorEncargos = v;
    }

    public String getSituacao() {
        return situacao;
    }

    public void setSituacao(String v) {
        situacao = v;
    }

    public LocalDate getDataPagamento() {
        return dataPagamento;
    }

    public void setDataPagamento(LocalDate v) {
        dataPagamento = v;
    }

    public BigDecimal getValorPago() {
        return valorPago;
    }

    public void setValorPago(BigDecimal v) {
        valorPago = v;
    }

    public String getFormaPagamento() {
        return formaPagamento;
    }

    public void setFormaPagamento(String v) {
        formaPagamento = v;
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
