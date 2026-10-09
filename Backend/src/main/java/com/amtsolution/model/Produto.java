package com.amtsolution.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.sql.Types;
import org.hibernate.annotations.JdbcTypeCode;

@Entity @Table(name = "produtos")
public class Produto {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false, length = 10) private String tipo;
    @Column(nullable = false, unique = true, length = 50) private String codigo;
    @Column(nullable = false, length = 150) private String nome;
    @Column(nullable = false, length = 80) private String categoria;
    @Column(nullable = false, length = 10) private String unidade;
    @Column(name = "preco_venda", precision = 10, scale = 2) private BigDecimal precoVenda;
    @Column(name = "quantidade_estoque", nullable = false, precision = 12, scale = 3) private BigDecimal quantidadeEstoque;
    @Column(name = "quantidade_minima", nullable = false, precision = 12, scale = 3) private BigDecimal quantidadeMinima;
    @JdbcTypeCode(Types.LONGVARCHAR) @Column(columnDefinition = "TEXT") private String alergenos; @Column(length = 50) private String lote;
    @Column(name = "data_validade") private LocalDate dataValidade;
    @Column(nullable = false) private Boolean ativo = true;
    @ManyToOne(fetch = FetchType.EAGER) @JoinColumn(name = "fornecedor_id") @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) private Fornecedor fornecedor;
    @Column(name = "criado_em", insertable = false, updatable = false) private LocalDateTime criadoEm;
    @Column(name = "atualizado_em", insertable = false, updatable = false) private LocalDateTime atualizadoEm;
    public Long getId(){return id;} public String getTipo(){return tipo;} public void setTipo(String v){tipo=v;} public String getCodigo(){return codigo;} public void setCodigo(String v){codigo=v;} public String getNome(){return nome;} public void setNome(String v){nome=v;} public String getCategoria(){return categoria;} public void setCategoria(String v){categoria=v;} public String getUnidade(){return unidade;} public void setUnidade(String v){unidade=v;} public BigDecimal getPrecoVenda(){return precoVenda;} public void setPrecoVenda(BigDecimal v){precoVenda=v;} public BigDecimal getQuantidadeEstoque(){return quantidadeEstoque;} public void setQuantidadeEstoque(BigDecimal v){quantidadeEstoque=v;} public BigDecimal getQuantidadeMinima(){return quantidadeMinima;} public void setQuantidadeMinima(BigDecimal v){quantidadeMinima=v;} public String getAlergenos(){return alergenos;} public void setAlergenos(String v){alergenos=v;} public String getLote(){return lote;} public void setLote(String v){lote=v;} public LocalDate getDataValidade(){return dataValidade;} public void setDataValidade(LocalDate v){dataValidade=v;} public Boolean getAtivo(){return ativo;} public void setAtivo(Boolean v){ativo=v;} public Fornecedor getFornecedor(){return fornecedor;} public void setFornecedor(Fornecedor v){fornecedor=v;} public LocalDateTime getCriadoEm(){return criadoEm;} public LocalDateTime getAtualizadoEm(){return atualizadoEm;}
}
