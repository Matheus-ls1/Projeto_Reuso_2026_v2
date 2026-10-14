package com.amtsolution.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

// DTO que recebe os campos comuns a produtos e insumos antes do mapeamento para a entidade.
public record ProdutoRequest(
        @NotBlank @Pattern(regexp = "PRODUTO|INSUMO") String tipo,
        @NotBlank @Size(max = 50) String codigo,
        @NotBlank @Size(max = 150) String nome, @NotBlank @Size(max = 80) String categoria,
        @NotBlank @Size(max = 10) String unidade,
        @DecimalMin(value = "0.00", inclusive = true) BigDecimal precoVenda,
        @NotNull @DecimalMin("0.000") BigDecimal quantidadeEstoque,
        @NotNull @DecimalMin("0.000") BigDecimal quantidadeMinima, String alergenos,
        @Size(max = 50) String lote,
        LocalDate dataValidade, @NotNull Boolean ativo, Long fornecedorId) {
}
