package com.amtsolution.databasefirst.mapper;

import com.amtsolutions.databasefirst.model.CaixaGerado;
import com.amtsolutions.databasefirst.model.MovimentacaoCaixaGerada;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface CaixaConsultaMapper {
    @Select("SELECT id, aberto_em AS abertoEm, fechado_em AS fechadoEm, saldo_inicial AS saldoInicial, "
            + "saldo_final AS saldoFinal, situacao, criado_em AS criadoEm, atualizado_em AS atualizadoEm "
            + "FROM caixas WHERE situacao = 'ABERTO' ORDER BY aberto_em DESC, id DESC LIMIT 1")
    CaixaGerado buscarAberto();

    @Select("SELECT id, aberto_em AS abertoEm, fechado_em AS fechadoEm, saldo_inicial AS saldoInicial, "
            + "saldo_final AS saldoFinal, situacao, criado_em AS criadoEm, atualizado_em AS atualizadoEm "
            + "FROM caixas WHERE situacao = 'ABERTO' ORDER BY aberto_em DESC, id DESC LIMIT 1 FOR UPDATE")
    CaixaGerado buscarAbertoParaAtualizacao();

    @Select("SELECT id, aberto_em AS abertoEm, fechado_em AS fechadoEm, saldo_inicial AS saldoInicial, "
            + "saldo_final AS saldoFinal, situacao, criado_em AS criadoEm, atualizado_em AS atualizadoEm "
            + "FROM caixas WHERE id = #{id} FOR UPDATE")
    CaixaGerado buscarPorIdParaAtualizacao(@Param("id") Long id);

    @Select("SELECT id, caixa_id AS caixaId, tipo, valor, descricao, ocorrido_em AS ocorridoEm, "
            + "criado_em AS criadoEm, atualizado_em AS atualizadoEm FROM movimentacoes_caixa "
            + "WHERE caixa_id = #{caixaId} ORDER BY ocorrido_em, id")
    List<MovimentacaoCaixaGerada> listarPorCaixa(@Param("caixaId") Long caixaId);
}
