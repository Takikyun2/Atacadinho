const { pool } = require('../database/database');

class Categoria {
  constructor(idcategoria, categoriaproduto) {
    this.idcategoria = idcategoria;
    this.categoriaproduto = categoriaproduto;
  }

  static async listarTodos() {
    let conn;
    try {
      conn = await pool.getConnection();
      const [rows] = await conn.query('SELECT * FROM categoria');
      return rows; // rows será um array de objetos, onde cada objeto representa uma categoria
    } catch (error) {
      console.error('Erro ao realizar a consulta:', error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }
  
  static async listarQuantidadeDeProdutosVendidos() {
    let conn;
    try {
        conn = await pool.getConnection();
        const [rows] = await conn.query(`
            SELECT 
              c.categoriaproduto AS categoria, 
              COALESCE(SUM(pv.quantidade), 0) AS total_produtos_vendidos
            FROM 
              categoria c
            LEFT JOIN 
              produtos p ON p.categoria_id = c.idcategoria
            LEFT JOIN 
              produto_vendas pv ON pv.produto_id = p.id_produto
            GROUP BY 
              c.categoriaproduto;
        `);
        return rows; // rows será um array de objetos, onde cada objeto representa uma categoria
    } catch (error) {
        console.error('Erro ao realizar a consulta:', error);
        throw error;
    } finally {
        if (conn) conn.release();
    }
  }

  static async listarESomarValorProdutosVendidosCategorias() {
    let conn;
    try {
        conn = await pool.getConnection();
        const [rows] = await conn.query(`
            SELECT 
              c.categoriaproduto AS categoria,
              COALESCE(SUM(pv.valor_total_produtos), 0) AS valor_total_vendido
            FROM 
              categoria c
            LEFT JOIN 
              produtos p ON p.categoria_id = c.idcategoria
            LEFT JOIN 
              produto_vendas pv ON pv.produto_id = p.id_produto
            GROUP BY 
              c.categoriaproduto;
        `);
        return rows; // rows será um array de objetos, onde cada objeto representa uma categoria
    } catch (error) {
        console.error('Erro ao realizar a consulta:', error);
        throw error;
    } finally {
        if (conn) conn.release();
    }
  }
}

module.exports = Categoria;
