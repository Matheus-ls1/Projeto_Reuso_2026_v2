package com.amtsolution.config;

import jakarta.persistence.EntityManagerFactory;
import javax.sql.DataSource;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
@MapperScan(basePackages = { "com.amtsolutions.databasefirst.mapper", "com.amtsolution.databasefirst.mapper" })
public class DatabaseFirstMyBatisConfig {
    // Mantém o manager padrão usado pelos seis módulos Spring Data JPA.
    @Bean("transactionManager")
    @Primary
    PlatformTransactionManager transactionManager(EntityManagerFactory entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory);
    }

    // Isolado para o módulo Caixa, que usa MyBatis sobre o mesmo DataSource.
    @Bean("caixaTransactionManager")
    DataSourceTransactionManager caixaTransactionManager(DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }
}
