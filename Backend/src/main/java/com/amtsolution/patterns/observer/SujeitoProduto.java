package com.amtsolution.patterns.observer;
import java.util.List; import org.springframework.stereotype.Component;
@Component public class SujeitoProduto { private final List<ObservadorProduto> observadores; public SujeitoProduto(List<ObservadorProduto> observadores){this.observadores=observadores;} public void publicar(EventoProduto evento){observadores.forEach(o->o.atualizar(evento));} }
