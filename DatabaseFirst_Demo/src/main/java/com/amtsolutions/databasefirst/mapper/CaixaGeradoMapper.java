package com.amtsolutions.databasefirst.mapper;

import com.amtsolutions.databasefirst.model.CaixaGerado;
import jakarta.annotation.Generated;
import java.util.List;

public interface CaixaGeradoMapper {
    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.856789-03:00", comments="Source Table: caixas")
    int deleteByPrimaryKey(Long id);

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8587923-03:00", comments="Source Table: caixas")
    int insert(CaixaGerado row);

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8587923-03:00", comments="Source Table: caixas")
    CaixaGerado selectByPrimaryKey(Long id);

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8587923-03:00", comments="Source Table: caixas")
    List<CaixaGerado> selectAll();

    @Generated(value="org.mybatis.generator.api.MyBatisGenerator", date="2026-11-11T23:10:02.8597907-03:00", comments="Source Table: caixas")
    int updateByPrimaryKey(CaixaGerado row);
}