package com.amtsolution.patterns.factory;
import com.amtsolution.model.Aviso;
public abstract class CriadorAviso { public Aviso criar(DadosAviso dados){Aviso aviso=fabricar();aviso.setTitulo(dados.titulo());aviso.setCorpo(dados.corpo());aviso.setPrioridade(dados.prioridade());aviso.setPublico(dados.publico());aviso.setInicio(dados.inicio());aviso.setFim(dados.fim());aviso.setSituacao(dados.situacao());aviso.setChaveEvento(dados.chaveEvento());return aviso;} protected abstract Aviso fabricar(); }
