/**
 * page router
 * @author: biangang
 * @date: 2014/5/8
 */
'use strict';
var express = require('express');
var router = express.Router();
var query = require('../db/query');

/* GET home page. */
router.get('/', function(req, res, next) {
    query('SELECT * FROM user LIMIT 10', function(err, rows){
        if (err) {
            return next(err);
        }
        console.log(rows);
    });
    res.render('index', { title: 'Express' });
});

/* GET users listing. */
router.get('/users', function(req, res) {
    res.send('respond with a resource');
});

module.exports = router;
