const userFunctions = require('./functions/user');
const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const express = require('express');
const multipart = require('lambda-multipart-parser');
const Joi = require('joi');


module.exports.users = async (event) => {
    const userId = event.requestContext.authorizer.principalId;
    
    try {
        const users = await connection.execute('SELECT * FROM users');
        return {
            statusCode: 200,
            body: JSON.stringify(users),
      };
    } catch (error) {
      return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
};

module.exports.createSolicitationHelpinho = async (event) => {

    try {
        let connection;
        const decoded = verifyToken(event);
  
        if (decoded.statusCode) {
            return decoded;
        }
      
        const data = JSON.parse(event.body);
        const { descricao, titulo, solicitante_id, meta, categoria } = data;
        const schema = Joi.object({
            categoria: Joi.required().messages({
                'any.required': 'categoria é obrigatório'
            }),
            meta: Joi.required().messages({
                'any.required': 'meta é obrigatório'
            }),       
        });

        const { error } = schema.validate({ categoria, meta });

        if (error) {
            return {
                statusCode: 422,
                body: JSON.stringify({ message: error.details[0].message }),
            };
        }
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        const [result] = await connection.execute(
            'INSERT INTO solicitation_helpinho (descricao, titulo, solicitante_id, meta, categoria) VALUES (?, ?, ?,?,?)',
            [descricao, titulo, solicitante_id, meta, categoria]
        );
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Dados salvos com sucesso no banco de dados',
                insertId: result.insertId
            })
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Erro ao salvar no banco de dados', error: err.message })
        };
    }
};

module.exports.createHelpinho = async (event) => {

    try {
        let connection;
        const decoded = verifyToken(event);
        const data = JSON.parse(event.body);

        const { valor, solicitacao_id, doador_id } = data;

        if (decoded.statusCode) {
            return decoded;
        }

        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        const [result] = await connection.execute(
            'INSERT INTO helpinho (valor, doador_id, solicitacao_id) VALUES (?, ?, ?)',
            [valor, doador_id, solicitacao_id]
        );
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Dados salvos com sucesso no banco de dados',
                insertId: result.insertId
            })
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Erro ao salvar no banco de dados', error: err.message })
        };
    }
};

// Função para registrar um usuário
module.exports.register = async (event) => {
    const data = JSON.parse(event.body);
    try {
        const result = await userFunctions.registerUser(data);
        if(result.statusCode == 200) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'User registrado com sucesso', id: result }),
            };
        }
        if(result.statusCode == 400) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: result.body }),
            };
        }
    } catch (error) {
        console.log(error)
    }
};


module.exports.login = async (event) => {
    
    try {
        const result = await userFunctions.loginUser(event);
        if(result.statusCode == 200) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'User logado com sucesso', token: result.body }),
            };
        }
        if(result.statusCode == 500) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: result.body }),
            };
        }
    } catch (error) {
        console.log(error)
    }
};

// Middleware para verificar o token JWT
const verifyToken = (event) => {
    const token = event.headers.Authorization && event.headers.Authorization.split(' ')[1]; // Extraindo o Bearer Token
    if (!token) {
        return { statusCode: 401, body: JSON.stringify({ message: 'Token não fornecido' }) };
    }
  
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        return { statusCode: 401, body: JSON.stringify({ message: 'Token inválido' }) };
    }
};

module.exports.getHelpinhos = async (event) => {
    const decoded = verifyToken(event);
  
    if (decoded.statusCode) {
        return decoded;
    }
  
    try {
        let connection;
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });    
        const [rows] = await connection.query(`
            SELECT solicitation_helpinho.id, solicitation_helpinho.titulo, solicitation_helpinho.descricao, solicitation_helpinho.meta, solicitation_helpinho.categoria, users.email, users.nome
            FROM solicitation_helpinho
            JOIN users ON solicitation_helpinho.solicitante_id = users.id
            
            WHERE users.id != ?`, [decoded.userId]);   

        await connection.end();
  
        return {
            statusCode: 200,
            body: JSON.stringify({ helpinhos: rows })
        };
    } catch (error) {
        console.error('Erro ao buscar helpinhos:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Erro ao buscar helpinhos' })
        };
    }
};

module.exports.getHelpinhosOffline = async (event) => {
    try {
        let connection;
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });    

        const [rows] = await connection.query(`
            SELECT solicitation_helpinho.id, solicitation_helpinho.titulo,solicitation_helpinho.categoria, solicitation_helpinho.descricao, users.email, users.nome
            FROM solicitation_helpinho
            JOIN users ON solicitation_helpinho.solicitante_id = users.id
        `);

        await connection.end();
  
        return {
            statusCode: 200,
            body: JSON.stringify({ helpinhos: rows })
        };
    } catch (error) {
        console.error('Erro ao buscar helpinhos:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Erro ao buscar helpinhos' })
        };
    }
};

module.exports.getloggeduser = async (event) => {
    const token = event.headers.Authorization && event.headers.Authorization.split(' ')[1]; // Extraindo o Bearer Token

    if (!token) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'é necessário fornecer o JSON Web Token' })
        };
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);   
        let connection;
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });    
        const [rows] = await connection.query('SELECT * FROM users WHERE id = ?', [decoded.userId]);
        return {
            statusCode: 200,
            body: JSON.stringify({ users: rows })
        };
    } catch (error) {
        console.log(error)
        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Token inválido' })
        };
    }
};

module.exports.getSolicitationHelpinho = async (event) => {
    const id = event.pathParameters.id;
    connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });  
    const decoded = verifyToken(event);
  
        if (decoded.statusCode) {
            return decoded;
        }   
    try {
      const [rows] = await connection.query(
        `SELECT solicitation_helpinho.id, solicitation_helpinho.titulo, solicitation_helpinho.descricao, solicitation_helpinho.meta, solicitation_helpinho.categoria, users.email, users.nome, SUM(helpinho.valor) as total
            FROM solicitation_helpinho
            JOIN users ON solicitation_helpinho.solicitante_id = users.id
            LEFT JOIN helpinho ON solicitation_helpinho.id = helpinho.solicitacao_id
            WHERE solicitation_helpinho.id = ?`, [id]);   
        
      
      if (rows.length > 0) {
        return {
            statusCode: 200,
            body: JSON.stringify(rows[0]),
        };
    } else {
        return {
            statusCode: 404,
            body: JSON.stringify({ error: 'Helpinho não encontrado' }),
        };
    }
    } catch (error) {
        console.log(error)
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro ao buscar o Helpinho' }),
        };
    }
};

module.exports.getDashboard = async (event) => {
    const decoded = verifyToken(event);
  
    if (decoded.statusCode) {
        return decoded;
    }
  
    try {
        let connection;
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });    
         // Consultar quantas vezes o usuário aparece como doador_id e solicitante_id
            const [rows] = await connection.execute(
                `SELECT
                    (SELECT COUNT(*) FROM helpinho WHERE doador_id = ?) AS doador_count,
                    (SELECT COUNT(*) FROM helpinho WHERE solicitacao_id = ?) AS solicitante_count`,
                [decoded.userId, decoded.userId]
            );
        
            // Fechar a conexão com o banco de dados
            await connection.end();
        
            const doadorCount = rows[0].doador_count;
            const solicitanteCount = rows[0].solicitante_count;
  
            return {
                statusCode: 200,
                body: JSON.stringify({
                    doador_count: doadorCount,
                    solicitante_count: solicitanteCount
                }),
            };
    } catch (error) {
        console.error('Erro ao buscar helpinhos:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Erro ao buscar helpinhos' })
        };
    }
};
  
  
    
 
  