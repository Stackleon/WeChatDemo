'use strict'
//var Promise = require('bluebird')
//var request = Promise.promisify(require('request'));
var path = require('path');
var util = require('./util');
var request = require('request-promise');
var prefix = 'https://api.weixin.qq.com/cgi-bin/';
var fs = require('fs');

var api = {
    access_token :prefix+ 'token?grant_type=client_credential',
    temp_material:{
        upload : prefix+'media/upload?',
    }
}
//主要用于票据的检查和更新
function WeChat(opts){

    //票据的读出，写入
    var that = this;
    this.appID = opts.appID;
    this.appSecret = opts.appSecret;
    this.getAccessToken = opts.getAccessToken;
    this.saveAccessToken = opts.saveAccessToken;
    this.isValid = true;

    this.fetchAccessToken();
}


WeChat.prototype.fetchAccessToken = function(){
     var that = this;
     return new Promise(function(resolve,reject){
                 that.getAccessToken()
                .then(function(data){
                    try{
                    data = JSON.parse(data);
                    }catch(e){
                        return that.updateAccessToken(data);  //注意这个地方要用that.function
                    }

                    if(that.isValidAccessToken(data)){
                        return Promise.resolve(data);
                    } else {
                        return that.updateAccessToken(data);
                    }
                })
                .then(function(data){
                    if(that.isValid){
                        //console.log('data:'+JSON.stringify(data));
                        resolve(data);
                    } else {
                        that.access_token = data.access_token;
                        that.expires_in = data.expires_in;
                        return that.saveAccessToken(data);
                    }
                })
     });

}

WeChat.prototype.isValidAccessToken = function(data){
    console.log('isValidAccessToken');
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
    console.log('updateAccessToken');
        this.isValid = false;  //当更新后才进行重新写入文件
        var appID = this.appID;
        var appSecret = this.appSecret;
        var url = api.access_token+'&appid='+appID+'&secret='+appSecret;
        //console.log("url:"+url);
        return new Promise(function(resolve,reject){
                  request(url)
                 .then(function(body){
                    console.log('body:'+body);
                    var data = JSON.parse(body);
                    var now = (new Date().getTime());
                    var expires_in = now +(data.expires_in-20)*1000;
                    data.expires_in = expires_in;
                    resolve(data);
                 })
        });
}

WeChat.prototype.uploadMaterial = function(uploadFilePath,type){
    console.log('uploadMaterial');
        var that = this;
        var form ={
            media:fs.createReadStream(uploadFilePath)
        };
        return new Promise(function(resolve,reject){
                    console.log('getData');
                    that.fetchAccessToken()
                    .then(function(data){
                        //access_token=ACCESS_TOKEN&type=TYPE
                        var url = api.temp_material.upload+"access_token="+data.access_token+"&type="+type;
                        request({method:'POST',url:url,formData:form,json:true})
                        .then(function(_data){
                                resolve(_data);
                            })
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