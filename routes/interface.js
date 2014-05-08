/**
 * interface router
 * @author: biangang
 * @date: 2014/5/8
 */
'use strict';
var express = require('express');
var router = express.Router();

var user = require('../api/user');

router.route('/user/:user_id?')
    .get(user.get)
    .put(user.put)
    .post(user.post)
    .delete(user.delete);

module.exports = router;