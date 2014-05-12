/**
 * @author: biangang
 * @date: 2014/5/12
 * @todo: 1.rename 2.filetype 3.progress
 */
'use strict';
var formidable = require('formidable');
var Promise = require('q');

function getUploadFile(req, cb){
    var form = new formidable.IncomingForm();

    form.encoding = 'utf-8';
    form.uploadDir = './uploads';
    form.keepExtensions = true;
    form.multiples = true;

    var files = [], err;

    form.on('file', function(name, file){
        if (file.type.indexOf('image') !== -1) {
            files.push(file.path);
        } else {
            err = 'error file type';
        }
    });

    form.on('field', function(name, value) {
        req.body[name] = value;
    });

    form.on('end', function(){
        cb(err, files);
    });

    form.parse(req);
}

module.exports = getUploadFile;
