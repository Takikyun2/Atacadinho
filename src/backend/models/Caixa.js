const { pool } = require('../database/database');
 
class Caixa {
  constructor(caixa) {
    this.caixa = caixa
  }

 
  static async adicionarRegistroDeCaixa({valor_inicial,login_id}) {    
    let conn;
    try { 
      conn = await pool.getConnection();
      const [res] = await conn.execute(
        `INSERT INTO caixa (valor_inicial, login_id) VALUES (?, ?)`,
        [
            valor_inicial,
            login_id
        ]
      );
      return res; // res contém informações sobre a operação de inserção
    }catch (error) {
      console.error('Erro ao realizar a insercao do registro de caixa:', error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }
 
  static async atualizarUltimoRegistroCaixaAberto({valor_final}) {
    let conn;
    try {
      conn = await pool.getConnection();
      const [res] = await conn.execute('UPDATE caixa AS c JOIN ( SELECT MAX(id_caixa) AS max_id FROM caixa ) AS subquery ON c.id_caixa = subquery.max_id SET c.data_fechamento = NOW(), c.valor_final = ? ;', [valor_final]);
      return res; 
    } catch (error) {
      console.error('Erro ao realizar a consulta:', error);
      throw error;
    }
    finally {
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
    const {id_caixa, data_abertura, data_fechamento, valor_inicial, valor_final,login_id} = newCaixa
 
    let conn;
    try {
      conn = await pool.getConnection();
      const [res] = await conn.execute(
        `UPDATE caixa SET data_abertura = ?, data_fechamento = ?,valor_inicial = ?, valor_final = ?, login_id = ? WHERE id_caixa = ?`,
        [   data_abertura,
            data_fechamento,
            valor_inicial,
            valor_final,
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
 

  static async adicionarRegistroDeSangria({caixa_id,valor_sangria, observacoes_sangria}) {    
    let conn;
    try { 
      conn = await pool.getConnection();
      const [res] = await conn.execute(
        `INSERT INTO sangrias (caixa_id, valor_sangria, observacoes_sangria) VALUES (?, ?, ?)`,
        [
          caixa_id,
          valor_sangria,
          observacoes_sangria
        ]
      );
      return res; // res contém informações sobre a operação de inserção
    }catch (error) {
      console.error('Erro ao realizar a insercao do registro de sangria no DB:', error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }
 
 
}
 
module.exports = Caixa;
