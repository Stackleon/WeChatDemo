'usr strict'

var Koa = require('koa');
var wechat = require('./wechat/g');
var config = require('./config');
var weixin = require('./weixin');

var app = new Koa();
app.use(wechat(config.wechat,weixin.reply));
app.listen(3100);
console.log('server runnint on port 3100');
