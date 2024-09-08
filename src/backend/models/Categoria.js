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
}

module.exports = Categoria;
