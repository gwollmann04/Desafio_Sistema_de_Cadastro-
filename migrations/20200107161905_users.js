exports.up = function(knex) {
    return knex.schema.createTable('users', table => {
        table.increments('id').primary()
        table.string('name').notNull()
        table.string('email').notNull()
        table.string('phoneNumber').notNull()
        table.string('cpf').notNull().unique()
        table.string('password').notNull()
        table.boolean('admin').notNullable().defaultTo(false)
        table.timestamp('deletedAt')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('users')
};
