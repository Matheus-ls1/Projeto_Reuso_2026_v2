package com.amtsolution.patterns.factory;

import com.amtsolution.model.Aviso;

// Criador abstrato do Factory Method: prepara os dados comuns e delega o tipo à subclasse.
public abstract class CriadorAviso {
    // [PADRAO:FACTORY_AVISO] AvisoService chama criar(); este criador abstrato chama fabricar() polimórfico da subclasse.
    public Aviso criar(DadosAviso dados) {
        // O método fábrica decide qual aviso concreto será configurado.
        Aviso aviso = fabricar();
        aviso.setTitulo(dados.titulo());
        aviso.setCorpo(dados.corpo());
        aviso.setPrioridade(dados.prioridade());
        aviso.setPublico(dados.publico());
        aviso.setInicio(dados.inicio());
        aviso.setFim(dados.fim());
        aviso.setSituacao(dados.situacao());
        aviso.setChaveEvento(dados.chaveEvento());
        return aviso;
    }

    // [PADRAO:FACTORY_AVISO] Factory Method implementado por CriadorAvisoManual e CriadorAvisoAutomatico.
    protected abstract Aviso fabricar();
}
