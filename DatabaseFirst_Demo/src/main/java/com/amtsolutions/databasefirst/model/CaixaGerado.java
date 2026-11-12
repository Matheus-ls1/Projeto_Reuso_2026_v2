package com.amtsolutions.databasefirst.model;

import jakarta.annotation.Generated;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CaixaGerado {
    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8507908-03:00", comments="Source field: caixas.id")
    private Long id;

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8527904-03:00", comments="Source field: caixas.aberto_em")
    private LocalDateTime abertoEm;

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8527904-03:00", comments="Source field: caixas.fechado_em")
    private LocalDateTime fechadoEm;

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8527904-03:00", comments="Source field: caixas.saldo_inicial")
    private BigDecimal saldoInicial;

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8527904-03:00", comments="Source field: caixas.saldo_final")
    private BigDecimal saldoFinal;

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8527904-03:00", comments="Source field: caixas.situacao")
    private String situacao;

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8527904-03:00", comments="Source field: caixas.criado_em")
    private LocalDateTime criadoEm;

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8537895-03:00", comments="Source field: caixas.atualizado_em")
    private LocalDateTime atualizadoEm;

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8517913-03:00", comments="Source field: caixas.id")
    public Long getId() {
        return id;
    }

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8527904-03:00", comments="Source field: caixas.id")
    public void setId(Long id) {
        this.id = id;
    }

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8527904-03:00", comments="Source field: caixas.aberto_em")
    public LocalDateTime getAbertoEm() {
        return abertoEm;
    }

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8527904-03:00", comments="Source field: caixas.aberto_em")
    public void setAbertoEm(LocalDateTime abertoEm) {
        this.abertoEm = abertoEm;
    }

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8527904-03:00", comments="Source field: caixas.fechado_em")
    public LocalDateTime getFechadoEm() {
        return fechadoEm;
    }

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8527904-03:00", comments="Source field: caixas.fechado_em")
    public void setFechadoEm(LocalDateTime fechadoEm) {
        this.fechadoEm = fechadoEm;
    }

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8527904-03:00", comments="Source field: caixas.saldo_inicial")
    public BigDecimal getSaldoInicial() {
        return saldoInicial;
    }

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8527904-03:00", comments="Source field: caixas.saldo_inicial")
    public void setSaldoInicial(BigDecimal saldoInicial) {
        this.saldoInicial = saldoInicial;
    }

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8527904-03:00", comments="Source field: caixas.saldo_final")
    public BigDecimal getSaldoFinal() {
        return saldoFinal;
    }

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8527904-03:00", comments="Source field: caixas.saldo_final")
    public void setSaldoFinal(BigDecimal saldoFinal) {
        this.saldoFinal = saldoFinal;
    }

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8527904-03:00", comments="Source field: caixas.situacao")
    public String getSituacao() {
        return situacao;
    }

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8527904-03:00", comments="Source field: caixas.situacao")
    public void setSituacao(String situacao) {
        this.situacao = situacao;
    }

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8537895-03:00", comments="Source field: caixas.criado_em")
    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8537895-03:00", comments="Source field: caixas.criado_em")
    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8537895-03:00", comments="Source field: caixas.atualizado_em")
    public LocalDateTime getAtualizadoEm() {
        return atualizadoEm;
    }

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8537895-03:00", comments="Source field: caixas.atualizado_em")
    public void setAtualizadoEm(LocalDateTime atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
    }
}