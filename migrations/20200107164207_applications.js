
exports.up = function(knex) {
    return knex.schema.createTable('applications', table => {
        table.increments('id').primary()
        table.timestamp('createdAt')
        table.string('comments')  
        table.integer('userId').unsigned().references('id')
            .inTable('users').notNull()
        table.integer('jobId').unsigned().references('id')
            .inTable('jobs').notNull()
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('applications')
};
