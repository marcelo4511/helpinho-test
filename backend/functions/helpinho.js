// functions/user.js
const { getConnection } = require('../utils/db');
const bcrypt = require('bcrypt');
const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const formidable = require('formidable')
// Criar um novo helpinho
module.exports.createHelpinho = async (data) => {
    
    const connection = await getConnection();
    const form = new formidable.IncomingForm();
  
    return new Promise((resolve, reject) => {
        form.parse(event, async (err, fields, files) => {
            if (err) {
                return resolve({
                    statusCode: 500,
                    body: 'Internal Server Error'
                });
            }
    
            const title = fields.title[0];
            const description = fields.description[0];
            const file = files.image[0];
    
            if (!title || !description || !file) {
                return resolve({
                    statusCode: 400,
                    body: 'Todos os campos são obrigatórios.'
                });
            }
    
            const uploadParams = {
                Bucket: 'develop',
                Key: file.originalFilename,
                Body: fs.createReadStream(file.filepath),
                ContentType: file.mimetype
            };
    
            try {
            await S3.upload(uploadParams).promise();
            resolve({
                statusCode: 200,
                body: JSON.stringify({
                message: 'Dados recebidos com sucesso!',
                data: {
                    title,
                    description,
                    image: file.originalFilename
                }
                })
            });
            } catch (uploadError) {
                resolve({
                    statusCode: 500,
                    body: 'Erro ao enviar o arquivo para o S3'
                });
            }
        });
    });
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