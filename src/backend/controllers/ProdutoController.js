// Clayton - classe produto e seus metodos
// Eduardo - alteração no codigo por mudança da biblioteca
const mongoose = require('mongoose');
const { Produto } = require("../database/database");



class ProdutoController {

  static async adicionarProduto(produto) {
    
    try {
      const preco = produto.preco.replace(",", ".")
      await Produto.create({
        nome: produto.nome,
        preco: mongoose.Types.Decimal128.fromString(preco),
        unidade: produto.unidade,
        sku: produto.sku,
        codigoBarras: produto.codbarra,
        categoria: mongoose.Types.ObjectId.createFromHexString(produto.categoria), // substitua pelo ObjectId da categoria
        ativo: true,
      });
      return { sucesso: true };

    } catch (err) {
      console.log(err);
      return { erro: ('Erro ao adicionar produto: ' + err.message), sucesso: false }
    }
  }
  static async listarProdutos() {
    try {

      const produtos = await Produto.find().lean(); // .lean() para retornar objetos simples
      const produtosComIdString = produtos.map(produto => ({
        ...produto,
        _id: produto._id.toString(), // Converte _id para string
        preco: parseFloat(produto.preco.toString()), // Converte Decimal128 para float
      }));
      return (produtosComIdString)
    } catch (err) {
      throw new Error('Erro ao listar produtos: ' + err.message)
    }
  }

  static async buscarProdutoPorId(id) {
    try {
      return await Produto.findById(id);
    } catch (err) {
      throw new Error('Erro ao buscar produto: ' + err.message)
    }
  }

  static async atualizarProduto(id, novosDados) {
    try {
      await Produto.findByIdAndUpdate(
        id,
        novosDados,
        { new: true, runValidators: true } // 'new' retorna o documento atualizado
      );
    } catch (err) {
      throw new Error('Erro ao atualizar produto: ' + err.message)
    }
  }

  static async removerProduto(id) {
    try {
      await Produto.findByIdAndDelete(id);
    } catch (err) {
      throw new Error('Erro ao remover produto: ' + err.message)
    }
  }

}

module.exports = ProdutoController;

