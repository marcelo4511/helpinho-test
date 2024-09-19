// functions/user.js
const { getConnection } = require('../utils/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const express = require('express');
const Joi = require('joi');

const app = express();
app.use(express.json());

module.exports.createUser = async (data) => {
    const connection = await getConnection();
    try {
        const [result] = await connection.execute(
        'INSERT INTO users (name, email) VALUES (?, ?)',
        [data.name, data.email]
        );
        await connection.end();
        return { success: true, userId: result.insertId };
    } catch (error) {
        await connection.end();
        throw new Error('Error creating user');
    }
};


module.exports.registerUser = async (data) => {
    const { nome, data_nascimento, cpf, email, password, confirm_password } = data;
    const schema = Joi.object({
        nome: Joi.required(),
        data_nascimento: Joi.date().required(),
        cpf: Joi.required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirm_password: Joi.string().valid(Joi.ref('password')).required(),
    });
      
    if (password !== confirm_password) {
        return {
            statusCode: 400,
            body: JSON.stringify('as senhas não coincidem'),
        };
    }
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });
  
    try {
        // Verificar se o e-mail já está registrado
        const [existingUsers] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
        
        if (existingUsers.length > 0) {
            return {
                statusCode: 400,
                body: JSON.stringify('e-mail já está cadastrado'),
            };
        }

        const { error } = schema.validate({  nome, data_nascimento, cpf ,email, password, confirm_password });

        if (error) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: error.details[0].message }),
            };
        }
  
        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const [result] = await connection.execute(
            'INSERT INTO users (nome, data_nascimento, cpf, email, password) VALUES (?, ?, ?, ?, ?)',
            [nome,data_nascimento, cpf, email, hashedPassword]
        );
            await connection.end();
            return {
                statusCode: 200,
                body: JSON.stringify({ id: result.insertId }),
            };
        } catch (error) {
            await connection.end();
            throw new Error(error.message);
        }
    };
  
  // Autenticar um usuário
    module.exports.loginUser = async (event) => {
        const { email, password } = JSON.parse(event.body);
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required()        
        });

        const { error } = schema.validate({ email, password });

        if (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: error.details[0].message }),
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
        const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    
        if (rows.length === 0) {
            return {
                statusCode: 500,
                body: JSON.stringify( 'Usuário não encontrado' )
            };
        }
  
        const user = rows[0];
    
        // Verificar a senha
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return {
                statusCode: 500,
                body: JSON.stringify('Senha incorreta')
            };
        }
  
        // Gerar o token JWT
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
        await connection.end();
    
        return {
            statusCode: 200,
            body:  token 
        };
        } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify('Erro no servidor')
        };
    }
};