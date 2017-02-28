'use strict'
var Promise = require('bluebird')
var request = Promise.promisify(require('request'));
//var request = require('request');
var prefix = 'https://api.weixin.qq.com/cgi-bin/';

var api = {
    access_token :prefix+ 'token?grant_type=client_credential'
}

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
            Promise.resolve(data);
        } else {
            return that.updateAccessToken(data);
        }

    })
    .then(function(data){
        //console.log("4");
        that.access_token = data.access_token;
        that.expires_in = data.expires_in;
        that.saveAccessToken(data);
    })
}


WeChat.prototype.isValidAccessToken = function(data){
        if(!data || !data.access_token || !data.expires_in){
            return false;
        }

        var access_token = data.access_token;
        var expires_in = data.expires_in;
        var now = (new Date().getTime());

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
                  
                 request(url,function(err,response,body){
                    var data = JSON.parse(body);
                    var now = (new Date().getTime());
                    var expires_in = now +(data.expires_in-20)*1000;
                    data.expires_in = expires_in;
                    resolve(data);
                 })
        });
}


module.exports = WeChat;