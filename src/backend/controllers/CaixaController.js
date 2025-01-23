const Caixa = require('../models/Caixa');
 
 class CaixaController {
 
    static async adicionarRegistroDeCaixa(caixa) {
        try {
          return await Caixa.adicionarRegistroDeCaixa(caixa);
        } catch (err) {
          throw new Error('Erro ao adicionar registro de caixa: ' + err.message)
        }
    }

    static async atualizarUltimoRegistroCaixaAberto(fechaCaixa) {
      try {
        return await Caixa.atualizarUltimoRegistroCaixaAberto(fechaCaixa);
      } catch (err) {
        throw new Error('Erro ao atualizar registro de caixa: ' + err.message)
      }
  }
 
    static async listarRegistrosCaixa() {
        try {
          return await Caixa.listarRegistrosCaixa();
        } catch (err) {
          throw new Error('Erro ao listar registros de caixa: ' + err.message)
        }
    }

    static async listarRegistrosCaixaAtual() {
        try {
          return await Caixa.listarRegistrosCaixaAtual();
        } catch (err) {
          throw new Error('Erro ao listar registros do caixa atual: ' + err.message)
        }
    }
    
    static async obterMovimentacaoCaixaAtual() {
        try {
          return await Caixa.obterMovimentacaoCaixaAtual();
        } catch (err) {
          throw new Error('Erro ao listar registros do caixa atual: ' + err.message)
        }
    }
 
    static async atualizarRegistrosCaixa(newCaixa) {
        try {
          return await Caixa.atualizarRegistroCaixa(newCaixa);
        } catch (err) {
          throw new Error('Erro ao atualizar registros de caixa: ' + err.message)
        }
    }
 
    static async removerRegistroCaixa(id_caixa) {
        try {
          return await Caixa.removerRegistroCaixa(id_caixa);
        } catch (err) {
          throw new Error('Erro ao remover registro caixa: ' + err.message)
        }
      }

    static async adicionarRegistroDeSangria(sangria) {
        try {
          return await Caixa.adicionarRegistroDeSangria(sangria);
        } catch (err) {
          throw new Error('Erro ao adicionar registro de sangria: ' + err.message)
        }
    }
 
}

module.exports = CaixaController;