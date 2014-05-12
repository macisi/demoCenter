/**
 * @author: biangang
 * @date: 2014/5/12
 * todo: 权限控制
 */
'use strict';
var _ = require('lodash');
var resp = require('../utils/responser');
var query = require('../db/query');
var uploader = require('../utils/uploader');

var demo = {
    /*get user*/
    get: function(req, res, next){
        req.checkParams('demo_id', 'demo_id required').notEmpty();
        var errors = req.validationErrors(true);
        if (!errors) {
            query('SELECT * FROM democenter_db.demo WHERE demo_id=' + req.param('demo_id'), function(err, rows){
                var data;
                if (err) {
                    return next(err);
                }
                if (rows.length === 0) {
                    data = resp(false, 'demo do not exist!');
                } else {
                    data = resp(true, rows[0]);
                }
                res.json(data);
            });
        } else {
            res.json(resp(false, errors.demo_id.msg));
        }
    },
    /*create user*/
    post: function(req, res, next){
        uploader(req, function(err, files){
            if (err) {
                res.json(false, err);
                return;
            }
            var user = req.body, errors;

            req.checkBody('demo_name', 'demo name required').notEmpty();
            req.checkBody('demo_name', 'name must be less than 45 characters').isLength(1, 45);
            user.demo_desc && req.checkBody('demo_desc', 'name must be less than 45 characters').isLength(1, 120);

            errors = req.validationErrors(true);

            if (errors) {
                res.json(resp(false, errors));
            } else {
                var demo = {
                    demo_name: user.demo_name,
                    demo_desc: user.demo_desc,
                    uid: 1,
                    createtime: new Date(),
                    path: files.join('||')
                };
                query('INSERT INTO democenter_db.demo SET ?', demo, function(err, data){
                    if (err) {
                        return next(err);
                    }
                    res.json(resp(true, true));
                });
            }
        });
    },
    /*update user*/
//    put: function(req, res, next){
//        var user = req.body, setStr = [], list = ['group_name', 'group_desc'], errors;
//
//        _.forEach(user, function(val, key){
//            if (list.indexOf(key) !== -1) {
//                setStr.push([key, '\'' + val + '\''].join('='));
//            }
//        });
//        if (setStr.length === 0) {
//            errors = 'no update field';
//        } else {
//            user.name && req.checkBody('group_name', 'group_name must be less than 45 characters').isLength(1, 18);
//            user.group_desc && req.checkBody('group_desc', 'group_desc must be less than 120 characters').isLength(1, 120);
//
//            errors = req.validationErrors(true);
//        }
//
//        if (errors) {
//            res.json(resp(false, errors));
//        } else {
//            setStr.join(',');
//
//            query('UPDATE democenter_db.demo SET ' + setStr + ' WHERE group_id=' + req.param('group_id'), function(err, rows){
//                if (err) {
//                    return next(err);
//                }
//                res.json(resp(true, rows.message));
//            });
//
//        }
//    },
    /*delete user*/
    delete: function(req, res, next){
        req.checkParams('demo_id', 'demo_id required').notEmpty();
        var errors = req.validationErrors(true);
        if (!errors) {
            query('DELETE FROM democenter_db.demo WHERE demo_id=' + req.param('demo_id'), function(err, rows){
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

module.exports = demo;