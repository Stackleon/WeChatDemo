'use strict'
var WeChat = require('./wechat/wechat');
var config = require('./config');
var path = require('path');
var menu = require('./wechat/menu');

var wechatApi = new WeChat(config.wechat);

//wechatApi.deleteMenu();

wechatApi.queryMenu().then(function(data){
    console.log("query : "+JSON.stringify(data));
    if(data.errcode === 46003){
        wechatApi.deleteMenu().then(function(data){
        console.log('deleter msg :'+JSON.stringify(data));
        wechatApi.createMenu(menu);
        });
    }
})




exports.reply = function* (next){
    var message = this.weixin; // 挂载过的对象

    console.log('mes:'+message);
    if(message.MsgType === 'event'){
        console.log("--- Current event:"+message.Event);
        if(message.Event === 'subscribe') {
            if(message.EventKey){
                console.log('扫描进来:'+JSON.stringify(message.EventKey));
            }
            var reply = {
                type : 'text',
                text : ''
            };

            reply.text = `感谢关注!
    回复1：小惊喜
    回复2：大惊喜
    回复3：超大惊喜
    回复4：试试你就知道了`;
            this.body = reply;

        } else if(message.Event === 'unsubscribe'){
            this.body = {};
            console.log('无情取消关注');
        }

    } else if(message.MsgType === 'text'){
            var sendMsg = message.Content;
            var reply = {};
            console.log('sendMsg:'+sendMsg);
            if(sendMsg === '1'){
                    reply.text = 'Hello，Guys。 you are very beauty!';
                    reply.type = 'text';
            }else if(sendMsg === '2'){
                    reply.text = `    回复1：小惊喜
            回复2：大惊喜
            回复3：超大惊喜
            回复4：试试你就知道了`;
                    reply.type = 'text';
            }else if(sendMsg === '3'){
                    reply = [
                        {title:'技术改变生活',
                        description :'拥抱开源',
                        picUrl:'http://static.oschina.net/uploads/img/201304/17033907_yA2V.jpg',
                        url:'https://www.github.com'
                        }
                    ]   
            } else if(sendMsg === '4') {
                var filePath = path.dirname(__dirname)+'/WeChat/material/milkyway.jpg'
                var upload = yield wechatApi.uploadMaterial(filePath,'image')
                reply.mediaId = upload.media_id;
                reply.type = 'image';
            } else if(sendMsg === '5') {
                var filePath = path.dirname(__dirname)+'/WeChat/material/funny.mp4';
                var uploadVideo = yield wechatApi.uploadMaterial(filePath,'video');
                reply.mediaId = uploadVideo.media_id;
                reply.title = "搞笑视频";
                reply.description = '亲，这是个搞笑视频';
                reply.type = 'video';
            } else if( sendMsg === '6') {
                var filePath = path.dirname(__dirname)+'/WeChat/material/milkyway.jpg'
                var upload = yield wechatApi.uploadMaterial(filePath,'image',{type:'image'});
                reply = [
                        {title:'技术改变生活',
                        description :'拥抱开源',
                        picUrl:upload.url,
                        url:'https://www.github.com'
                        }
                    ]  
            } else if( sendMsg === '7') {
                var form = {
                    type :'image',
                    offset : 0,
                    count : 1,
                }
                yield wechatApi.getMaterialList(form);
            }
            

            this.body = reply;
    }
}


function replyMessageByNum(num){
    var content = {};
    console.log('num:'+num);
    if(num === '1'){
            content = 'Hello，Guys。 you are very beauty!';
    }else if(num === '2'){
            content = `    回复1：小惊喜
    回复2：大惊喜
    回复3：超大惊喜
    回复4：试试你就知道了`;;
    }else if(num === '3'){
            content = [
                {title:'技术改变生活',
                 description :'拥抱开源',
                 picUrl:'http://static.oschina.net/uploads/img/201304/17033907_yA2V.jpg',
                 url:'https://www.github.com'
                }
            ]   
    } else {
        content = '你说的太复杂我还无法理解～';
    }

    return content;
}