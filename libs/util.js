var fs = require('fs');

exports.readFileSync = function(path,encoding){
   return new Promise(function(resolve,reject){
        fs.readFile(path,encoding,function(err,content){
            if(err){
                reject(err);
            } else{
                resolve(err);
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
