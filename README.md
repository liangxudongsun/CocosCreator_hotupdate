# 搭建热更新服务器技术栈
* 客户端: cocos creator 2.1.1 + AssetsManager
* web服务器: express

## 1)总体思路
```
step 1.初始化热更新管理器，并且设置存储热更下来的文件路径
step 2.点击按钮进行热更： 加载本地文件列表; 里面存储的有远程最新文件，因此知道更新什么东西
step 3.注册是否可以热更结果的回调
step 4.开始检查更新，所以可以先弹出: 发现新版本
step 5 发现新版本后清理回调
step 6 重新注册开始真正更新
step 7.热更事件回调被不断触发，更新进度，直到更新完毕
step 8. 设置热更路径为第一搜索路径，存到localstoage中，等到下次重启在main.js中设置搜索路径
step 9.重启游戏，让在科协路径下载下来的文件生效
```

## 2)官方脚本使用
```
node version_generator.js -v 1.0.0 -u http://your-server-address/tutorial-hot-update/remote-assets/ -s native/package/ -d assets/
```

## 3)version_generator.js脚本参数解释
```
-v: 生成的最新的版本号
-u: 服务器最新资源存放的静态路径
-s: 准备生成version.manifest和project.manifest的src res所在的路径
-d: 生成的version.manifest和project.manifest所在的文件目录
```

## 4)得到服务器地址：192.168.3.2
```
➜  ~ ifconfig
lo0: flags=8049<UP,LOOPBACK,RUNNING,MULTICAST> mtu 16384
	options=3<RXCSUM,TXCSUM>
	inet6 ::1 prefixlen 128
	inet 127.0.0.1 netmask 0xff000000
	inet6 fe80::1%lo0 prefixlen 64 scopeid 0x1
	nd6 options=1<PERFORMNUD>
gif0: flags=8010<POINTOPOINT,MULTICAST> mtu 1280
stf0: flags=0<> mtu 1280
en0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500
	options=6b<RXCSUM,TXCSUM,VLAN_HWTAGGING,TSO4,TSO6>
	ether f8:32:e4:76:e6:80
	inet6 fe80::fa32:e4ff:fe76:e680%en0 prefixlen 64 scopeid 0x4
	inet 192.168.3.2 netmask 0xffffff00 broadcast 192.168.3.255
	nd6 options=1<PERFORMNUD>
	media: autoselect (100baseTX <full-duplex,flow-control>)
	status: active

因此:inet 192.168.3.2得到ip地址
```

## 5)android热更环境总体流程：
*  1)生成最原始版本manifest文件

```
node version_generator.js -v 1.0.1 -u http://192.168.3.2:5555/remote-assets/ -s /Users/jianan/Documents/hotupdatev211_demo/build/jsb-default -d assets/
```

*  2)在/Users/jianan/Documents/hotupdatev211_demo/build/jsb-default中构建生成src res

*  3)修改:/Users/jianan/Documents/hotupdatev211_demo/build/jsb-default/main.js文件 

```
在最开头加内容(main.js要被打包到android包，因此，这样修改后，保证android包里面的文件一定设置了搜索路径):
if (jsb) {  // cc.sys.jsb发现在mac模拟器上找不到,因此写jsb
    var hotUpdateSearchPaths = localStorage.getItem('HotUpdateSearchPaths');
    if (hotUpdateSearchPaths) {
        jsb.fileUtils.setSearchPaths(JSON.parse(hotUpdateSearchPaths));
    }
}
```

*  4)打android包

*  5)修改一点游戏内容(脚本、场景、资源均可以)

*  6)构建得到新的资源

*  7)生成更新的manifest文件

```
node version_generator.js -v 1.0.5 -u http://192.168.3.2:5555/remote-assets/ -s /Users/jianan/Documents/hotupdatev211_demo/build/jsb-default -d assets/
```

*  8)提交4个文件到web服务器

```
/Users/jianan/Documents/hotupdatev211_demo/build/jsb-default/src
/Users/jianan/Documents/hotupdatev211_demo/build/jsb-default/res
/Users/jianan/Documents/hotupdatev211_demo/assets/version.manifest
/Users/jianan/Documents/hotupdatev211_demo/assets/project.manifest
```

*  9)启动web服务器

```
➜  web-server git:(master) ✗ node app.js
热更新服务器已经启动! 测试一下: http://192.168.3.2:5555/remote-assets/version.manifest
```

*  10)打开apk，检查更新即可

## 6)更新效果
*  最开始的登陆界面图

![](./imgs/1.jpg)

*  登陆界面更新了一张图片和脚本

![](./imgs/2.jpg)

*  游戏界面更新

![](./imgs/3.jpg)


