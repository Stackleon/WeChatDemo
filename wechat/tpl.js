'use strict'

var ejs = require('ejs');
var heredoc = require('heredoc');

var tpl = heredoc(function(){
    /*
    <xml>
        <ToUserName><![CDATA[<%= toUserName %>]]></ToUserName>
        <FromUserName><![CDATA[<%= fromUserName %>]]></FromUserName>
        <CreateTime><% createTime %></CreateTime>
        <MsgType><![CDATA[<%= msgType %>]]></MsgType>
        <% if(msgType === 'text') { %>
            <Content><![CDATA[<%= content %>]]></Content>
        <% } else if(msgType === 'image') { %>
            <Image>
            <MediaId><![CDATA[<%= content.mediaId %>]]></MediaId>
            </Image>
        <% } else if(msgType === 'voice') { %>
            <Image>
            <MediaId><![CDATA[<%= content.mediaId %>]]></MediaId>
            </Image>
        <% } else if(msgType === 'video') { %>
            <Video>
            <MediaId><![CDATA[<%= content.mediaId %>]]></MediaId>
            <Title><![CDATA[<%= content.title %>]]></Title>
            <Description><![CDATA[<%=content.description %>]]></Description>
            </Video> 
        <% } else if(msgType === 'music') { %>
            <Music>
            <Title><![CDATA[<%= content.title %>]]></Title>
            <Description><![CDATA[<%= content.description %>]]></Description>
            <MusicUrl><![CDATA[<%= content.musicUrl %>]]></MusicUrl>
            <HQMusicUrl><![CDATA[<%= content.hqMusicUrl %>]]></HQMusicUrl>
            <ThumbMediaId><![CDATA[<%= content.thumbMediaId %>]]></ThumbMediaId>
            </Music>
        <% } else if(msgType === 'news') { %>
            <ArticleCount><%= content.length %></ArticleCount>
            <Articles>
            <% content.forEach(function(item) { %>
                <item>
                <Title><![CDATA[<%= item.title %>]]></Title> 
                <Description><![CDATA[<%= item.description %>]]></Description>
                <PicUrl><![CDATA[<%= item.picUrl %>]]></PicUrl>
                <Url><![CDATA[<%= item.url %>]]></Url>
                </item>
            <% }) %>
            </Articles>
        <% } %>
    </xml>
    */
});

var compiled = ejs.compile(tpl);

exports = module.exports = {
    compiled : compiled
}


    /*
    <xml>
        <ToUserName><![CDATA[<% toUserName %>]]></ToUserName>
        <FromUserName><![CDATA[<% fromUserName %>]]></FromUserName>
        <CreateTime><% message.createTime %></CreateTime>
        <MsgType><![CDATA[<% message.msgType %>>]]></MsgType>
        <% if(message.msgType === 'text') { %>
            <Content><![CDATA]<% content %>></Content>
        <% } else if(message.msgType === 'image') { %>
            <PicUrl><![CDATA[<% content.picUrl %>]]></PicUrl>
            <MediaId><![CDATA[<% content.mediaId %>]]></MediaId>
        <% } else if(message.msgType === 'voice') { %>
            <MediaId><![CDATA[<% content.mediaId %>]]></MediaId>
            <Format><![CDATA[<% content.format %>]]></Format>
            <Recognition><![CDATA[<% content.recongnition %>]]></Recognition>
        <% } else if(message.msgType === 'video') { %>
            <MediaId><![CDATA[<% content.mediaId %>]]></MediaId>
            <ThumbMediaId><![CDATA[<% content.thumbMediaId %>]]></ThumbMediaId>
        <% } else if(message.msgType === 'shortvideo') { %>
            <MediaId><![CDATA[<% content.mediaId %>]]></MediaId>
            <ThumbMediaId><![CDATA[<% content.thumbMediaId %>]]></ThumbMediaId>
        <% } else if(message.msgType === 'location') { %>
            <Location_X><% content.locationX %></Location_X>
            <Location_Y><% content.locationY %></Location_Y>
            <Scale><% content.scale %></Scale>
            <Label><![CDATA[<% content.localLabel %>]]></Label>
        <% } else if(message.msgType === 'link') { %>
            <Title><![CDATA[<% content.linkTitle %>]]></Title>
            <Description><![CDATA[<% content.linkDescription %>]]></Description>
            <Url><![CDATA[<% content.url %>]]></Url>
        <MsgId>1234567890123456</MsgId>
    </xml>
    */