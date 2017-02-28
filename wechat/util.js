'use strict'

var xml2js = require('xml2js');
var xml2json = require('xml2json');

exports.parseXMLAsync = function(xml){
    return new Promise(function(resolve,reject){
        var result = xml2json.toJson(xml);
        resolve(JSON.parse(result));
    });
}

function formatMessage(result){
    var message = {};
    if(typeof result === 'object'){
        var keys = Object.keys(result);
        for(var i =0 ;i<keys.length;i++){
            var item = result[keys[i]];
            var key = keys[i];
            console.log(+key+':'+item);

            if(!(item instanceof Array) || item.length === 0){
                continue;
            }

            if(item.length === 1){
                var val = item[0];

                if(typeof val === 'object') {
                    message[key] = formatMessage(val);
                } else {
                    message[key] = (val || '').trim();
                }
            } else if(item.length > 1) {
                message[key] = [];
                for(var j = 0,k = item.length;j<k;j++){
                    message[key].push(formatMessage(item[j]));
                }
            }
        }
    }

    return message;
}



exports.formatMessage = function(result){
    return formatMessage(result);
}