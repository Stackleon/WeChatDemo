'use strict'
//var Promise = require('bluebird')
//var request = Promise.promisify(require('request'));
var path = require('path');
var util = require('./util');
var request = require('request-promise');
var prefix = 'https://api.weixin.qq.com/cgi-bin/';
var fs = require('fs');
var _ = require('lodash');

/*
新增图文
https://api.weixin.qq.com/cgi-bin/material/add_news?access_token=ACCESS_TOKEN

新增图片
https://api.weixin.qq.com/cgi-bin/media/uploadimg?access_token=ACCESS_TOKEN

新增其他类型永久素材
https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=ACCESS_TOKEN&type=TYPE

获取永久素材列表
https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token=ACCESS_TOKEN
*/

var api = {
    access_token :prefix+ 'token?grant_type=client_credential',
    temp_material:{
        upload : prefix+'media/upload?',
    },
    permanent_material:{
        upload_news : prefix + 'material/add_news?',
        upload_img : prefix + 'media/uploadimg?',
        upload_material : prefix + 'material/add_material?',
        getMaterialList : prefix + 'material/batchget_material?',

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

WeChat.prototype.uploadMaterial = function(material,type,permanent){
    console.log('uploadMaterial');
        var that = this;
        var uploadUrl = api.temp_material.upload;
        var form = {};
        if(permanent){
            uploadUrl = api.permanent_material.upload;
            _.extend(form,permanent);

            if(type === 'image') {
                uploadUrl = api.permanent_material.upload_img;
                form.media = fs.createReadStream(material);
            } else if(type === 'news'){
                uploadUrl = api.permanent_material.upload_news;
                form = material;
            }
        } else {
            form.media = fs.createReadStream(material);
        }

        return new Promise(function(resolve,reject){
                    console.log('getData');
                    that.fetchAccessToken()
                    .then(function(data){
                        //access_token=ACCESS_TOKEN&type=TYPE
                        var url = uploadUrl+"access_token="+data.access_token;
                        if(!permanent){
                            url = url + '&type='+type;
                        } else {
                            form.access_token = data.access_token;
                        }

                        var options = {
                            method : 'POST',
                            url : url,
                            json : true,
                        }

                        if(type === 'news') {
                            options.body = form;
                        } else {
                            options.formData = form;
                        }


                        request(options)
                        .then(function(_data){
                                console.log(_data);
                                resolve(_data);
                            })
                        })
        });
}

WeChat.prototype.getMaterialList = function(form){
        var that = this;
        form.type = form.type || 'image';
        form.offset = form.offset || 0;
        form.count = form.count || 1;


        return new Promise(function(resolve,reject){
                    console.log('getData');
                    that.fetchAccessToken()
                    .then(function(data){
                        //access_token=ACCESS_TOKEN&type=TYPE
                        var url = api.permanent_material.getMaterialList+"access_token="+data.access_token;

                        var options = {
                            method : 'POST',
                            url : url,
                            json : true,
                            body : form,
                        }


                        request(options)
                        .then(function(_data){
                                console.log(_data);
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