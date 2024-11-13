const { pool } = require('../database/database');
 
class Caixa {
  constructor(caixa) {
    this.caixa = caixa
  }

 
  static async adicionarRegistroDeCaixa(caixa) {    
    let conn;
    try {
        console.log(caixa);
        
        const {data_abertura, data_fechamento, valor_inicial, valor_final, observacoes,login_id} = caixa
 
      conn = await pool.getConnection();
      const [res] = await conn.execute(
        `INSERT INTO caixa (data_abertura, data_fechamento, valor_inicial, valor_final, observacoes, login_id) VALUES (?, ?, ?, ?, ?, ?)`,
        [
            data_abertura,
            data_fechamento,
            valor_inicial,
            valor_final,
            observacoes,
            login_id
        ]
      );
      return res; // res contém informações sobre a operação de inserção
    } finally {
      if (conn) conn.release();
    }
  }
 
  static async listarRegistrosCaixa() {
    let conn;
    try {
      conn = await pool.getConnection();
      const [rows] = await conn.execute('SELECT * FROM caixa');
      return rows; // rows será um array com os resultados da consulta
    } catch (error) {
      console.error('Erro ao realizar a consulta:', error);
      throw error;
    }
    finally {
      if (conn) conn.release();
    }
  }
 
 
  static async atualizarRegistroCaixa(newCaixa) {
    const {id_caixa, data_abertura, data_fechamento, valor_inicial, valor_final, observacoes,login_id} = newCaixa
 
    let conn;
    try {
      conn = await pool.getConnection();
      const [res] = await conn.execute(
        `UPDATE caixa SET data_abertura = ?, data_fechamento = ?,valor_inicial = ?, valor_final = ?, observacoes = ?, login_id = ? WHERE id_caixa = ?`,
        [   data_abertura,
            data_fechamento,
            valor_inicial,
            valor_final,
            observacoes,
            login_id,
            id_caixa
        ]
      );
      return res; // res contém informações sobre a operação de atualização
    } catch (error) {
      console.error('Erro ao realizar a atualizacao:', error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }
 
  static async removerRegistroCaixa(id_caixa) {
    let conn;
    try {
      conn = await pool.getConnection();
      const [res] = await conn.execute('DELETE FROM caixa WHERE id_caixa = ?', [id_caixa]);
      return res; // res contém informações sobre a operação de remoção
    } catch (error) {
      console.error('Erro ao realizar a delecao:', error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }
 
 
 
}
 
module.exports = Caixa;
