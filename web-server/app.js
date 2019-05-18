var express = require("express");
var path = require("path");
var fs = require("fs");
var app = express();

var dir = "./www_root";

if (fs.existsSync(dir)) { //设置静态文件访问路径
	app.use(express.static(path.join(__dirname, dir)))
}else {
	console.log("error, static folder not exist!!!");
	return;
}

app.listen(5555);

// console.log("web server start, please visit http://132.232.5.46:5555");
console.log("热更新服务器已经启动! 测试一下: http://192.168.3.2:5555/remote-assets/version.manifest");

