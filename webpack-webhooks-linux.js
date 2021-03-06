const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const child_process = require("child_process");
const config = JSON.parse(fs.readFileSync(path.join(__dirname, "./config.json"), "utf-8"));
const writeLog = require("./writeLog");



//执行生成sh脚本
const pullCmd = `
	cd ${config.sourceDir}\n
	git pull origin dev\n
`;
const buildCmd = `
	cd ${config.sourceDir}\n
	/node/nodejs/bin/node  ${path.join(config.sourceDir, "/node_modules/webpack/bin/webpack.js")}\n
`;

fs.writeFileSync(path.join(__dirname, "./pull.sh"), pullCmd);
fs.writeFileSync(path.join(__dirname, "./build.sh"), buildCmd);
//设置sh脚本执行权限
new Promise((resolve, reject)=>{
	child_process.exec(`cd ${__dirname}\n chmod -R 777  pull.sh`, err=>{
		if(err){	
			console.log("设置pull.sh权限出错");
			log("设置pull.sh权限出错");
			log(err);
			reject(err);
		}else{
			resolve();
		}
	})
}).then(()=>{
	return new Promise((resolve, reject)=>{
			child_process.exec(`cd ${__dirname}\n chmod -R 777 build.sh`, err=>{
				if(err){
					console.log("设置build.sh权限出错");
					log("设置build.sh权限出错");
					log(err);
					reject(err);
				}else{
					resolve();
				}
			})
		})
}).catch((err)=>{
	console.log(err);
});



http.createServer((req, res)=>{

    const pathname = url.parse(req.url).pathname;

    //设置返回头
    res.setHeader("Content-Type", "text/html;charset=utf-8");    

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
			log("解析请求的json数据发生错误");
			log(err);
	   	}
		
		if(body.password === config.pass){
			
			res.end("爸爸，已经接到任务，并开始执行拉取了");
			
			//开始拉取
			child_process.execFile(path.join(__dirname, "./pull.sh"), (err)=>{
				if(err){
					console.log("拉取错误");
					log("拉取错误");
					log(err);
					console.log(err);
				}else{
					
					log("拉取成功");
					//执行编译
					child_process.execFile(path.join(__dirname, "./build.sh"), (err)=>{
						if(err){
							console.log("webpack编译发生错误");
							log("webpack编译发生错误");
							log(err);
							console.log(err);
						}else{
							console.log("编译成功");
							log("编译成功");
						}
					});
				}
			});			

		}else{
			res.end("爸爸，你密码不对哦");
			log("爸爸，你密码不对哦");	
		}

	
            
        });

    }else{
        res.end("爸爸，你把api搞错啦！");
        log("爸爸，你把api搞错啦！");
    }

}).listen(config.port);
console.log("webhooks服务运行在"+config.port+"端口...");

function log(str){
	const logPath = config.logPath ? path.join(config.logPath, "./webhooks.log") : path.join(__dirname, "./webhooks.log");
	writeLog(logPath, str);
};
