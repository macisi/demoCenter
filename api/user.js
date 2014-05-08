/**
 * @author: biangang
 * @date: 2014/5/8
 * todo: user validate to be dry
 */
'use strict';
var _ = require('lodash');
var resp = require('../utils/responser');
var mysql = require('mysql');
var query = require('../db/query');

var user = {
    /*get user*/
    get: function(req, res, next){
        if (req.params.user_id) {
            query('SELECT * FROM user WHERE id=' + req.params.user_id, function(err, rows){
                var data;
                if (err) {
                    return next(err);
                }
                if (rows.length === 0) {
                    data = resp(false, 'user do not exist!');
                } else {
                    data = resp(true, rows[0]);
                }
                res.json(data);
            });
        }
    },
    /*create user*/
    post: function(req, res, next){
        var user = req.body, error;
        if (!user.name) {
            error = 'name required!';
        } else if (!user.email) {
            error = 'email required!';
        } else if (!user.password) {
            error = 'password required!';
        }
        if (error) {
            res.json(resp(false, error));
        } else {
            query('INSERT INTO user (name, email, password) VALUES (?, ?, ?)', [user.name, user.email, user.password], function(err, data){
                if (err) {
                    return next(err);
                }
                res.json(resp(true, true));
            });
        }
    },
    /*update user*/
    put: function(req, res, next){
        var user = req.body, setStr = [], list = ['name', 'email'], error;
        if (!req.params.user_id) {
            error = 'userId required!';
        } else if (user.name === '') {
            error = 'name can not be null!';
        } else if (user.email === '') {
            error = 'email can not be null!';
        } else {
            _.forEach(user, function(val, key){
                if (list.indexOf(key) !== -1) {
                    setStr.push([key, '\'' + val + '\''].join('='));
                }
            });
            if (setStr.length === 0) {
                error = 'no update field!';
            } else {
                setStr.join(',');
            }
        }
        if (error) {
            res.json(resp(false, error));
        } else {
            query('UPDATE user SET ' + setStr + ' WHERE id=' + req.params.user_id, function(err, rows){
                if (err) {
                    return next(err);
                }
                res.json(resp(true, true));
            });
        }
    },
    /*delete user*/
    delete: function(req, res, next){
        if (req.params.user_id) {
            console.log('DELETE FROM user WHERE id=' + req.params.user_id);
            query('DELETE FROM user WHERE id=' + req.params.user_id, function(err, rows){
                var data;
                if (err) {
                    return next(err);
                }
                if (rows.length === 0) {
                    data = resp(false, 'user do not exist!');
                } else {
                    data = resp(true, true);
                }
                res.json(data);
            });
        }
    }
};

module.exports = user;