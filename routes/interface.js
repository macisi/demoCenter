/**
 * interface router
 * @author: biangang
 * @date: 2014/5/8
 */
'use strict';
var express = require('express');
var router = express.Router();

var user = require('../api/user');
var group = require('../api/group');

//user api
router.route('/user/:user_id?')
    .get(user.get)
    .put(user.put)
    .post(user.post)
    .delete(user.delete);

//group api
router.route('/group/:group_id?')
    .get(group.get)
    .put(group.put)
    .post(group.post)
    .delete(group.delete);

module.exports = router;