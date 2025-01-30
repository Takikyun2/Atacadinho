const Produto = require('../models/Produto')

class CompraController {

  static async buscarProdutoPorNome(nomeProduto) {

    // ! Verificação e validacao dos dados

    if (!nomeProduto || typeof nomeProduto !== 'string') {
      console.log('Nome do produto inválido', nomeProduto);
      return { status: 400, messsage: 'Nome do produto inválido' };
    }

    // & Busca dos produtos por nome

    try {
      const produtos = await Produto.buscarPorNome(nomeProduto);
      if (produtos.length > 0) {
        const produtoSelecionado = produtos;
        return produtoSelecionado;
      } else {
        return false; //retorne false se não encontrar produtos
      }
    } catch (err) {
      console.error('Erro ao buscar produtos:', err.message);
      return { status: 500, message: 'Erro ao buscar produto' };
    }
  }

  static async buscarProdutosPorCodigo(codigoBarras) {

    console.log('Dados recebidos no backend: ', codigoBarras)

    // ! Verificação e validacao dos dados

    if (!codigoBarras || typeof codigoBarras !== 'string') {
      console.log('Codigo do produto inválido', codigoBarras);
      return { status: 400, message: 'Codigo de barras inválido' };
    }

    // & Busca dos produtos por codigo de barras

    try {
      const produto = await Produto.buscarPorCodigo(codigoBarras);
      if (produto) {
        return produto; // retorna o produto 
      } else {
        return { status: 404, message: 'Nenhum produto encontrado' };
      }
    } catch (err) {
      console.error('Erro ao buscar produtos:', err.message);
      return { status: 500, message: 'Erro ao buscar produto' };
    }
  }

}

module.exports = CompraController;