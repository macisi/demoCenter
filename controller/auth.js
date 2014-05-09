/**
 * @author: biangang
 * @date: 2014/5/9
 */
'use strict';
var crypto = require('crypto');
var mysql = require('mysql');
var query = require('../db/query');
var formidable = require('formidable');
var util = require('util');

var auth = {
    login: {
        get: function(req, res){
            res.render('login', { title: 'login'});
        },
        post: function(req, res){
            var form = new formidable.IncomingForm();
            form.uploadDir = './uploadfile';
            form.keepExtensions = true;

            form.on('progress', function(bytesReceived, bytesExpected) {
                console.log(bytesReceived, bytesExpected);
            });

            form.parse(req, function(err, fields, files) {
                res.writeHead(200, {'content-type': 'text/plain'});
                res.write('received upload:\n\n');
                res.end(util.inspect({fields: fields, files: files}));
            });
            return;







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