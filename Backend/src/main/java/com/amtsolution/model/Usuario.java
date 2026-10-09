package com.amtsolution.model;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity @Table(name="usuarios")
public class Usuario {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false,length=150) private String nome; @Column(nullable=false,unique=true,length=150) private String email; @Column(nullable=false,length=100) private String cargo; @Column(nullable=false,length=80) private String perfil;
    @JsonIgnore @Column(name="senha_hash",length=255) private String senhaHash; @Column(nullable=false) private Boolean ativo=true;
    @Column(name="criado_em",insertable=false,updatable=false) private LocalDateTime criadoEm; @Column(name="atualizado_em",insertable=false,updatable=false) private LocalDateTime atualizadoEm;
    public Long getId(){return id;} public String getNome(){return nome;} public void setNome(String v){nome=v;} public String getEmail(){return email;} public void setEmail(String v){email=v;} public String getCargo(){return cargo;} public void setCargo(String v){cargo=v;} public String getPerfil(){return perfil;} public void setPerfil(String v){perfil=v;} @JsonIgnore public String getSenhaHash(){return senhaHash;} public void setSenhaHash(String v){senhaHash=v;} public Boolean getAtivo(){return ativo;} public void setAtivo(Boolean v){ativo=v;} public LocalDateTime getCriadoEm(){return criadoEm;} public LocalDateTime getAtualizadoEm(){return atualizadoEm;}
}
