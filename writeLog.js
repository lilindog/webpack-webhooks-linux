/*
*
* 写log的模块，需要两个变量：1.日志路径和文件名、 2.写入的行文字
*
*/
const fs = require("fs");
const os = require("os");

let rowSpacing = "";
if(/windows/i.test(os.type())){
	rowSpacing = "\r\n\r\n";
}
if(/linux/i.test(os.type())){
	rowSpacing = "\n\n";
}

function wirteLog(path, str){
	if(fs.existsSync(path)){
		str = `${rowSpacing}[${getDate()}] ${str}`;
		fs.appendFileSync(path, str);
	}else{
		str = `[${getDate()}] ${str}`;
		fs.writeFileSync(path, str);
	}
	setTimeout(()=>{
		clearText(path);
	},200);
}
function getDate(){
	const
	obj = new Date(),
	Y = obj.getFullYear(),
	M = obj.getMonth() + 1 < 10 ? "0" + (obj.getMonth() + 1) : obj.getMonth() + 1,
	D = obj.getDate() < 10 ? "0" + obj.getDate() : obj.getDate(),
	h = obj.getHours() < 10 ? "0" + obj.getHours() : obj.getHours(),
	m = obj.getMinutes() < 10 ? "0" + obj.getMinutes() : obj.getMinutes(),
	s = obj.getSeconds() < 10 ? "0" + obj.getSeconds() : obj.getSeconds();
	return `${Y}-${M}-${D} ${h}:${m}:${s}`;
}
function clearText(path){
	const allText = fs.readFileSync(path).toString();
	let textArr = [];
	if(/windows/i.test(os.type())){
		textArr = allText.split("\r\n\r\n");
	}
	if(/linux/i.test(os.type())){
		textArr = allText.split("\n\n");
	}
	//大于20条记录就清楚多余的
	if(textArr.length > 20){
		for(let i = textArr.length; i > 20; i--){
			textArr.shift();
		}
		let newStr = "";
		if(/windows/i.test(os.type())){
			newStr = textArr.join("\r\n\r\n");
		}
		if(/linux/i.test(os.type())){
			newStr = textArr.join("\n\n");
		}
		fs.writeFileSync(path, newStr);
	}
}

module.exports = wirteLog;