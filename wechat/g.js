var sha1 = require('sha1');
var WeChat = require('./wechat');
var getRawBody = require('raw-body');
var util = require('./util');
var xml2json = require('xml2json');

module.exports = function(opts,handler){
   
    var wechat = new WeChat(opts);

    return function*(next){
        var that = this;
        var token = opts.token;
        var signature = this.query.signature;
        var timestamp = this.query.timestamp;
        var nonce = this.query.nonce;
        var echostr = this.query.echostr;
        var arr = [token,timestamp,nonce].sort().join('');
        var sha = sha1(arr);


        if(this.method === 'GET'){
            console.log("echostr:"+sha);
            if(sha === signature){
                this.body = echostr+'';
            } else {
                this.body = 'wrong';
            }
        } else if(this.method === 'POST') {
            if(sha !== signature){  //验证是否是微信服务器的请求
                this.body = 'wrong';
                return false;
            }
            // TODO  这个yield
            // 这个地方要用req，因为POST中过来的对象中用的是req

            var data = yield getRawBody(this.req,{
                length:this.length,
                limit:'1mb',
                encoding:this.charset
            });
            
            var message = yield util.parseXMLAsync(data);

            console.log('message:'+message.xml.MsgType);
            
            this.weixin = message.xml;

            //根据用户的消息类型来进行回复
            yield handler.call(this,next);

            //请求相应的逻辑还会回到这里
            
            wechat.reply.call(this);
        }
  }
}


function retryMsg(message,text){
    var time = new Date().getTime();
    var retrymsg = `<xml><ToUserName><![CDATA[${message.xml.FromUserName}]]></ToUserName>
                        <FromUserName><![CDATA[${message.xml.ToUserName}]]></FromUserName>
                        <CreateTime>${time}</CreateTime>
                        <MsgType><![CDATA[text]]></MsgType>
                        <Content><![CDATA[${text}]]></Content>
                        <MsgId>6392059454633395862</MsgId>
                    </xml>`;
    return retrymsg;
}



/*
if(message.xml.MsgType === 'event'){
                if(message.xml.Event === 'subscribe'){
                    var msg = "Hello Thank to your subcribe";
                    that.status = 200;
                    that.type = 'application/xml';
                    that.body = retryMsg(message,msg);
                    return;
                }
            } else if(message.xml.MsgType === 'text'){
                var text = 'Hello from Node.js';
                that.status = 200;
                that.type = 'application/xml';
                that.body = retryMsg(message,text);
                console.log("body:"+that.body);
                return;
            }



*/