// Clayton - classe produto e seus metodos
// Eduardo - alteração no codigo por mudança da biblioteca

const Produto = require('../models/Produto')

class ProdutoController {

  static async adicionarProduto(produto) {
    try {
      await Produto.adicionar(produto);
    } catch (err) {
      throw new Error('Erro ao adicionar produto: ' + err.message)
    }
  }

  static async listarProdutos() {
    try {
      return await Produto.listarProdutos();
    } catch (err) {
      throw new Error('Erro ao listar produtos: ' + err.message)
    }
  }

  static async buscarProdutoPorId(id) {
    try {
      return await Produto.buscarPorId(id);
    } catch (err) {
      throw new Error('Erro ao buscar produto: ' + err.message)
    }
  }

  static async atualizarProduto(id, novosDados) {
    try {
      await Produto.atualizar(id, novosDados);
    } catch (err) {
      throw new Error('Erro ao atualizar produto: ' + err.message)
    }
  }

  static async removerProduto(id) {
    try {
      await Produto.remover(id);
    } catch (err) {
      throw new Error('Erro ao remover produto: ' + err.message)
    }
  }

}

module.exports = ProdutoController;

