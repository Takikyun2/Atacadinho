const { pool } = require('../database/database');

class Login {

    // Adicionar um novo login
    static async adicionarLogin(login) {
        let conn;
        try {
            console.log(login);
            
            const { user, senha, status } = login;
     
            conn = await pool.getConnection();
            const [res] = await conn.execute(
                `INSERT INTO login (user, senha, status) VALUES (?, ?, ?)`,
                [user, senha, status]
            );
            return res; // Retorna informações sobre a inserção
        } finally {
            if (conn) conn.release();
        }
    }

    // Listar todos os logins
    static async listarLogins() {
        let conn;
        try {
            conn = await pool.getConnection();
            const [rows] = await conn.execute('SELECT * FROM login');
            return rows; // Retorna os registros
        } catch (error) {
            console.error('Erro ao realizar a consulta:', error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }

    // Validar login
    static async validarLogin(login) {
        let conn;
        try {
            console.log(login);
            
            const { user, senha, status } = login;
    
            if (status === true) { // Verifica se o status é verdadeiro
                conn = await pool.getConnection();
                const [res] = await conn.execute(
                    `SELECT id_login, user, status FROM login WHERE user = ? AND senha = ?`,
                    [user, senha]
                );

                if (res.length === 0) {
                    console.log("Login ou senha incorretos.");
                    return null; // Retorna nulo caso o login falhe
                }

                return res; // Retorna o resultado da consulta
            } else {
                console.log("O usuário está desligado e não tem permissão para logar!");
                return null; // Interrompe a execução da função
            }
        } finally {
            if (conn) conn.release(); // Libera a conexão, se aberta
        }
    }

    // Atualizar informações de login
    static async atualizarLogin(newLogin) {
        const { id_login, user, senha, status, datahoraupdate } = newLogin;

        let conn;
        try {
            conn = await pool.getConnection();
            const [res] = await conn.execute(
                `UPDATE login SET user = ?, senha = ?, status = ?, datahoraupdate = ? WHERE id_login = ?`,
                [user, senha, status, datahoraupdate, id_login]
            );
            return res; // Retorna informações sobre a atualização
        } catch (error) {
            console.error('Erro ao realizar a atualização da tabela de logins:', error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }

    // Remover login
    static async removerLogin(id_login) {
        let conn;
        try {
            conn = await pool.getConnection();
            const [res] = await conn.execute('DELETE FROM login WHERE id_login = ?', [id_login]);
            return res; // Retorna informações sobre a remoção
        } catch (error) {
            console.error('Erro ao realizar a exclusão do login:', error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }
}

module.exports = Login;
