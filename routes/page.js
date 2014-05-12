/**
 * page router
 * @author: biangang
 * @date: 2014/5/8
 */
'use strict';
var express = require('express');
var auth = require('../controller/auth');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Demo Center', userinfo: req.session.user});
});

/* GET login page. */
router.get('/login', auth.login.get);
router.get('/logout', auth.logout.get);

/* GET demo create page */
router.get('/demo/new', function(req, res){
    res.render('demoform');
});

/* POST login */
router.post('/login', auth.login.post);

/* GET users listing. */
router.get('/users', function(req, res) {
    res.send('respond with a resource');
});

module.exports = router;
