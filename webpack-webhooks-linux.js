const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const child_process = require("child_process");
const config = JSON.parse(fs.readFileSync(path.join(__dirname, "./config.json"), "utf-8"));



//执行生成sh脚本
const pullCmd = `
	cd ${config.sourceDir}\n 
	git pull origin master
`;
const buildCmd = `
	cd ${config.sourceDir}\n
	webpack	
`;
fs.writeFileSync(path.join(__dirname, "./pull.sh", pullCmd));
fs.eriteFileSync(path.join(__dirname, "./build.sh"), buildCmd);



http.createServer((req, res)=>{

    const pathname = url.parse(req.url).pathname;
    
    //处理webhooks请求
    if(pathname === config.api){

        let body = "";//暂且以字符串保存接受数据
        req.on("data", chunk=>{
            body += chunk;
        });
        req.on("end", ()=>{
        	try{
			body = JSON.parse(body);
	        }catch(err){
			console.log("解析请求的json数据发生错误");
	   	}
		
		if(body.password === config.pass){
			
			//开始拉取
			child_process.execFile(path.join(__dirname, "./pull.sh"), (err)=>{
				if(err){
					console.log("拉取错误");
					console.log(err);
				}else{
					//执行编译
					child_process.execFile(path.join(__dirname, "./build.sh"), (err)=>{
						if(err){
							console.log("weboack编译发生错误");
							console.log(err);
						}else{
							console.log("编译成功");
						}
					});
				}
			});			

		}else{
			res.end("爸爸，你密码不对哦");	
		}
	
	
            
        });

    }else{
        res.end("爸爸，你把api搞错啦！");
    }

}).listen(config.port);

console.log("webhooks服务运行在"+config.port+"端口...");
