
// Importa o modelo Login, que contém as operações de interação com o banco de dados
const Login = require('../models/login')

class LoginController {

    // Método estático para adicionar um novo login
    static async adicionarLogin(login) {
        try {
            // Chama o método 'adicionarLogin' do modelo Login, passando o objeto 'login' como argumento
            await Login.adicionarLogin(login);
        } catch (err) {
            // Se ocorrer um erro, cria e lança uma nova exceção com a mensagem de erro
            throw new Error('Erro ao adicionar login: ' + err.message)
        }
    }

    // Método estático para listar todos os logins
    static async listarLogins() {
        try { 
            // Chama o método 'listarLogins' do modelo Login para obter todos os logins
            await Login.listarLogins();
        } catch (err) {
            // Se ocorrer um erro, cria e lança uma nova exceção com a mensagem de erro
            throw new Error('Erro ao listar logins: ' + err.message)
        }
    }

    // Método estático para validar se o login é válido
    static async validarLogin(login) {
        try {
            // Chama o método 'validarLogin' do modelo Login, passando o objeto 'login' para validar
            await Login.validarLogin(login);
        } catch (err) {
            // Se ocorrer um erro, cria e lança uma nova exceção com a mensagem de erro
            throw new Error('Erro ao buscar login: ' + err.message)
        }
    }

    // Método estático para atualizar os dados de um login existente
    static async atualizarLogin(newLogin) {
        try {
            // Chama o método 'validarLogin' do modelo Login, passando o objeto 'newLogin' para validar (deveria chamar 'atualizarLogin')
            await Login.atualizarLogin(newLogin);
        } catch (err) {
            // Se ocorrer um erro, cria e lança uma nova exceção com a mensagem de erro
            throw new Error('Erro ao atualizar login: ' + err.message)
        }
    }

    // Método estático para remover um login existente
    static async removerLogin(id_login) {
        try {
            // Chama o método 'removerLogin' do modelo Login, passando o 'id_login' para remover o login correspondente
            await Login.removerLogin(id_login);
        } catch (err) {
            // Se ocorrer um erro, cria e lança uma nova exceção com a mensagem de erro
            throw new Error('Erro ao remover login: ' + err.message)
        }
    }
}

