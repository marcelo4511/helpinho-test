const mysql = require('mysql2/promise');

// Função para obter a conexão com o MySQL
const getConnection = async () => {
    return mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });
};

module.exports = { getConnection };