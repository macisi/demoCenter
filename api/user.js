/**
 * @author: biangang
 * @date: 2014/5/8
 */
'use strict';
var _ = require('lodash');
var resp = require('../utils/responser');
var query = require('../db/query');

var user = {
    /*get user*/
    get: function(req, res, next){
        req.checkParams('user_id', 'userId required').notEmpty();
        var errors = req.validationErrors(true);
        if (!errors) {
            query('SELECT * FROM user WHERE id=' + req.param('user_id'), function(err, rows){
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
        } else {
            res.json(resp(false, errors.user_id.msg));
        }
    },
    /*create user*/
    post: function(req, res, next){
        var user = req.body, errors;
        req.checkBody('name', 'name required').notEmpty();
        req.checkBody('name', 'name must be less than 18 characters').isLength(1, 18);
        req.checkBody('email', 'email required').notEmpty();
        req.checkBody('email', 'invalid email').isEmail();
        req.checkBody('password', 'password required').notEmpty();

        errors = req.validationErrors(true);

        if (errors) {
            res.json(resp(false, errors));
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
        var user = req.body, setStr = [], list = ['name', 'email'], errors;

        _.forEach(user, function(val, key){
            if (list.indexOf(key) !== -1) {
                setStr.push([key, '\'' + val + '\''].join('='));
            }
        });
        if (setStr.length === 0) {
            errors = 'no update field';
        } else {
            user.name && req.checkBody('name', 'name must be less than 18 characters').isLength(1, 18);
            user.email && req.checkBody('email', 'invalid email').isEmail();

            errors = req.validationErrors(true);
        }

        if (errors) {
            res.json(resp(false, errors));
        } else {
            setStr.join(',');

            query('UPDATE user SET ' + setStr + ' WHERE id=' + req.param('user_id'), function(err, rows){
                if (err) {
                    return next(err);
                }
                res.json(resp(true, rows.message));
            });

        }
    },
    /*delete user*/
    delete: function(req, res, next){
        req.checkParams('user_id', 'userId required').notEmpty();
        var errors = req.validationErrors(true);
        if (!errors) {
            query('DELETE FROM user WHERE id=' + req.param('user_id'), function(err, rows){
                if (err) {
                    return next(err);
                }
                res.json(resp(true, true));
            });
        } else {
            res.json(resp(false, errors));
        }
    }
};

module.exports = user;