package com.amtsolution.patterns.observer;
import java.util.List; import org.springframework.stereotype.Component;
@Component public class SujeitoVencimento { private final List<ObservadorVencimento> observadores; public SujeitoVencimento(List<ObservadorVencimento> observadores){this.observadores=observadores;} public void publicar(EventoVencimento evento){observadores.forEach(o->o.atualizar(evento));} }
