const { pool } = require('../database/database');

const bcrypt = require('bcrypt');

// Função para criptografar a senha
async function hashPassword(password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

class Login {

    // Adicionar um novo login
    static async adicionarLogin(login) {
        let conn;
        try {
            const {nomeCompleto , user, senha, cpf, user_type_id} = login

            // Criptografar a senha
            const hashedPassword = await hashPassword(senha);
            
            conn = await pool.getConnection();
            const [res] = await conn.execute(
                `INSERT INTO login ( nomecompleto ,user, senha, cpf, user_type_id) VALUES (?, ?, ?, ?, ?)`,
                [nomeCompleto , user, hashedPassword, cpf, user_type_id]
            );
            return res; // Retorna informações sobre a inserção
        }catch (error) {
            console.error('Erro ao realizar a consulta:', error);
            throw error;
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

    static async validarLogin({ user, senha }) {
        let conn;
        try {
            conn = await pool.getConnection();
            
            const [rows] = await conn.query(
                `SELECT id_login, nomecompleto, user, senha, cpf, status, user_type_id 
                FROM login 
                WHERE user = ?`, 
                [user]
            );

            if (rows.length === 0) {
                console.log("Login ou senha incorretos.");
                return null; // Retorna nulo caso o login falhe
            }

            const login = rows[0];

            // Comparar a senha fornecida com a senha criptografada no banco de dados
            const isMatch = await bcrypt.compare(senha, login.senha);
            if (!isMatch) {
                console.log("Login ou senha incorretos.");
                return null; // Retorna nulo caso a senha não corresponda
            }

            // Remover a senha do objeto antes de retornar
            delete login.senha;

            // Retorna o primeiro resultado encontrado
            return login;

        } catch (error) {
            console.error('Erro ao realizar a consulta de users:', error);
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
