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
  
  static async listarESomarCategoriasVendidasNoPeriodo({ tipoPeriodo, ano, mes, semana }) {
    let conn;
    try {
        conn = await pool.getConnection();
        
        let query = `
            SELECT 
              c.categoriaproduto AS categoria,
              COALESCE(SUM(pv.valor_total_produtos), 0) AS valor_total_vendido
            FROM 
              categoria c
            LEFT JOIN 
              produtos p ON p.categoria_id = c.idcategoria
            LEFT JOIN 
              produto_vendas pv ON pv.produto_id = p.id_produto
            LEFT JOIN 
              vendas v ON pv.venda_id = v.id_venda
        `;
        
        if (tipoPeriodo === 'dia') {
            query += `
                WHERE DATE(v.datahora) = CURDATE()
            `;
        } else if (tipoPeriodo === 'semana') {
            query += `
                WHERE YEARWEEK(v.datahora, 1) = YEARWEEK(CURDATE(), 1)
            `;
        } else if (tipoPeriodo === 'mes') {
            query += `
                WHERE YEAR(v.datahora) = ? AND MONTH(v.datahora) = ?
            `;
        } else if (tipoPeriodo === 'ano') {
            query += `
                WHERE YEAR(v.datahora) = ?
            `;
        }
        
        query += `
            GROUP BY 
              c.categoriaproduto;
        `;
        
        const parametros = tipoPeriodo === 'mes' || tipoPeriodo === 'ano' ? [ano, mes] : [];
        const [rows] = await conn.query(query, parametros); // Passa parâmetros, se necessário
        
        return rows;
    } catch (error) {
        console.error('Erro ao realizar a consulta:', error);
        throw error;
    } finally {
        if (conn) conn.release();
    }
  }

  static async listarESomarCategoriasVendidasSemana(semana) {
    let conn;
    try {
        const inicioDoDia = `${dia} 00:00:00`;
        const fimDoDia = `${dia} 23:59:59`;

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
          LEFT JOIN 
            vendas v ON pv.venda_id = v.id_venda
          WHERE 
            YEARWEEK(v.datahora, 1) = YEARWEEK(CURDATE(), 1)
          GROUP BY 
            c.categoriaproduto;
      `, [inicioDoDia, fimDoDia]); // Passa o dia como parâmetro para a query
        return rows; 
    } catch (error) {
        console.error('Erro ao realizar a consulta:', error);
        throw error;
    } finally {
        if (conn) conn.release();
    }
  }

  static async listarESomarCategoriasVendidasMes(data) {
    const {mes, ano} = data
    let conn;
    try {
        const inicioDoDia = `${dia} 00:00:00`;
        const fimDoDia = `${dia} 23:59:59`;

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
          LEFT JOIN 
            vendas v ON pv.venda_id = v.id_venda
          WHERE 
            YEAR(v.datahora) = YEAR(?) AND MONTH(v.datahora) = MONTH(?)
          GROUP BY 
            c.categoriaproduto;
      `, [ano, mes]); // Passa o dia como parâmetro para a query
        return rows; 
    } catch (error) {
        console.error('Erro ao realizar a consulta:', error);
        throw error;
    } finally {
        if (conn) conn.release();
    }
  }

  static async listarESomarCategoriasVendidasAno(ano) {
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
          LEFT JOIN 
            vendas v ON pv.venda_id = v.id_venda
          WHERE 
            YEAR(v.datahora) = YEAR(?)
          GROUP BY 
            c.categoriaproduto;
      `, [ano]); // Passa o dia como parâmetro para a query
        return rows; 
    } catch (error) {
        console.error('Erro ao realizar a consulta:', error);
        throw error;
    } finally {
        if (conn) conn.release();
    }
  }
}

module.exports = Categoria;
