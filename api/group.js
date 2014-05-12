/**
 * @author: biangang
 * @date: 2014/5/9
 * todo: 权限控制
 */
'use strict';
var mysql = require('mysql');
var _ = require('lodash');
var resp = require('../utils/responser');
var query = require('../db/query');

var group = {
    /*get user*/
    get: function(req, res, next){
        req.checkParams('group_id', 'group_id required').notEmpty();
        var errors = req.validationErrors(true);
        if (!errors) {
            query('SELECT * FROM democenter_db.group WHERE group_id=' + req.param('group_id'), function(err, rows){
                var data;
                if (err) {
                    return next(err);
                }
                if (rows.length === 0) {
                    data = resp(false, 'group do not exist!');
                } else {
                    data = resp(true, rows[0]);
                }
                res.json(data);
            });
        } else {
            res.json(resp(false, errors.group_id.msg));
        }
    },
    /*create user*/
    post: function(req, res, next){
        var user = req.body, errors;
        req.checkBody('group_name', 'group name required').notEmpty();
        req.checkBody('group_name', 'name must be less than 45 characters').isLength(1, 45);

        errors = req.validationErrors(true);

        if (errors) {
            res.json(resp(false, errors));
        } else {
            var group = {
                group_name: user.group_name,
                group_desc: user.group_desc,
                creater_id: 1,
                createtime: new Date()
            };
            query('INSERT INTO democenter_db.group SET ?', group, function(err, data){
                if (err) {
                    return next(err);
                }
                res.json(resp(true, true));
            });
        }
    },
    /*update user*/
    put: function(req, res, next){
        var user = req.body, setStr = [], list = ['group_name', 'group_desc'], errors;

        _.forEach(user, function(val, key){
            if (list.indexOf(key) !== -1) {
                setStr.push([key, '\'' + val + '\''].join('='));
            }
        });
        if (setStr.length === 0) {
            errors = 'no update field';
        } else {
            user.name && req.checkBody('group_name', 'group_name must be less than 45 characters').isLength(1, 18);
            user.group_desc && req.checkBody('group_desc', 'group_desc must be less than 120 characters').isLength(1, 120);

            errors = req.validationErrors(true);
        }

        if (errors) {
            res.json(resp(false, errors));
        } else {
            setStr.join(',');

            query('UPDATE democenter_db.group SET ' + setStr + ' WHERE group_id=' + req.param('group_id'), function(err, rows){
                if (err) {
                    return next(err);
                }
                res.json(resp(true, rows.message));
            });

        }
    },
    /*delete user*/
    delete: function(req, res, next){
        req.checkParams('group_id', 'group_id required').notEmpty();
        var errors = req.validationErrors(true);
        if (!errors) {
            query('DELETE FROM democenter_db.group WHERE group_id=' + req.param('group_id'), function(err, rows){
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

module.exports = group;