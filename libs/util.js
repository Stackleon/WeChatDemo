var fs = require('fs');

exports.readFileSync = function(path,encoding){
   return new Promise(function(resolve,reject){
        fs.readFile(path,encoding,function(err,content){
            //console.log('err:'+err+'  content:'+content);
            if(err){
                reject(err);
            } else{
                resolve(content);
            }
        })
    });
}

exports.writeFileSync = function(path,content){
    return new Promise(function(resolve,reject){
        fs.writeFile(path,content,function(err){
            if(err){
                reject(err);
            }else{
                resolve();
            }
        });
    });
}
