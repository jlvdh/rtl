"use strict";
const bookshelf = require("../bookshelf");
require('./series');

const Cast = bookshelf.Model.extend({
    tableName: "cast",
    series: function() {
        return this.belongsToMany('series')
    }
})

module.exports = bookshelf.model('cast', Cast)