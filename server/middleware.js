'use strict';

var express = require('express');

module.exports = function (globe) {
    
    globe.use('/storage', require('./middleware/cache')(1000 * 60 * 60 * 24));
    globe.use('/storage', require('./middleware/proxy')('https://s3.amazonaws.com/' + process.env.S3_BUCKET, process.env.S3_BUCKET));
    
    /*globe.use(express.urlencoded());
    globe.use(express.json());*/
    globe.use(express.bodyParser());
    globe.use(require('./middleware/handleErrors'));
    globe.use(require('./middleware/consolidateQuery'));
    globe.use(require('./middleware/output'));
};