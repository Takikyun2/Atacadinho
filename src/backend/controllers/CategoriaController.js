const { Categoria } = require("../database/database");


class CategoriaController {

  static async listarCategoria() {
    try { 
      const categorias = await Categoria.find().lean(); // .lean() para retornar objetos simples
      const categoriasComIdString = categorias.map(categoria => ({
        ...categoria,
        _id: categoria._id.toString(), // Converte _id para string
      }));
      return(categoriasComIdString)
    } catch (err) {
      throw new Error('Erro ao listar categorias: ' + err.message)
    }
  }
}
module.exports = CategoriaController;
