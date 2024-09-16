const userFunctions = require('./functions/user');
const helpinhoFunctions = require('./functions/helpinho');
const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const express = require('express');
const app = express();
const multipart = require('lambda-multipart-parser');

module.exports.getUser = async (event) => {
    const userId = event.pathParameters.id;
        try {
            const user = await userFunctions.getUserById(userId);
        return {
            statusCode: 200,
            body: JSON.stringify(user),
        };
        } catch (error) {
        return {
            statusCode: 404,
            body: JSON.stringify({ error: error.message }),
        };
    }
};

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

module.exports.createHelpinho = async (event) => {

    try {
        let connection;
        const decoded = verifyToken(event);
  
        // Se o token for inválido, retorna a mensagem de erro
        if (decoded.statusCode) {
            return decoded;
        }
      
        const formData = await multipart.parse(event);
        upload.single(formData.files[0])
        const descricao = formData.descricao || null;
        const imagem = formData.files[0] ? formData.files[0].filename : null;
        const titulo = formData.titulo || null;
        const solicitante_id = decoded.sub;
        const meta = formData.meta || null;

        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        const [result] = await connection.execute(
            'INSERT INTO solicitation_helpinho (descricao, titulo, solicitante_id, meta, imagem) VALUES (?, ?, ?,?,?)',
            [descricao, titulo, solicitante_id, meta, imagem]
        );
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Dados salvos com sucesso no banco de dados',
                insertId: result.insertId
            })
        };
    } catch (err) {
        console.log(err)
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
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'User registered successfully', userId: result.userId }),
        };
        } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: error.message }),
        };
    }
};

module.exports.login = async (event) => {
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Email e senha são obrigatórios' })
        };
    }
  
    try {
        let connection;
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        // Consultar usuário no banco de dados
        const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    
        // Verificar se o usuário foi encontrado
        if (rows.length === 0) {
            return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Usuário não encontrado' })
            };
        }
  
        const user = rows[0];
    
        // Verificar a senha
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Senha incorreta' })
            };
        }
  
        // Gerar o token JWT
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
        // Fechar conexão
        await connection.end();
    
        return {
            statusCode: 200,
            body: JSON.stringify({ token })
        };
        } catch (error) {
        console.error('Erro no login:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Erro no servidor' })
        };
    }
};

    // module.exports.protectedRoute = async (event) => {
    //     return {
    //         statusCode: 200,
    //         body: JSON.stringify({ message: 'Protected content' }),
    //     };
    // };


// Middleware para verificar o token JWT
const verifyToken = (event) => {
    const token = event.headers.Authorization && event.headers.Authorization.split(' ')[1]; // Extraindo o Bearer Token
    if (!token) {
        return { statusCode: 401, body: JSON.stringify({ message: 'Token não fornecido' }) };
    }
  
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;  // Retorna o payload do token
    } catch (error) {
        return { statusCode: 401, body: JSON.stringify({ message: 'Token inválido' }) };
    }
  };

  module.exports.getHelpinhos = async (event) => {
    const decoded = verifyToken(event);
  
    // Se o token for inválido, retorna a mensagem de erro
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
        // Consulta ao banco de dados para buscar os "helpinhos"
        const [rows] = await connection.query('SELECT * FROM solicitation_helpinho WHERE solicitante_id = ?', [decoded.userId]);
    
        // Fechar a conexão
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
        // Consulta ao banco de dados para buscar os "helpinhos"
        const titleSearch = event.queryStringParameters?.title || '';
        const descriptionSearch = event.queryStringParameters?.description || '';
        const emailSearch = event.queryStringParameters?.email || '';

        const [rows] = await connection.query(`
            SELECT solicitation_helpinho.id, solicitation_helpinho.titulo, solicitation_helpinho.descricao, users.email
            FROM solicitation_helpinho
            JOIN users ON solicitation_helpinho.solicitante_id = users.id
        
        `);     
        // Fechar a conexão
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
  
  
    
 
  