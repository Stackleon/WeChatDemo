'use strict'
var Promise = require('bluebird')
var request = Promise.promisify(require('request'));
var util = require('./util');
//var request = require('request');
var prefix = 'https://api.weixin.qq.com/cgi-bin/';

var api = {
    access_token :prefix+ 'token?grant_type=client_credential'
}
//主要用于票据的检查和更新
function WeChat(opts){

    //票据的读出，写入
    var that = this;
    this.appID = opts.appID;
    this.appSecret = opts.appSecret;
    this.getAccessToken = opts.getAccessToken;
    this.saveAccessToken = opts.saveAccessToken;


    this.getAccessToken()
    .then(function(data){
        try{
           data = JSON.parse(data);
        }catch(e){
            return that.updateAccessToken(data);  //注意这个地方要用that.function
        }

        if(that.isValidAccessToken(data)){
            return Promise.resolve(data);
        } else {
            console.log('1');
            return that.updateAccessToken(data);
        }
        console('2');
    })
    .then(function(data){
        console.log("4");
        that.access_token = data.access_token;
        that.expires_in = data.expires_in;
        that.saveAccessToken(data);
    })
}


WeChat.prototype.isValidAccessToken = function(data){
        console.log('---');
        if(!data || !data.access_token || !data.expires_in){
            return false;
        }

        var access_token = data.access_token;
        var expires_in = data.expires_in;
        var now = (new Date().getTime());

        console.log('expires_in:'+expires_in+'   now:'+now);
        if(now < expires_in){
            return true;
        }else {
            return false;
        }
}

WeChat.prototype.updateAccessToken = function(){
        var appID = this.appID;
        var appSecret = this.appSecret;
        var url = api.access_token+'&appid='+appID+'&secret='+appSecret;
        //console.log("url:"+url);
        return new Promise(function(resolve,reject){
                  console.log('3');
                 request(url,function(err,response,body){
                    var data = JSON.parse(body);
                    var now = (new Date().getTime());
                    var expires_in = now +(data.expires_in-20)*1000;
                    data.expires_in = expires_in;
                    resolve(data);
                 })
        });
}


WeChat.prototype.reply = function(){
    var content = this.body;
    var message = this.weixin;

    var xml = util.tpl(content,message);

    console.log("xml:"+xml);
    this.body = xml;
    this.status = 200;
    this.type = 'application/xml';
}

module.exports = WeChat;