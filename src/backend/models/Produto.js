// Clayton - classe produto e seus metodos
// Eduardo - alteração no codigo por mudança da biblioteca

const { pool } = require('../database/database');

class Produto {
  constructor(idproduto, nome, preco, unidade, sku, codbarra, categoria, condicao, datahora) {
    this.idproduto = idproduto;
    this.nome = nome;
    this.preco = preco;
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
      const [res] = await conn.execute(
        `INSERT INTO produtos (nome, preco, unidade, sku, codbarra,categoria_id, condicao, datahora) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [produto.nome, produto.preco, produto.unidade, produto.sku, produto.codbarra, produto.categoria, produto.condicao, produto.datahora]
      );
      return res; // res contém informações sobre a operação de inserção
    } finally {
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

  static async buscarPorId(idproduto) {
    let conn;
    try {
      conn = await pool.getConnection();
      const [rows] = await conn.execute('SELECT * FROM produtos WHERE idproduto = ?', [idproduto]);
      return rows[0]; // retorna o primeiro (e esperado único) resultado
    } catch (error) {
      console.error('Erro ao realizar a consulta:', error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }

  static async atualizar(idproduto, novosDados) {
    let conn;
    try {
      conn = await pool.getConnection();
      const [res] = await conn.execute(
        `UPDATE produtos SET nome = ?, preco = ?, unidade = ?, sku = ?, categoria_id = ?, condicao = ? WHERE idproduto = ?`,
        [novosDados.nome, novosDados.preco, novosDados.unidade, novosDados.sku, novosDados.categoria, novosDados.condicao, idproduto]
      );
      return res; // res contém informações sobre a operação de atualização
    } catch (error) {
      console.error('Erro ao realizar a atualizacao:', error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }

  static async remover(idproduto) {
    let conn;
    try {
      conn = await pool.getConnection();
      const [res] = await conn.execute('DELETE FROM produtos WHERE idproduto = ?', [idproduto]);
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