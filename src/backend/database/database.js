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
        idproduto INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(200) NOT NULL,
        preco VARCHAR(200) NOT NULL,
        unidade VARCHAR(200) NOT NULL,
        sku VARCHAR(200) NOT NULL,
        codBarra VARCHAR(200) NOT NULL,
        categoria_id INT NOT NULL,
        condicao VARCHAR(200) NOT NULL,
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
              VALUES ('Frios'), ('Legumes'), ('Bebidas'), ('Materiais de limpeza'), 
              ('Padaria'), ('Laticínios'), ('Hortifruti'), ('Açougue');
          END IF;
      END
    `);

    // Chamar a procedure
    await conn.query(`CALL CheckAndInsertCategoria();`);


  } catch (err) {
    console.error('Erro ao configurar o banco de dados:', err);
  } finally {
    if (conn) conn.release(); // Liberar a conexão de volta para o pool
  }
}


module.exports = { pool, createDataBaseIfNotExists, setupDatabase };