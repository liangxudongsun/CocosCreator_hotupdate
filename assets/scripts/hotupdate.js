cc.Class({
    extends: cc.Component,

    properties: {
        manifestUrl: {
            type: cc.Asset,
            default: null
        },
        lbl_update_status: cc.Label
    },

    onLoad () { // step 1.初始化热更新管理器，并且设置存储热更下来的文件路径
        if(!cc.sys.isNative){
            return;
        }

        var searchPaths = jsb.fileUtils.getSearchPaths();
        cc.log("重点:可写路径 searchPaths=", searchPaths);

        this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + "hotupdate"); // 下载的热更文件的存储路径，目录不存在则创建
        cc.log("热更下来文件存储的可写路径 storagePath=", this._storagePath);

        this.versionCompareHandle = function(versionA, versionB){
            var vA = versionA.split('.');
            var vB = versionB.split('.');
            for(var i = 0; i < vA.length; i++){
                var a = parseInt(vA[i]);
                var b = parseInt(vB[i] || 0);
                if(a == b){
                    continue;
                }else{
                    return a - b;
                }
            }

            if(vB.length > vA.length){
                return -1;
            }else{
                return 0;
            }
        };

        this._am = new jsb.AssetsManager('', this._storagePath, this.versionCompareHandle); // new 一个热更新器

        this._am.setVerifyCallback(function(path, asset){
            var compressed = asset.compressed;
            var expectedMD5 = asset.md5;
            var relativePath = asset.path;
            cc.log("compressed=", compressed, "expectedMD5=", expectedMD5, "relativePath=", relativePath);
            return true;
        });

        this.lbl_update_status.string = "点击检查热更情况";
    },

    checkUpdate: function(){ // step 2.点击按钮进行热更： 加载本地文件列表; 里面存储的有远程最新文件，因此知道更新什么东西
        if(!cc.sys.isNative){
            return;
        }

        if(this._updating){
            this.lbl_update_status.string = "正在热更中,不要重复点击";
            return;
        }

        if(this._am.getState() == jsb.AssetsManager.State.UNINITED){
            var url = this.manifestUrl.nativeUrl; 
            if(cc.loader.md5Pipe){
                url = cc.loader.md5Pipe.transformURL(url);
            }
            this._am.loadLocalManifest(url); // 热更新器加载本地md5列表信息  
        }

        if(!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()){
            this.lbl_update_status.string = "本地热更新manifest文件加载失败!";
            return;
        }
        this._am.setEventCallback(this.checkCb.bind(this)); // step 3.注册是否可以热更结果的回调
        this._am.checkUpdate(); // step 4.开始检查更新，所以可以先弹出: 发现新版本

        this._updating = true;
    },

    findNewVersion: function(){
        this._am.setEventCallback(null);
        this._updating = false;
    },

    realUpdate: function(){
        if(this._am && !this._updating){
            this._am.setEventCallback(this.checkCb.bind(this));
            if(this._am.getState() == jsb.AssetsManager.State.UNINITED){
                var url = this.manifestUrl.nativeUrl;
                if(cc.loader.md5Pipe){
                    url = cc.loader.md5Pipe.transformURL(url);
                    this._am.loadLocalManifest(url);
                }
            }
            this._am.update();
            this._updating = true;
        }
    },

    checkCb: function(event){ // step 5.热更事件回调
        cc.log("code =", event.getEventCode());

        var needRestart = false;

        switch(event.getEventCode()){
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.lbl_update_status.string = "本地manifest文件不存在, 跳过热更!";
                break;

            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                var byteProgress = event.getPercent(); // 已经下载文件大小百分比
                var fileProgress = event.getPercentByFile(); // 已经下载文件数量百分比
                var downloadedFiles = event.getDownloadedFiles(); // 已经下载得文件数量
                var totalFiles = event.getTotalFiles(); // 总共下载得文件数量
                var downloadedBytes = event.getDownloadedBytes(); // 已经下载文件大小
                var totalBytes = event.getTotalBytes(); // 总共需要下载文件大小
                var msg = event.getMessage(); // 正在更新的文件

                this.lbl_update_status.string = "热更进度:" + byteProgress + "文件=" + msg;

                cc.log("byteProgress=", byteProgress, 
                        "fileProgress=", fileProgress, 
                        "downloadedFiles=", downloadedFiles, 
                        "totalFiles=", totalFiles, 
                        "downloadedBytes=", downloadedBytes, 
                        "totalBytes=", totalBytes, 
                        "msg=", msg);

                break;

            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.lbl_update_status.string = "远程manifest文件下载失败, 跳过热更!";
                break;
            
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.lbl_update_status.string = "当前已经是最新更新!";
                break;
            
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                needRestart = true;
                this.lbl_update_status.string = "热更完毕!";
                break;

            case jsb.EventAssetsManager.UPDATE_FAILED:
                this.lbl_update_status.string = "热更文件" + event.getMessage() + "失败!";
                break;

            case jsb.EventAssetsManager.ERROR_UPDATING:
                this.lbl_update_status.string = "Asset update error:" + event.getAssetId() + "," + event.getMessage();
                break;

            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                this.lbl_update_status.string = "解压错误" + event.getMessage();
                break;

            case jsb.EventAssetsManager.NEW_VERSION_FOUND: // 进大厅就更新了能用上不??
                this.lbl_update_status.string = "发现新版本，点击更新!";
                this.findNewVersion();
                this.realUpdate();
                break;

            default:
                return;
        }

        if(needRestart){
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this._am.getLocalManifest().getSearchPaths(); // 热更路径
            cc.log("热更存储路径newPaths=", newPaths);
            Array.prototype.unshift.apply(searchPaths, newPaths);  // step 6. 设置热更路径为第一搜索路径
             //搜索路径序列化
             cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);
            cc.audioEngine.stopAll();
            cc.game.restart(); // step 7.热更完成重启游戏
        }
    },

    onClick: function(event, customEventData){
        if(customEventData == "btn_update"){
            this.checkUpdate();
        }
    }
});
