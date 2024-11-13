const mariadb = require('mysql2/promise');

//Configuração da conexão com mariaDB

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'atacadinho',
  connectionLimit: 5
});

/* Função createDataBaseIfNotExists: 
Cria uma conexão inicial sem especificar um banco de dados.
Executa a consulta SQL para criar o banco de dados se ele ainda não existir.
Fecha a conexão após a operção.
 */

async function createDataBaseIfNotExists() {
  let conn;
  try {
    conn = await mariadb.createConnection({
      host: 'localhost',
      user: 'root',
      password: ''
    });
    await conn.query(`CREATE DATABASE IF NOT EXISTS atacadinho`);
  } catch (err) {
    console.error('Erro ao criar o banco de dados: ', err);
  } finally {
    if (conn) conn.end();
  }
}

/* 
  Função assíncrona para configurar o banco de dados:
  'let conn': Declara uma
*/
async function setupDatabase() {
  let conn;
  try {
    conn = await pool.getConnection();

    // Eduardo: Criação da tabela categoria (deve ser criada antes de produtos)
    await conn.query(`
      CREATE TABLE IF NOT EXISTS categoria (
        idcategoria INT AUTO_INCREMENT PRIMARY KEY,
        categoriaproduto VARCHAR(255) NOT NULL
      )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // Eduardo: Criação da tabela produtos (agora a tabela categoria já existe)
    await conn.query(`
      CREATE TABLE IF NOT EXISTS produtos (
        id_produto INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(200) NOT NULL,
        preco VARCHAR(200) NOT NULL,
        marca VARCHAR(200) NOT NULL,
        fornecedor VARCHAR(200) NOT NULL,
        unidade VARCHAR(200) NOT NULL,
        sku VARCHAR(200) NOT NULL,
        codbarra VARCHAR(200) NOT NULL,
        categoria_id INT NOT NULL,
        condicao BOOLEAN NOT NULL,
        datahora DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        FOREIGN KEY (categoria_id) REFERENCES categoria(idcategoria)
      )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // Eduardo: Inserção de dados na tabela categoria
    await conn.query(`
      CREATE PROCEDURE IF NOT EXISTS CheckAndInsertCategoria()
      BEGIN
          DECLARE count_categoria INT;

          -- Contar o número de registros na tabela categoria
          SELECT COUNT(*) INTO count_categoria FROM categoria;

          -- Verificar se a tabela está vazia
          IF count_categoria = 0 THEN
              -- Inserir os valores padrão
              INSERT INTO categoria (categoriaproduto)
              VALUES ('Açougue'), ('Frios e laticínios'), ('Adega e bebidas'), ('Higiene e limpeza'), 
              ('Hortifruti e mercearia'), ('Padaria'), ('Enlatados'), ('Cereais'), ('Rotisseria');
          END IF;
      END
    `);

    // Chamar a procedure
    await conn.query(`CALL CheckAndInsertCategoria();`);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS login (
        id_login INT AUTO_INCREMENT PRIMARY KEY,
        user VARCHAR(255),
        senha VARCHAR(255),
        datahora DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
      )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS caixa (
        id_caixa INT AUTO_INCREMENT PRIMARY KEY,
        data_abertura DATETIME,
        data_fechamento DATETIME,
        valor_inicial FLOAT,
        valor_final FLOAT,
        observacoes VARCHAR(255),
        login_id INT,
        FOREIGN KEY (login_id) REFERENCES login(id_login)
      )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);


    await conn.query(`
      CREATE TABLE IF NOT EXISTS tipo_pagamento (
        id_tipo_pagamento INT AUTO_INCREMENT PRIMARY KEY,
        descricao VARCHAR(255),
        datahora DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
      )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // Eduardo: Inserção de dados na tabela Tipo de Pagamento
    await conn.query(`
      CREATE PROCEDURE IF NOT EXISTS CheckAndInsertTipoPagamento()
      BEGIN
          DECLARE count_tipo_pagamento INT;

          -- Contar o número de registros na tabela tipo_pagamento
          SELECT COUNT(*) INTO count_tipo_pagamento FROM tipo_pagamento;

          -- Verificar se a tabela está vazia
          IF count_tipo_pagamento = 0 THEN
              -- Inserir os valores padrão
              INSERT INTO tipo_pagamento (descricao)
              VALUES ('Pix'), ('Cartão de Crédito'), ('Cartão de Débito'), ('Dinheiro');
          END IF;
      END
    `);

    // Chamar a procedure
    await conn.query(`CALL CheckAndInsertTipoPagamento();`);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS vendas (
        id_venda INT AUTO_INCREMENT PRIMARY KEY,
        valor_total FLOAT NOT NULL,
        descricao VARCHAR(255),
        caixa_id INT NOT NULL,
        datahora DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        FOREIGN KEY (caixa_id) REFERENCES caixa(id_caixa),
      )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS produto_vendas (
        venda_id INT PRIMARY KEY,
        produto_id INT NOT NULL,
        quantidade INT NOT NULL,
        valor_total_produtos FLOAT NOT NULL,
        FOREIGN KEY (produto_id) REFERENCES produtos(id_produto),
        FOREIGN KEY (venda_id) REFERENCES vendas(id_venda)
      )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // Tabela referencial para os tipos de pagamento, de vendas para tipo de pagamento, com uma relação de um para muitos
    await conn.query(`
      CREATE TABLE IF NOT EXISTS vendas_tipo_pagamento (
        venda_id INT PRIMARY KEY,
        tipo_pagamento_id INT NOT NULL,
        valor FLOAT NOT NULL,
        FOREIGN KEY (tipo_pagamento_id) REFERENCES tipo_pagamento(id_tipo_pagamento),
        FOREIGN KEY (venda_id) REFERENCES vendas(id_venda)
      )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

  } catch (err) {
    console.error('Erro ao configurar o banco de dados:', err);
  } finally {
    if (conn) conn.release(); // Liberar a conexão de volta para o pool
  }
}


module.exports = { pool, createDataBaseIfNotExists, setupDatabase };
