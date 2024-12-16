const Categoria = require('../models/Categoria');

class CategoriaController {

  static async listarCategoria() {
    try {
      return await Categoria.listarTodos();
    } catch (err) {
      throw new Error('Erro ao listar categorias: ' + err.message)
    }
  }
  
  static async listarQuantidadeDeProdutosVendidos() {
    try {
      return await Categoria.listarQuantidadeDeProdutosVendidos();
    } catch (err) {
      throw new Error('Erro ao listar categorias: ' + err.message)
    }
  }

  static async listarESomarValorProdutosVendidosCategorias() {
    try {
      return await Categoria.listarESomarValorProdutosVendidosCategorias();
    } catch (err) {
      throw new Error('Erro ao listar categorias: ' + err.message)
    }
  }

  static async listarESomarCategoriasVendidasNoPeriodo(periodo) {
    try {
      return await Categoria.listarESomarCategoriasVendidasNoPeriodo(periodo);
    } catch (err) {
      throw new Error('Erro ao listar categorias: ' + err.message)
    }
  }
}
module.exports = CategoriaController;
