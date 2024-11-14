const { pool } = require('../database/database');
 
class Vendas {

  static async adicionarRegistrosDeVendas(venda, produtosDaVenda) {    
    let conn;
    try {
        console.log(venda);
        console.log(produtosDaVenda);
        
        const {valor_total, descricao, caixa_id, datahora} = venda
 
      conn = await pool.getConnection();
      let [res] = await conn.execute(
        `INSERT INTO vendas (valor_total, descricao, caixa_id, datahora) VALUES (?, ?, ?, ?)`,
        [
            valor_total,
            descricao,
            caixa_id,
            datahora
        ]
      );
      //Pega o ultimo id da venda cadastrada no DB
      const lastId = res.insertId;
      console.log(lastId);

      //Percorre o array de objetos com os produtos da venda e manda cada produto para a funcao que adiciona no DB
      produtosDaVenda.forEach(async produto => await adicionarProdutosDaVenda(produto))

      //funcao responsavel por inserir individalmente cada produto da venda na tabela de produto_vendas
      async function adicionarProdutosDaVenda(produto){

        let {produto_id, quantidade, valor_total_produtos} = produto

        console.log(produto_id, quantidade, valor_total_produtos);
        

        [res] = await conn.execute(
          `INSERT INTO produto_vendas (venda_id, produto_id, quantidade, valor_total_produtos) VALUES (?, ?, ?, ?)`,
          [
            lastId, produto_id, quantidade, valor_total_produtos
          ]
        );
      }
      
      return res; // res contém informações sobre a operação de inserção
    } finally {
      if (conn) conn.release();
    }
    

  }
 
 
}
 
module.exports = Vendas;
