package com.amtsolutions.databasefirst.model;

import jakarta.annotation.Generated;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class MovimentacaoCaixaGerada {
    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.868731-03:00", comments="Source field: movimentacoes_caixa.id")
    private Long id;

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.868731-03:00", comments="Source field: movimentacoes_caixa.caixa_id")
    private Long caixaId;

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.868731-03:00", comments="Source field: movimentacoes_caixa.tipo")
    private String tipo;

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.868731-03:00", comments="Source field: movimentacoes_caixa.valor")
    private BigDecimal valor;

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.868731-03:00", comments="Source field: movimentacoes_caixa.descricao")
    private String descricao;

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.868731-03:00", comments="Source field: movimentacoes_caixa.ocorrido_em")
    private LocalDateTime ocorridoEm;

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8697336-03:00", comments="Source field: movimentacoes_caixa.criado_em")
    private LocalDateTime criadoEm;

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8697336-03:00", comments="Source field: movimentacoes_caixa.atualizado_em")
    private LocalDateTime atualizadoEm;

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.868731-03:00", comments="Source field: movimentacoes_caixa.id")
    public Long getId() {
        return id;
    }

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.868731-03:00", comments="Source field: movimentacoes_caixa.id")
    public void setId(Long id) {
        this.id = id;
    }

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.868731-03:00", comments="Source field: movimentacoes_caixa.caixa_id")
    public Long getCaixaId() {
        return caixaId;
    }

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.868731-03:00", comments="Source field: movimentacoes_caixa.caixa_id")
    public void setCaixaId(Long caixaId) {
        this.caixaId = caixaId;
    }

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.868731-03:00", comments="Source field: movimentacoes_caixa.tipo")
    public String getTipo() {
        return tipo;
    }

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.868731-03:00", comments="Source field: movimentacoes_caixa.tipo")
    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.868731-03:00", comments="Source field: movimentacoes_caixa.valor")
    public BigDecimal getValor() {
        return valor;
    }

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.868731-03:00", comments="Source field: movimentacoes_caixa.valor")
    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.868731-03:00", comments="Source field: movimentacoes_caixa.descricao")
    public String getDescricao() {
        return descricao;
    }

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.868731-03:00", comments="Source field: movimentacoes_caixa.descricao")
    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8697336-03:00", comments="Source field: movimentacoes_caixa.ocorrido_em")
    public LocalDateTime getOcorridoEm() {
        return ocorridoEm;
    }

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8697336-03:00", comments="Source field: movimentacoes_caixa.ocorrido_em")
    public void setOcorridoEm(LocalDateTime ocorridoEm) {
        this.ocorridoEm = ocorridoEm;
    }

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8697336-03:00", comments="Source field: movimentacoes_caixa.criado_em")
    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8697336-03:00", comments="Source field: movimentacoes_caixa.criado_em")
    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8697336-03:00", comments="Source field: movimentacoes_caixa.atualizado_em")
    public LocalDateTime getAtualizadoEm() {
        return atualizadoEm;
    }

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8697336-03:00", comments="Source field: movimentacoes_caixa.atualizado_em")
    public void setAtualizadoEm(LocalDateTime atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
    }
}