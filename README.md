
1)官方脚本使用
node version_generator.js -v 1.0.0 -u http://your-server-address/tutorial-hot-update/remote-assets/ -s native/package/ -d assets/

2)部署到我的web服务器上的更改参数后的脚本
node version_generator.js -v 1.0.1 -u http://192.168.3.2:5555/remote-assets/ -s /Users/jianan/Documents/hotupdatev211_demo/build/jsb-default -d assets/

node version_generator.js -v 1.0.5 -u http://192.168.3.2:5555/remote-assets/ -s /Users/jianan/Documents/hotupdatev211_demo/build/jsb-default -d assets/

3)脚本参数解释
-v: 生成的最新的版本号
-u: 服务器最新资源存放的静态路径
-s: 准备生成version.manifest和project.manifest的src res所在的路径
-d: 生成的version.manifest和project.manifest所在的文件目录

4)更新流程对比原理
当前版本的信息在:
	assets下面的version.manifest 和 assets下面的project.manifest, 是根据build下面的src res生成的当前的版本信息，在热更新启动后，就知道当前的版本的信息

服务器上存储的remote-assets里面有：
	jsb-adapter.zip
	src
	res
	version.manifest
	project.manifest

这样就可以根据：version.manifest和project.manifest来对比进行更新，将需要下载得文件放在可写目录下

5)得到服务器地址：192.168.3.2
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

6)热更新服务器启动
➜  web-server node app.js
热更新服务器已经启动!

http://192.168.3.2:5555/remote-assets/version.manifest

7)
/Applications/CocosCreator_v_2_1_1.app/Contents/Resources/cocos2d-x/simulator/mac/Simulator.app/Contents/Resources/blackjack-remote-asset

8)
Simulator: JS: need restart!!! searchPaths= 


/Applications/CocosCreator_v_2_1_1.app/Contents/Resources/cocos2d-x/simulator/mac/Simulator.app/Contents/Resources/blackjack-remote-asset/,

/Applications/CocosCreator_v_2_1_1.app/Contents/Resources/cocos2d-x/simulator/mac/Simulator.app/Contents/Resources/blackjack-remote-asset/,


/Users/jianan/Documents/hotupdate/tutorial-hot-update/library/imports/ef/,/Applications/CocosCreator_v_2_1_1.app/Contents/Resources/cocos2d-x/simulator/mac/Simulator.app/Contents/Resources/Simulator/debugruntime/,/Applications/CocosCreator_v_2_1_1.app/Contents/Resources/cocos2d-x/simulator/mac/Simulator.app/Contents/Resources/,/Applications/CocosCreator_v_2_1_1.app/Contents/Resources/cocos2d-x/simulator/mac/Simulator.app/Contents/,/Applications/CocosCreator_v_2_1_1.app/Contents/Resources/cocos2d-x/simulator/mac/Simulator.app/Contents/Resources/,/Applications/CocosCreator_v_2_1_1.app/Contents/Resources/cocos2d-x/simulator/mac/Simulator.app/Contents/Resources/,/Applications/CocosCreator_v_2_1_1.app/Contents/Resources/cocos2d-x/simulator/mac/Simulator.app/Contents/Resources/,/Applications/CocosCreator_v_2_1_1.app/Contents/Resources/cocos2d-x/simulator/mac/Simulator.app/Contents/Resources/,/Applications/CocosCreator_v_2_1_1.app/Contents/Resources/cocos2d-x/simulator/mac/Simulator.app/Contents/Resources/,/Applications/CocosCreator_v_2_1_1.app/Contents/Resources/cocos2d-x/simulator/mac/Simulator.app/Contents/Resources/

test searchPaths= /Applications/CocosCreator_v_2_1_1.app/Contents/Resources/cocos2d-x/simulator/mac/Simulator.app/Contents/Resources/Simulator/debugruntime/,/Applications/CocosCreator_v_2_1_1.app/Contents/Resources/cocos2d-x/simulator/mac/Simulator.app/Contents/Resources/,/Applications/CocosCreator_v_2_1_1.app/Contents/Resources/cocos2d-x/simulator/mac/Simulator.app/Contents/,/Applications/CocosCreator_v_2_1_1.app/Contents/Resources/cocos2d-x/simulator/mac/Simulator.app/Contents/Resources/,/Applications/CocosCreator_v_2_1_1.app/Contents/Resources/cocos2d-x/simulator/mac/Simulator.app/Contents/Resources/,/Applications/CocosCreator_v_2_1_1.app/Contents/Resources/cocos2d-x/simulator/mac/Simulator.app/Contents/Resources/,/Applications/CocosCreator_v_2_1_1.app/Contents/Resources/cocos2d-x/simulator/mac/Simulator.app/Contents/Resources/,/Applications/CocosCreator_v_2_1_1.app/Contents/Resources/cocos2d-x/simulator/mac/Simulator.app/Contents/Resources/,/Applications/CocosCreator_v_2_1_1.app/Contents/Resources/cocos2d-x/simulator/mac/Simulator.app/Contents/Resources/

