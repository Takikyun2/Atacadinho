const { pool } = require('../database/database');
 
class Caixa {
  constructor(caixa) {
    this.caixa = caixa;
  }

  static async adicionarRegistroDeCaixa({ valor_inicial, login_id }) {
    let conn;
    try {
      conn = await pool.getConnection();
      const [res] = await conn.execute(
        `INSERT INTO caixa (valor_inicial, login_id_abertura) VALUES (?, ?)`,
        [valor_inicial, login_id]
      );

      const lastId = res.insertId; //pega o ultimo id cadastrado

      return { res, lastId }; // res contém informações sobre a operação de inserção
    } catch (error) {
      console.error("Erro ao realizar a insercao do registro de caixa:", error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }

  static async atualizarUltimoRegistroCaixaAberto({ valor_final, login_id }) {
    let conn;
    try {
      conn = await pool.getConnection();
      const [res] = await conn.execute(
        "UPDATE caixa AS c JOIN ( SELECT MAX(id_caixa) AS max_id FROM caixa ) AS subquery ON c.id_caixa = subquery.max_id SET c.data_fechamento = NOW(), c.valor_final = ? , c.login_id_fechamento = ? ;",
        [valor_final, login_id]
      );
      return res;
    } catch (error) {
      console.error("Erro ao realizar a consulta:", error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }

  static async listarRegistrosCaixa() {
    let conn;
    try {
      conn = await pool.getConnection();
      const [rows] = await conn.execute("SELECT * FROM caixa");
      return rows; // rows será um array com os resultados da consulta
    } catch (error) {
      console.error("Erro ao realizar a consulta:", error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }

  static async atualizarRegistroCaixa(newCaixa) {
    const {
      id_caixa,
      data_abertura,
      data_fechamento,
      valor_inicial,
      valor_final,
      login_id,
    } = newCaixa;

    let conn;
    try {
      conn = await pool.getConnection();
      const [res] = await conn.execute(
        `UPDATE caixa SET data_abertura = ?, data_fechamento = ?,valor_inicial = ?, valor_final = ?, login_id = ? WHERE id_caixa = ?`,
        [
          data_abertura,
          data_fechamento,
          valor_inicial,
          valor_final,
          login_id,
          id_caixa,
        ]
      );
      return res; // res contém informações sobre a operação de atualização
    } catch (error) {
      console.error("Erro ao realizar a atualizacao:", error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }

  static async removerRegistroCaixa(id_caixa) {
    let conn;
    try {
      conn = await pool.getConnection();
      const [res] = await conn.execute("DELETE FROM caixa WHERE id_caixa = ?", [
        id_caixa,
      ]);
      return res; // res contém informações sobre a operação de remoção
    } catch (error) {
      console.error("Erro ao realizar a delecao:", error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }

  static async adicionarRegistroDeSangria({
    caixa_id,
    valor_sangria,
    observacoes_sangria,
  }) {
    let conn;
    try {
      conn = await pool.getConnection();
      const [res] = await conn.execute(
        `INSERT INTO sangrias (caixa_id, valor_sangria, observacoes_sangria) VALUES (?, ?, ?)`,
        [caixa_id, valor_sangria, observacoes_sangria]
      );

      return res; // res contém informações sobre a operação de inserção
    } catch (error) {
      console.error(
        "Erro ao realizar a insercao do registro de sangria no DB:",
        error
      );
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }

  static async listarRegistrosCaixaAtual() {
    let conn;
    try {
      conn = await pool.getConnection();
      const [rows] = await conn.execute(`
          SELECT
          DATE_FORMAT(v.datahora, '%H:%i') AS hora_venda,
          SUM(v.valor_total) AS total_vendas
          FROM vendas v
          JOIN caixa c ON v.caixa_id = c.id_caixa
          WHERE c.id_caixa = (SELECT MAX(id_caixa) FROM caixa WHERE data_fechamento IS NULL)
          GROUP BY hora_venda
          ORDER BY v.datahora;
        `);
      return rows; // rows será um array com os resultados da consulta
    } catch (error) {
      console.error("Erro ao realizar a consulta:", error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }

  static async obterMovimentacaoCaixaAtual() {
    let conn;
    try {
        conn = await pool.getConnection();
        const [rows] = await conn.execute(`
        SELECT
            c.id_caixa,
            c.data_abertura,
            c.valor_inicial,
            'Valor Inicial' AS tipo_pagamento,
            0 AS valor_transacao,
            c.data_abertura AS datahora_transacao
        FROM
            caixa c
        WHERE
            c.id_caixa = (SELECT MAX(id_caixa) FROM caixa WHERE data_fechamento IS NULL)
        UNION ALL
        SELECT
            v.caixa_id,
            c.data_abertura,
            c.valor_inicial,
            tp.descricao AS tipo_pagamento,
            vtp.valor AS valor_transacao,
            v.datahora AS datahora_transacao
        FROM
            vendas v
        INNER JOIN
            caixa c ON v.caixa_id = c.id_caixa
        INNER JOIN
            vendas_tipo_pagamento vtp ON v.id_venda = vtp.venda_id
        INNER JOIN
            tipo_pagamento tp ON vtp.tipo_pagamento_id = tp.id_tipo_pagamento
        WHERE
            v.caixa_id = (SELECT MAX(id_caixa) FROM caixa WHERE data_fechamento IS NULL)
        UNION ALL
        SELECT
            s.caixa_id,
            c.data_abertura,
            c.valor_inicial,
            'Sangria' AS tipo_pagamento,
            -s.valor_sangria AS valor_transacao,
            s.datahoraregistro AS datahora_transacao
        FROM
            sangrias s
        INNER JOIN
            caixa c ON s.caixa_id = c.id_caixa
        WHERE
            s.caixa_id = (SELECT MAX(id_caixa) FROM caixa WHERE data_fechamento IS NULL)
        ORDER BY
            datahora_transacao;
        `);

        let totalVendas = 0;
        let totalRetiradas = 0;
        let movimentacoes = [];
        let aberturaAdicionada = false;

        for (const row of rows) {
            if (row.tipo_pagamento === 'Valor Inicial' && !aberturaAdicionada) {
                movimentacoes.push({
                    tipo: 'Abertura',
                    datahora: row.data_abertura,
                    valor: row.valor_inicial
                });
                aberturaAdicionada = true;
            } else if (row.tipo_pagamento === 'Sangria') {
                totalRetiradas += row.valor_transacao;
                movimentacoes.push({
                    tipo: 'Sangria',
                    datahora: row.datahora_transacao,
                    valor: row.valor_transacao
                });
            } else if (row.tipo_pagamento !== 'Valor Inicial') {
                totalVendas += row.valor_transacao;
                movimentacoes.push({
                    tipo: row.tipo_pagamento,
                    datahora: row.datahora_transacao,
                    valor: row.valor_transacao
                });
            }
        }
         // Se não houver nenhuma linha de "Valor Inicial" (o que não deveria acontecer), adiciona a abertura manualmente
        if (!aberturaAdicionada) {
           const [caixaAtual] = await conn.execute(`
           SELECT data_abertura, valor_inicial
           FROM caixa
           WHERE id_caixa = (SELECT MAX(id_caixa) FROM caixa WHERE data_fechamento IS NULL)
           `);
           if(caixaAtual.length > 0){
                movimentacoes.push({
                    tipo: 'Abertura',
                    datahora: caixaAtual.data_abertura,
                    valor: caixaAtual.valor_inicial
                });
           }
        }
        return {
            movimentacoes: movimentacoes,
            totalVendas: totalVendas,
            totalRetiradas: totalRetiradas
        };
        
    } catch (error) {
      console.error("Erro ao realizar a consulta:", error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }
}
 
module.exports = Caixa;
