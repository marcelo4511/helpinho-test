/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('helpinho', function(table) {
        table.increments('id').primary();
        table.decimal('valor', 14, 2).notNullable();
        table.integer('solicitacao_id').unsigned().references('id').inTable('solicitation_helpinho');
        table.integer('doador_id').unsigned().references('id').inTable('users');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('helpinho');

};
