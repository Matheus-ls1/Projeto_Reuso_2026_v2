
-- AMT Solutions - Parte III - Database First
-- Modulo Caixa
-- MariaDB 10.4+
-- Executar somente no banco amt_solution.
-- Nao remove tabelas ou dados existentes.

USE amt_solution;

-- ==========================================
-- 1. TABELA CAIXAS
-- ==========================================

CREATE TABLE caixas (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    aberto_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fechado_em DATETIME NULL,
    saldo_inicial DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    saldo_final DECIMAL(10,2) NULL,
    situacao ENUM('ABERTO', 'FECHADO')
        NOT NULL DEFAULT 'ABERTO',
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    KEY idx_caixas_situacao_aberto
        (situacao, aberto_em),

    CONSTRAINT ck_caixas_saldo_inicial_nao_negativo
        CHECK (saldo_inicial >= 0),

    CONSTRAINT ck_caixas_fechamento_consistente
        CHECK (
            (
                situacao = 'ABERTO'
                AND fechado_em IS NULL
                AND saldo_final IS NULL
            )
            OR
            (
                situacao = 'FECHADO'
                AND fechado_em IS NOT NULL
                AND saldo_final IS NOT NULL
            )
        )

) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ==========================================
-- 2. TABELA MOVIMENTACOES DE CAIXA
-- ==========================================

CREATE TABLE movimentacoes_caixa (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    caixa_id BIGINT UNSIGNED NOT NULL,
    tipo ENUM('ENTRADA', 'SAIDA') NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    descricao VARCHAR(200) NOT NULL,
    ocorrido_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    KEY idx_movimentacoes_caixa_periodo
        (caixa_id, ocorrido_em),

    KEY idx_movimentacoes_caixa_tipo
        (caixa_id, tipo),

    CONSTRAINT ck_movimentacoes_caixa_valor_positivo
        CHECK (valor > 0),

    CONSTRAINT fk_movimentacoes_caixa_caixa
        FOREIGN KEY (caixa_id)
        REFERENCES caixas (id)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT

) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ==========================================
-- 3. TRIGGERS
-- ==========================================

DELIMITER //

-- Impede movimentacoes em caixa fechado

CREATE TRIGGER trg_movimentacoes_caixa_bi_caixa_aberto
BEFORE INSERT ON movimentacoes_caixa
FOR EACH ROW
BEGIN
    IF (
        SELECT situacao
        FROM caixas
        WHERE id = NEW.caixa_id
    ) <> 'ABERTO' THEN

        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT =
                'Nao e permitido registrar movimentacao em caixa fechado.';

    END IF;
END//


-- Impede alterar movimentacoes de caixa fechado

CREATE TRIGGER trg_movimentacoes_caixa_bu_caixa_aberto
BEFORE UPDATE ON movimentacoes_caixa
FOR EACH ROW
BEGIN
    IF (
        SELECT situacao
        FROM caixas
        WHERE id = OLD.caixa_id
    ) <> 'ABERTO'
    OR (
        SELECT situacao
        FROM caixas
        WHERE id = NEW.caixa_id
    ) <> 'ABERTO' THEN

        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT =
                'Nao e permitido alterar movimentacao de caixa fechado.';

    END IF;
END//


-- Impede excluir movimentacoes de caixa fechado

CREATE TRIGGER trg_movimentacoes_caixa_bd_caixa_aberto
BEFORE DELETE ON movimentacoes_caixa
FOR EACH ROW
BEGIN
    IF (
        SELECT situacao
        FROM caixas
        WHERE id = OLD.caixa_id
    ) <> 'ABERTO' THEN

        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT =
                'Nao e permitido excluir movimentacao de caixa fechado.';

    END IF;
END//


-- Impede alterar um caixa ja fechado

CREATE TRIGGER trg_caixas_bu_fechado_imutavel
BEFORE UPDATE ON caixas
FOR EACH ROW
BEGIN
    IF OLD.situacao = 'FECHADO' THEN

        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT =
                'Nao e permitido alterar caixa fechado.';

    END IF;
END//

DELIMITER ;
