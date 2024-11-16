const { pool } = require('../database/database');

class Vendas {
  static async adicionarRegistrosDeVendas(venda, produtosDaVenda, tiposPagamentos) {
    let conn;
    try {
      const { valor_total, descricao, caixa_id, datahora } = venda;

      // Validações básicas
      if (!valor_total || !caixa_id || !datahora) {
        throw new Error("Dados da venda estão incompletos.");
      }

      if (!Array.isArray(produtosDaVenda) || !Array.isArray(tiposPagamentos)) {
        throw new Error("Produtos ou tipos de pagamento devem ser arrays.");
      }

      conn = await pool.getConnection();

      // Inserir a venda na tabela "vendas"
      const [res] = await conn.execute(
        `INSERT INTO vendas (valor_total, descricao, caixa_id, datahora) VALUES (?, ?, ?, ?)`,
        [valor_total, descricao, caixa_id, datahora]
      );

      const lastId = res.insertId;
      console.log("Venda inserida com ID:", lastId);

      // Inserir produtos da venda
      for (const produto of produtosDaVenda) {
        const { produto_id, quantidade, valor_total_produtos } = produto;

        if (!produto_id || !quantidade || !valor_total_produtos) {
          throw new Error("Dados do produto estão incompletos.");
        }

        await conn.execute(
          `INSERT INTO produto_vendas (venda_id, produto_id, quantidade, valor_total_produtos) VALUES (?, ?, ?, ?)`,
          [lastId, produto_id, quantidade, valor_total_produtos]
        );
      }

      // Inserir tipos de pagamento
      for (const tipoDePagamento of tiposPagamentos) {
        const { tipo_pagamento_id, valor } = tipoDePagamento;

        if (!tipo_pagamento_id || !valor) {
          throw new Error("Dados do tipo de pagamento estão incompletos.");
        }

        await conn.execute(
          `INSERT INTO vendas_tipo_pagamento (venda_id, tipo_pagamento_id, valor) VALUES (?, ?, ?)`,
          [lastId, tipo_pagamento_id, valor]
        );
      }

      return { success: true, venda_id: lastId };
    } catch (error) {
      console.error("Erro ao registrar venda:", error.message);
      throw error; // Repassa o erro para ser tratado em outro lugar
    } finally {
      if (conn) conn.release(); // Libera a conexão do pool
    }
  }
}

module.exports = Vendas;
