const Produto = require('../models/Produto')

class CompraController {

  static async buscarProdutoPorNome(req, res) {
    const { nomeProduto, quantidade } = req.body

    // ! Verificação e validacao dos dados

    if (!nomeProduto || typeof nomeProduto !== 'string') {
      return res.status(400).send({ messsage: 'Nome do produto inválido' })
    }

    if (!quantidade || typeof quantidade !== 'number' || quantidade <= 0) {
      return res.status(400).send({ messsage: 'Quantidade inválida' })
    }

    // & Busca dos produtos por nome

    try {
      const produtos = await Produto.buscarPorNome(nomeProduto);
      if (produtos.length > 0) {
        const produtoSelecionado = produtos[0];
        const total = produtoSelecionado.preco * quantidade;
        return res.send({ produto: produtoSelecionado, total });
      } else {
        return res.status(404).send({ message: 'Nenhum produto encontrado' });
      }
    } catch (err) {
      console.error('Erro ao buscar produtos:', err.message);
      return res.status(500).send({ message: 'Erro ao buscar produto' })
    }
  }

  static async buscarProdutosPorCodigo(req, res) {
    const { codigoBarras, quantidade } = req.body;

    // ! Verificação e validacao dos dados

    if (!codigoBarras || typeof codigoBarras !== 'string') {
      return res.status(400).send({ message: 'Codigo de barras inválido' })
    }

    if (!quantidade || typeof quantidade !== 'number' || quantidade <= 0) {
      return res.status(400).send({ message: 'Quantidade inválida' })
    }

    // & Busca dos produtos por codigo de barras

    try {
      const produto = await Produto.buscarPorCodigo(codigoBarras);
      if (produto) {
        const total = produto.preco * quantidade;
        return res.send({ produto, total }); // retorna o produto e o total calculado
      } else {
        return res.status(404).send({ message: 'Nenhum produto encontrado' })
      }
    } catch (err) {
      console.error('Erro ao buscar produtos:', err.message);
      return res.status(500).send({ message: 'Erro ao buscar produto' })
    }
  }

}

module.exports = CompraController;