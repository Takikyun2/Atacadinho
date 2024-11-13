const Caixa = require('../models/Caixa');
 
 class CaixaController {
 
    static async adicionarRegistroDeCaixa(caixa) {
        try {
          await Caixa.adicionarRegistroDeCaixa(caixa);
        } catch (err) {
          throw new Error('Erro ao adicionar registro de caixa: ' + err.message)
        }
    }
 
    static async listarRegistrosCaixa() {
        try {
          return await Produto.listarRegistrosCaixa();
        } catch (err) {
          throw new Error('Erro ao listar registros de caixa: ' + err.message)
        }
    }
 
    static async atualizarRegistrosCaixa(newCaixa) {
        try {
          await Caixa.atualizarRegistroCaixa(newCaixa);
        } catch (err) {
          throw new Error('Erro ao atualizar registros de caixa: ' + err.message)
        }
    }
 
    static async removerRegistroCaixa(id_caixa) {
        try {
          await Caixa.removerRegistroCaixa(id_caixa);
        } catch (err) {
          throw new Error('Erro ao remover registro caixa: ' + err.message)
        }
      }
 
}

module.exports = CaixaController;