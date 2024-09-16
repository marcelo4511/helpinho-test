// functions/user.js
const { getConnection } = require('../utils/db');
const formidable = require('formidable')
const multipart = require('lambda-multipart-parser');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const express = require('express');
const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
  
  const upload = multer({ storage });
  
module.exports.createHelpinho = async (event) => {
    let connection;
    try {
        const token = event.headers.Authorization || event.headers.Authorization;
        if (!token) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Token não fornecido' })
            };
        }
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        const formData = await multipart.parse(event);
        upload.single(formData.files[0])
        const descricao = formData.descricao || null;
        const imagem = formData.files[0] ? formData.files[0].filename : null;
        const titulo = formData.titulo || null;
        const solicitante_id = decoded.sub;
        const meta = formData.meta || null;

       // const imagem = formData.files[0];
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
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

// Buscar um usuário pelo ID
module.exports.getUserById = async (userId) => {
  const connection = await getConnection();
  try {
        const [rows] = await connection.execute('SELECT * FROM users WHERE id = ?', [userId]);
        await connection.end();
        if (rows.length === 0) {
        throw new Error('User not found');
        }
        return rows[0];
    } catch (error) {
        await connection.end();
        throw new Error('Error fetching user');
    }
};