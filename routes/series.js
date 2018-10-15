const express = require('express');
const router = express.Router();
const Series = require('../models/series')

router.get('/all', function(req, res, next) {

    //defaults
    let pageSize = 10
    let page = 1

    if (req.query && req.query.pageSize) {
        pageSize = Number(req.query.pageSize)
    }

    if (req.query && req.query.page) {
        page = Number(req.query.page)
    }

    Series
    .collection()
    .fetchPage({
        pageSize: pageSize, // Defaults to 10 if not specified
        page: page, // Defaults to 1 if not specified
        withRelated: [{'cast': function(qb) {
            qb.orderBy("birthdate");
        }}]//,
     })     
    .then((series) => {
        res.send(series.serialize({omitPivot: true}));
    })
    .catch(err => {
        console.log(err)
        next(err)
    })
  });
  
  module.exports = router;
  