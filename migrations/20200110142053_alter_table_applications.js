
exports.up = function(knex) {
    return knex.schema.alterTable('applications', table => {
        table.integer('jobOwnerId').unsigned().references('id')
            .inTable('users').notNull()
    })
};

exports.down = function(knex) {
    return knex.schema.alterTable('applications', table => {
        table.dropColumn('jobOwnerId')
    })
};
