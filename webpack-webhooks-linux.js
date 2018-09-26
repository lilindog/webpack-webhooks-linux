const http = require("http");
const fs = require("fs");
const path = require("path");
const utl = require("url");
const config = JSON.parse(fs.readFileSync(path.join(__dirname, "./config.json"), "utf-8"));

http.createServer((req, res)=>{

    const pathname = url.parse(req.url).pathname;
    
    //处理webhooks请求
    if(pathname === config.api){

        let body = "";//暂且以字符串保存接受数据
        req.on("data", chunk=>{
            body += chunk;
        });
        req.on("end", ()=>{
            console.log(body);

            
        });

    }else{
        res.end("爸爸，你把api搞错啦！");
    }

}).listen(config.port);

console.log("webhooks服务运行在"+config.port+"端口...");