module.exports = {
    client: 'mysql2',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'helpinho',
        port: 3306
    },
    migrations: {
        tableName: 'knex_migrations',
    },
  };