package com.amtsolutions.databasefirst.mapper;

import com.amtsolutions.databasefirst.model.MovimentacaoCaixaGerada;
import jakarta.annotation.Generated;
import java.util.List;

public interface MovimentacaoCaixaGeradaMapper {
    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8697336-03:00", comments="Source Table: movimentacoes_caixa")
    int deleteByPrimaryKey(Long id);

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8697336-03:00", comments="Source Table: movimentacoes_caixa")
    int insert(MovimentacaoCaixaGerada row);

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8697336-03:00", comments="Source Table: movimentacoes_caixa")
    MovimentacaoCaixaGerada selectByPrimaryKey(Long id);

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8697336-03:00", comments="Source Table: movimentacoes_caixa")
    List<MovimentacaoCaixaGerada> selectAll();

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8707356-03:00", comments="Source Table: movimentacoes_caixa")
    int updateByPrimaryKey(MovimentacaoCaixaGerada row);
}