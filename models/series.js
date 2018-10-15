"use strict";
const bookshelf = require("../bookshelf");
require('./cast');

const Series = bookshelf.Model.extend({
    tableName: "series",
    cast: function () {
        return this.belongsToMany('cast')
    }
})

module.exports = bookshelf.model('series', Series)