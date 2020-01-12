
exports.up = function(knex) {
    return knex.schema.createTable('jobs', table => {
        table.increments('id').primary()
        table.string('jobName').notNull()
        table.timestamp('createdAt')
        table.integer('userId').unsigned().references('id')
            .inTable('users').notNull()
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('jobs')
};
