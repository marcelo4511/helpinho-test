// functions/user.js
const { getConnection } = require('../utils/db');
const bcrypt = require('bcrypt');

// Criar um novo usuário
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


module.exports.registerUser = async (data) => {
    const { name, email, password } = data;
    const connection = await getConnection();
  
    try {
        // Verificar se o e-mail já está registrado
        const [existingUsers] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            throw new Error('Email already registered');
        }
  
        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Inserir o novo usuário no banco de dados
        const [result] = await connection.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );
        await connection.end();
        return { success: true, userId: result.insertId };
        } catch (error) {
        await connection.end();
        throw new Error(error.message);
        }
    };
  
  // Autenticar um usuário
    module.exports.loginUser = async (data) => {
        const { email, password } = data;
        const connection = await getConnection();
    
        try {
        // Buscar o usuário pelo e-mail
        const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            throw new Error('Invalid email or password');
        }
    
        const user = rows[0];
    
        // Comparar a senha fornecida com a senha armazenada
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }
    
        await connection.end();
        return { success: true, userId: user.id };
        } catch (error) {
        await connection.end();
        throw new Error(error.message);
        }
   };