const Categoria = require('../models/Categoria');

class CategoriaController {

  static async listarCategoria() {
    try {
      return await Categoria.listarTodos();
    } catch (err) {
      throw new Error('Erro ao listar categorias: ' + err.message)
    }
  }
}
module.exports = CategoriaController;
