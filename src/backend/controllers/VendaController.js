const Vendas = require('../models/Vendas');
 
class VendasController {
 
    static async adicionarRegistrosDeVendas(venda, produtosDaVenda, tipoDePagamentoDaVenda) {
        try {
          await Vendas.adicionarRegistrosDeVendas(venda,produtosDaVenda, tipoDePagamentoDaVenda);
        } catch (err) {
          throw new Error('Erro ao adicionar registro de venda: ' + err.message)
        }
    }
 
    static async listarExtratoPorTiposDePagamentos() {
        try {
          return await Vendas.listarExtratoPorTiposDePagamentos();
        } catch (err) {
          throw new Error('Erro ao listar registros de venda: ' + err.message)
        }
    }
    static async listarRegistrosDeVendas() {
        try {
          return await Vendas.listarVendas();
        } catch (err) {
          throw new Error('Erro ao listar registros de venda: ' + err.message)
        }
    }
 
    static async atualizarRegistrosDeVendas(newVenda, produtosDaVenda) {
        try {
          await Caixa.atualizarRegistroCaixa(newVenda, produtosDaVenda);
        } catch (err) {
          throw new Error('Erro ao atualizar registros de venda: ' + err.message)
        }
    }
 
    static async removerRegistrosDeVendas(id_venda) {
        try {
          await Caixa.removerRegistroCaixa(id_venda);
        } catch (err) {
          throw new Error('Erro ao remover registro venda: ' + err.message)
        }
      }
 
}

module.exports = VendasController;