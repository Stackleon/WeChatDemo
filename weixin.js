'use strict'


exports.reply = function* (next){
    var message = this.weixin; // 挂载过的对象

    console.log('mes:'+message);
    if(message.MsgType === 'event'){
        if(message.Event === 'subscribe') {
            if(message.EventKey){
                console.log('扫描进来:'+message.EventKey +'  '+message.ticket);
            }
            this.body = `感谢关注!
    回复1：小惊喜
    回复2：大惊喜
    回复3：超大惊喜
    回复4：试试你就知道了`;
        } else if(message.Event === 'unsubcribe'){
            this.body = '';
            console.log('无情取消关注');
        }

    } else if(message.MsgType === 'text'){
        this.body = replyMessageByNum(message.Content);
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