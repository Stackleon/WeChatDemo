'usr strict'

var Koa = require('koa');
var wechat = require('./wechat/g');
var util = require('./libs/util');
var wechat_file = __dirname+'/config/wechat.txt';


var config = {
    wechat:{
        appID:"wxa2da022b24843901",
        appSecret:"303a4d6b7216d11e1ce872581edc2e83",
        token:"b73325a6cd970bad4c26ab3a38bc2807",
        getAccessToken:function(){
            console.log('file path:'+wechat_file);
            return util.readFileSync(wechat_file,'utf-8');
        },
        saveAccessToken:function(data){
            data = JSON.stringify(data);
            return util.writeFileSync(wechat_file,data);
        }
    }
};

var app = new Koa();
app.use(wechat(config.wechat));
app.listen(3100);
console.log('server runnint on port 3100');
