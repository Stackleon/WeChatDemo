'use strict'

var Koa = require('koa');
var count = require('./count');

var app = new Koa();

app.use(count());

app.listen(3100);