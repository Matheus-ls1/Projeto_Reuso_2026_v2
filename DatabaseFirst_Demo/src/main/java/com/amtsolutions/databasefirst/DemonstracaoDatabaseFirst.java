package com.amtsolutions.databasefirst;

import com.amtsolutions.databasefirst.mapper.CaixaGeradoMapper;
import com.amtsolutions.databasefirst.model.CaixaGerado;
import org.apache.ibatis.datasource.pooled.PooledDataSource;
import org.apache.ibatis.mapping.Environment;
import org.apache.ibatis.session.Configuration;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.apache.ibatis.transaction.jdbc.JdbcTransactionFactory;

import java.util.List;

/**
 * Teste somente de leitura do código GERADO a partir do banco.
 * Execute APÓS mvn mybatis-generator:generate. Nenhum registro é alterado.
 */
public class DemonstracaoDatabaseFirst {
    public static void main(String[] args) {
        String url = System.getenv().getOrDefault("AMT_DB_URL",
                "jdbc:mariadb://127.0.0.1:3306/amt_solution");
        String usuario = System.getenv().getOrDefault("AMT_DB_USER", "root");
        String senha = System.getenv().getOrDefault("AMT_DB_PASSWORD", "");

        PooledDataSource ds = new PooledDataSource(
                "org.mariadb.jdbc.Driver", url, usuario, senha);
        Environment env = new Environment("demonstracao", new JdbcTransactionFactory(), ds);
        Configuration cfg = new Configuration(env);
        // Ao registrar o Mapper, o MyBatis busca o XML gerado com o mesmo caminho.
        cfg.addMapper(CaixaGeradoMapper.class);
        SqlSessionFactory factory = new SqlSessionFactoryBuilder().build(cfg);

        try (SqlSession session = factory.openSession()) {
            // Este SELECT e o Mapper foram gerados automaticamente pela ferramenta.
            List<CaixaGerado> encontrados = session
                    .getMapper(CaixaGeradoMapper.class)
                    .selectAll();
            System.out.println("Tabela: caixas");
            System.out.println("Registros consultados pelo Mapper gerado: " + encontrados.size());
            System.out.println("Atributos Java gerados:");
            for (var campo : CaixaGerado.class.getDeclaredFields()) {
                System.out.println(" - " + campo.getName() + " (" + campo.getType().getSimpleName() + ")");
            }
            System.out.println("Teste de leitura concluido (sem INSERT/UPDATE/DELETE).");
        }
    }
}
