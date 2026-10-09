-- AMT Solution - Etapa 02
-- Compatível com MySQL 8+ e MariaDB 10.4+ (XAMPP).
-- O script não remove bancos nem tabelas existentes.

CREATE DATABASE IF NOT EXISTS amt_solution
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE amt_solution;

CREATE TABLE IF NOT EXISTS fornecedores (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(150) NOT NULL,
  documento VARCHAR(18) NOT NULL,
  contato VARCHAR(100) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  email VARCHAR(150) NOT NULL,
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_fornecedores_documento (documento),
  KEY idx_fornecedores_nome (nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS produtos (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tipo ENUM('PRODUTO', 'INSUMO') NOT NULL DEFAULT 'PRODUTO',
  codigo VARCHAR(50) NOT NULL,
  nome VARCHAR(150) NOT NULL,
  categoria VARCHAR(80) NOT NULL,
  unidade VARCHAR(10) NOT NULL,
  preco_venda DECIMAL(10,2) NULL,
  quantidade_estoque DECIMAL(12,3) NOT NULL DEFAULT 0.000,
  quantidade_minima DECIMAL(12,3) NOT NULL DEFAULT 0.000,
  alergenos TEXT NULL,
  lote VARCHAR(50) NULL,
  data_validade DATE NULL,
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  fornecedor_id BIGINT UNSIGNED NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_produtos_codigo (codigo),
  KEY idx_produtos_fornecedor (fornecedor_id),
  KEY idx_produtos_estoque_minimo (ativo, quantidade_estoque, quantidade_minima),
  CONSTRAINT fk_produtos_fornecedor
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores (id)
    ON UPDATE RESTRICT ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contas_pagar (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  descricao VARCHAR(200) NOT NULL,
  categoria VARCHAR(80) NOT NULL,
  fornecedor_id BIGINT UNSIGNED NULL,
  vencimento DATE NOT NULL,
  valor_original DECIMAL(10,2) NOT NULL,
  estrategia_encargo ENUM('SEM_ENCARGO', 'JUROS_SIMPLES', 'MULTA_JUROS') NOT NULL DEFAULT 'SEM_ENCARGO',
  percentual_juros DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  percentual_multa DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  valor_encargos DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  situacao ENUM('PENDENTE', 'PAGO', 'VENCIDO', 'CANCELADO') NOT NULL DEFAULT 'PENDENTE',
  data_pagamento DATE NULL,
  valor_pago DECIMAL(10,2) NULL,
  forma_pagamento VARCHAR(30) NULL,
  observacao TEXT NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_contas_pagar_fornecedor (fornecedor_id),
  KEY idx_contas_pagar_vencimento (situacao, vencimento),
  CONSTRAINT fk_contas_pagar_fornecedor
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores (id)
    ON UPDATE RESTRICT ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contas_receber (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  descricao VARCHAR(200) NOT NULL,
  categoria VARCHAR(80) NOT NULL,
  cliente VARCHAR(150) NOT NULL,
  vencimento DATE NOT NULL,
  valor_original DECIMAL(10,2) NOT NULL,
  estrategia_desconto ENUM('SEM_DESCONTO', 'PERCENTUAL', 'ANTECIPACAO') NOT NULL DEFAULT 'SEM_DESCONTO',
  percentual_desconto DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  valor_desconto DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  situacao ENUM('PENDENTE', 'RECEBIDO', 'VENCIDO', 'CANCELADO') NOT NULL DEFAULT 'PENDENTE',
  data_recebimento DATE NULL,
  valor_recebido DECIMAL(10,2) NULL,
  forma_recebimento VARCHAR(30) NULL,
  observacao TEXT NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_contas_receber_vencimento (situacao, vencimento),
  KEY idx_contas_receber_cliente (cliente)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS usuarios (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  cargo VARCHAR(100) NOT NULL,
  perfil VARCHAR(80) NOT NULL,
  senha_hash VARCHAR(255) NULL,
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_usuarios_email (email),
  KEY idx_usuarios_nome (nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS avisos (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  titulo VARCHAR(200) NOT NULL,
  corpo TEXT NOT NULL,
  tipo ENUM('MANUAL', 'ESTOQUE_BAIXO', 'VENCIMENTO_PROXIMO') NOT NULL DEFAULT 'MANUAL',
  prioridade ENUM('ALTA', 'MEDIA', 'BAIXA') NOT NULL DEFAULT 'MEDIA',
  publico VARCHAR(50) NOT NULL DEFAULT 'Todos',
  inicio DATE NOT NULL,
  fim DATE NULL,
  situacao ENUM('RASCUNHO', 'PUBLICADO', 'ARQUIVADO') NOT NULL DEFAULT 'RASCUNHO',
  chave_evento VARCHAR(120) NULL,
  produto_origem_id BIGINT UNSIGNED NULL,
  conta_pagar_origem_id BIGINT UNSIGNED NULL,
  criado_por_usuario_id BIGINT UNSIGNED NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_avisos_chave_evento (chave_evento),
  KEY idx_avisos_periodo (situacao, inicio, fim),
  KEY idx_avisos_produto_origem (produto_origem_id),
  KEY idx_avisos_conta_origem (conta_pagar_origem_id),
  KEY idx_avisos_criador (criado_por_usuario_id),
  CONSTRAINT fk_avisos_produto_origem
    FOREIGN KEY (produto_origem_id) REFERENCES produtos (id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT fk_avisos_conta_pagar_origem
    FOREIGN KEY (conta_pagar_origem_id) REFERENCES contas_pagar (id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT fk_avisos_criador
    FOREIGN KEY (criado_por_usuario_id) REFERENCES usuarios (id)
    ON UPDATE RESTRICT ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
