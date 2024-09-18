/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('solicitation_helpinho', function(table) {
        table.increments('id').primary();
        table.integer('solicitante_id').unsigned().references('id').inTable('users');
        table.string('descricao').notNullable();
        table.string('titulo').notNullable();
        table.decimal('meta', 14, 2).notNullable();
        table.text('imagem').nullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('solicitation_helpinho');

};
