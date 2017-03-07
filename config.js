var util = require('./libs/util');
var wechat_file = __dirname+'/config/wechat.txt';


var config = {
    wechat:{
        appID:"wx13160ab8067dcfd1",
        appSecret:"ea93544754752de0d7dd349dd1a5408d",
        token:"b73325a6cd970bad4c26ab3a38bc2807",
        getAccessToken:function(){
           //console.log('file path:'+wechat_file);
            return util.readFileSync(wechat_file,'utf-8');
        },
        saveAccessToken:function(data){
            data = JSON.stringify(data);
            return util.writeFileSync(wechat_file,data);
        }
    }
};

module.exports = config;