const fs = require('fs');
const crypto = require('crypto');

const check_md5 = (path)=>{
    return new Promise((resolve,reject)=>{
        let md5sum = crypto.createHash('md5');
        let stream = fs.createReadStream(path);
        stream.on('data', function(chunk) {
            md5sum.update(chunk);
        });
        stream.on('end', function() {
            str = md5sum.digest('hex').toUpperCase();
            str = '0x'+str;
            resolve(str);
        });
    })  
}

const fileDir = (dir)=>{
    var results = []
    var list = fs.readdirSync(dir)
    list.forEach(function(file) {
        file = dir + '/' + file
        var stat = fs.statSync(file)
        if (stat && stat.isDirectory()) results = results.concat(fileDir(file))
        else results.push(file)
    })
    return results
}

const writeLog = (str)=>{
    fs.writeFile('md5_log.txt', str, { 'flag': 'a' }, function(err) {
        if (err) {
            throw err;
        }
    });
}

const getDirFileMd5 = (dir, bOutputToFile)=>{
    if(bOutputToFile){
        if(fs.existsSync('md5_log.txt')){
            fs.unlinkSync('md5_log.txt');
        }
    }
    let fileList = fileDir(dir);
    fileList.forEach((value)=>{
        check_md5(value).then((str)=>{
            if(bOutputToFile){
                value = value.replace(dir,'');
                writeLog(value + "    " + str + "\n");
            }else{
                console.log(value + "    " + str);
            }
        })
    })
}
