cc.Class({
    extends: cc.Component,

    properties: {
        mainfestUrl: {
            type: cc.Asset,
            default: null
        },
        lbl_update_status: cc.Label
    },

    checkCb: function(event){ // 检查热更结果回调
        cc.log("code =", event.getEventCode());
        switch(event.getEventCode()){
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.lbl_update_status.string = "本地manifest文件不存在, 跳过热更!";
                break;

            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.lbl_update_status.string = "下载manifest文件失败, 跳过热更!";
                break;
            
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.lbl_update_status.string = "当前已经是最新更新!";
                break;
            
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                this.lbl_update_status.string = "发现新版本，点击更新!";
                break;
            
            default:
                return;
        }
    },

    updateCb: function(event){ // 每次的热更事件回调

    },

    checkUpdate: function(){ // 点击按钮进行热更

    },

    onLoad () {
        if(!cc.sys.isNative){
            return;
        }

        this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + "hotupdate"); // 下载得热更文件的存储路径
        cc.log("热更路径 storagePath=", this._storagePath);

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

        this._am = new jsb.AssetsManager('', this._storagePath, this.versionCompareHandle);

        this._am.setVerifyCallback(function(path, asset){
            var compressed = asset.compressed;
            var expectedMD5 = asset.md5;
            var relativePath = asset.path;
            cc.log("compressed=", compressed, "expectedMD5=", expectedMD5, "relativePath=", relativePath);
            return true;
        });

        this.lbl_update_status.string = "点击检查热更情况...";
    },

    onClick: function(event, customEventData){
        if(customElements == "btn_update"){
            this.checkUpdate();
        }
    }
});
