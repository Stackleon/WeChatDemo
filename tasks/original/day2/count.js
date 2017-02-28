var fs = require('fs');
var path = __dirname+'/count.txt';

module.exports = function(){
    return function *count(next){
        console.log('method:'+this.method+'   url:'+this.url);
        if(this.method === 'GET'){
            if(this.url === '/favicon.ico'){
                this.count = parseInt(readCount(),10)+1;
                console.log('count:'+this.count);
                this.body = `<html>
                  <head><title>leon</title></head>
                  <body>目前的回响数:${this.count}</body>
                 </html>`
                 writeCount(this.count);
                 return;
            } else {
                this.body = `<html>
                  <head><title>leon</title></head>
                  <body>have Error</body>
                 </html>`
                 return;
            }
        }

    }
}

function writeCount(count){
    console.log('path:'+path);
    if(fs.existsSync(path)){
        fs.writeFileSync(path,count);
    }
}

function readCount(){
    console.log('path:'+path);
    if(fs.existsSync(path)){
        console.log('exist');
        return fs.readFileSync(path);
    }
}