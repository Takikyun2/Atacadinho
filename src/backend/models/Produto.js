// Clayton - classe produto e seus metodos
// Eduardo - alteração no codigo por mudança da biblioteca

const { pool } = require('../database/database');

class Produto {
  constructor(idproduto, nome, preco, marca, fornecedor, unidade, sku, codbarra, categoria, condicao, datahora) {
    this.idproduto = idproduto;
    this.nome = nome;
    this.preco = preco;
    this.marca = marca;
    this.fornecedor = fornecedor;
    this.unidade = unidade;
    this.sku = sku;
    this.codbarra = codbarra;
    this.categoria = categoria;
    this.condicao = condicao;
    this.datahora = datahora;
  }

  static async adicionar(produto) {

    let conn;
    try {
      conn = await pool.getConnection();
  
      // Passo 1: Verificar se já existe um produto com o mesmo código de barras
      const [existingProduct] = await conn.execute(
        `SELECT codbarra FROM produtos WHERE codbarra = ?;`,
        [produto.codbarra]
      );
  
      // Passo 2: Condicionar a inserção
      if (existingProduct.length > 0) {
        return { error: "Já existe um produto cadastrado com este código de barras." }; // Ou lançar um erro
      } else {
        // Não existe produto com este código de barras, podemos inserir
        const [res] = await conn.execute(
          `INSERT INTO produtos (nome, preco, preco_promocional,marca, fornecedor, unidade, codbarra,categoria_id, condicao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [produto.nome, produto.preco, produto.preco_promocional, produto.marca, produto.fornecedor, produto.unidade, produto.codbarra, produto.categoria, produto.condicao]
        );
        return res; // res contém informações sobre a operação de inserção
      }
    }catch (error) {
      console.error('Erro ao realizar ao inserir produto:', error);
      throw error;
    }finally {
      if (conn) conn.release();
    }
  }

  static async listarProdutos() {
    let conn;
    try {
      conn = await pool.getConnection();
      const [rows] = await conn.execute('SELECT * FROM produtos');
      return rows; // rows será um array com os resultados da consulta
    } catch (error) {
      console.error('Erro ao realizar a consulta:', error);
      throw error;
    }
    finally {
      if (conn) conn.release();
    }
  }

  static async buscarPorId(id_produto) {
    let conn;
    try {
      conn = await pool.getConnection();
      const [rows] = await conn.execute('SELECT * FROM produtos WHERE id_produto = ?', [id_produto]);
      return rows[0]; // retorna o primeiro (e esperado único) resultado
    } catch (error) {
      console.error('Erro ao realizar a consulta:', error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }

  static async atualizar(id_produto, novosDados) {

    let conn;
    try {
      conn = await pool.getConnection();
      const [res] = await conn.execute(
        `UPDATE produtos SET nome = ?, preco = ?, preco_promocional = ?,marca = ?, fornecedor = ?, unidade = ?, codbarra = ?, categoria_id = ?, condicao = ?, datahora = ? WHERE id_produto = ?;`,
        [novosDados.nome, novosDados.preco, novosDados.preco_promocional,novosDados.marca, novosDados.fornecedor, novosDados.unidade, novosDados.codbarra, novosDados.categoria, novosDados.condicao, novosDados.datahora, id_produto]
      );
      return res; // res contém informações sobre a operação de atualização
    } catch (error) {
      console.error('Erro ao realizar a atualizacao:', error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }

  static async remover(id_produto) {
    let conn;
    try {
      conn = await pool.getConnection();
      const [res] = await conn.execute('DELETE FROM produtos WHERE id_produto = ?', [id_produto]);
      return res; // res contém informações sobre a operação de remoção
    } catch (error) {
      console.error('Erro ao realizar a delecao:', error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }

  static async buscarPorNome(nomeProduto) {
    let conn;
    try {
      conn = await pool.getConnection();
      const [res] = await conn.execute('SELECT * FROM produtos WHERE nome LIKE ?', [`%${nomeProduto}%`]);
      return res;
    } catch (error) {
      console.error('Erro ao realizar a consulta por nome:', error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }

  static async buscarPorCodigo(codigoBarras) {
    let conn;
    try {
      conn = await pool.getConnection();
      const [res] = await conn.execute('SELECT * FROM produtos WHERE codbarra = ?', [codigoBarras]);
      return res;
    } catch (error) {
      console.error('Erro ao realizar a consulta código de barras:', error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }

}

module.exports = Produto;