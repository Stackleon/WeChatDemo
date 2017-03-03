'use strict'


exports.reply = function* (next){
    var message = this.weixin; // 挂载过的对象

    console.log('mes:'+message);
    if(message.MsgType === 'event'){
        if(message.Event === 'subscribe') {
            if(message.EventKey){
                console.log('扫描进来:'+message.EventKey +'  '+message.ticket);
            }
            this.body = '感谢关注';
        } else if(message.Event === 'unsubcribe'){
            this.body = '';
            console.log('无情取消关注');
        }

    } else if(message.MsgType === 'text'){
        this.body = 'Hello Guys,Message from Node.js';
    }
}