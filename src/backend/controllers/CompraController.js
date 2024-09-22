const Produto = require('../models/Produto')

class CompraController {

  static async buscarProdutoPorNome(args) {

    console.log('Dados recebidos no backend: ', args)

    const { nomeProduto, quantidade } = args;

    // ! Verificação e validacao dos dados

    if (!nomeProduto || typeof nomeProduto !== 'string') {
      console.log('Nome do produto inválido', nomeProduto);
      return { status: 400, messsage: 'Nome do produto inválido' };
    }

    if (!quantidade || typeof quantidade !== 'number' || quantidade <= 0) {
      console.log('Quantidade inválida', quantidade);
      return { status: 400, messsage: 'Quantidade inválida' };
    }

    // & Busca dos produtos por nome

    try {
      const produtos = await Produto.buscarPorNome(nomeProduto);
      if (produtos.length > 0) {
        const produtoSelecionado = produtos[0];
        const total = produtoSelecionado.preco * quantidade;
        return { status: 200, produto: produtoSelecionado, total };
      } else {
        return { status: 404, message: 'Nenhum produto encontrado' };
      }
    } catch (err) {
      console.error('Erro ao buscar produtos:', err.message);
      return { status: 500, message: 'Erro ao buscar produto' };
    }
  }

  static async buscarProdutosPorCodigo(args) {

    console.log('Dados recebidos no backend: ', args)
    const { codigoBarras, quantidade } = args;

    // ! Verificação e validacao dos dados

    if (!codigoBarras || typeof codigoBarras !== 'string') {
      console.log('Codigo do produto inválido', codigoBarras);
      return { status: 400, message: 'Codigo de barras inválido' };
    }

    if (!quantidade || typeof quantidade !== 'number' || quantidade <= 0) {
      console.log('Quantidade inválida', quantidade);
      return { status: 400, message: 'Quantidade inválida' };
    }

    // & Busca dos produtos por codigo de barras

    try {
      const produto = await Produto.buscarPorCodigo(codigoBarras);
      if (produto) {
        const total = produto.preco * quantidade;
        return { status: 200, produto, total }; // retorna o produto e o total calculado
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