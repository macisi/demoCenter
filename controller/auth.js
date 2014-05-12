/**
 * @author: biangang
 * @date: 2014/5/9
 */
'use strict';
var crypto = require('crypto');
var mysql = require('mysql');
var query = require('../db/query');

var auth = {
    login: {
        get: function(req, res){
            res.render('login', { title: 'login'});
        },
        post: function(req, res){
            var password;
            if (req.body.name && req.body.password) {
                password = crypto.createHash('md5').update(req.body.password).digest('hex');
                query('SELECT * FROM user WHERE name=' + mysql.escape(req.body.name), + ' LIMIT 1', function(err, rows){
                    if(!err && rows && rows[0] && rows[0].password === password) {
                        req.session.user_id = rows[0].id;
                        req.session.user = rows[0];
                        res.redirect('/');
                    } else {
                        res.send('login failed');
                    }
                });
            } else {
                res.send('login failed!');
            }
        }
    },
    logout: {
        get: function(req, res){
            req.session.destroy(function(err){
                if (!err) {
                    res.redirect('/');
                } else {
                    res.send('logout failed');
                }
            });
        }
    }
};

module.exports = auth;