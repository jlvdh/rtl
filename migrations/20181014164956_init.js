
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('series', function (table) {
            table.increments().notNullable();
            table.string('name').notNullable();
            table.integer('tvMazeId').unique().notNullable();
        })
        .createTable('cast', function (table) {
            table.increments().notNullable();
            table.string('name').notNullable();
            table.date('birthdate').notNullable()
            table.integer('tvMazeId').notNullable();
        })
        .createTable('cast_series', function (table) {
            table.increments().notNullable();
            table.integer('series_id').references('id').inTable('series').notNullable()
            table.integer('cast_id').references('id').inTable('cast').notNullable()
        })
    ])
};

exports.down = function(knex, Promise) {
  
};