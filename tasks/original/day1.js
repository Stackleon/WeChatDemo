'use strict'

var Koa = require('koa');

var app = new Koa();

app.use(function *(next){
    var echo = this.query.echo;
    
    
    this.body = `<html>
                  <head><title>${echo}</title></head>
                  <body>Welcome ${echo}</body>
                 </html>`
    
    
});

app.listen(3100);