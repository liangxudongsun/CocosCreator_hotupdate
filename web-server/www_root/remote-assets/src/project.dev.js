window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  game: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a1da4r4JeZIspFLUJBMJyQd", "game");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      start: function start() {}
    });
    cc._RF.pop();
  }, {} ],
  hotupdate: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3293dvZzv5JR4sMcjMUdrQx", "hotupdate");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        manifestUrl: {
          type: cc.Asset,
          default: null
        },
        lbl_update_status: cc.Label
      },
      onLoad: function onLoad() {
        if (!cc.sys.isNative) return;
        this._storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "hotupdate";
        cc.log("\u70ed\u66f4\u4e0b\u6765\u6587\u4ef6\u5b58\u50a8\u7684\u53ef\u5199\u8def\u5f84 storagePath=", this._storagePath);
        this.versionCompareHandle = function(versionA, versionB) {
          var vA = versionA.split(".");
          var vB = versionB.split(".");
          for (var i = 0; i < vA.length; i++) {
            var a = parseInt(vA[i]);
            var b = parseInt(vB[i] || 0);
            if (a == b) continue;
            return a - b;
          }
          return vB.length > vA.length ? -1 : 0;
        };
        this._am = new jsb.AssetsManager("", this._storagePath, this.versionCompareHandle);
        this._am.setVerifyCallback(function(path, asset) {
          var compressed = asset.compressed;
          var expectedMD5 = asset.md5;
          var relativePath = asset.path;
          cc.log("compressed=", compressed, "expectedMD5=", expectedMD5, "relativePath=", relativePath);
          return true;
        });
        this.lbl_update_status.string = "\u70b9\u51fb\u68c0\u67e5\u70ed\u66f4\u60c5\u51b5";
      },
      checkUpdate: function checkUpdate() {
        if (this._updating) {
          this.lbl_update_status.string = "\u6b63\u5728\u70ed\u66f4\u4e2d,\u4e0d\u8981\u91cd\u590d\u70b9\u51fb";
          return;
        }
        if (this._am.getState() == jsb.AssetsManager.State.UNINITED) {
          var url = this.manifestUrl.nativeUrl;
          cc.loader.md5Pipe && (url = cc.loader.md5Pipe.transformURL(url));
          this._am.loadLocalManifest(url);
        }
        if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
          this.lbl_update_status.string = "\u672c\u5730\u70ed\u66f4\u65b0manifest\u6587\u4ef6\u52a0\u8f7d\u5931\u8d25!";
          return;
        }
        this._am.setEventCallback(this.checkCb.bind(this));
        this._am.checkUpdate();
        this._updating = true;
      },
      findNewVersion: function findNewVersion() {
        this._am.setEventCallback(null);
        this._updating = false;
      },
      realUpdate: function realUpdate() {
        if (this._am && !this._updating) {
          this._am.setEventCallback(this.checkCb.bind(this));
          if (this._am.getState() == jsb.AssetsManager.State.UNINITED) {
            var url = this.manifestUrl.nativeUrl;
            if (cc.loader.md5Pipe) {
              url = cc.loader.md5Pipe.transformURL(url);
              this._am.loadLocalManifest(url);
            }
          }
          this._am.update();
          this._updating = true;
        }
      },
      checkCb: function checkCb(event) {
        cc.log("code =", event.getEventCode());
        var needRestart = false;
        switch (event.getEventCode()) {
         case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
          this.lbl_update_status.string = "\u672c\u5730manifest\u6587\u4ef6\u4e0d\u5b58\u5728, \u8df3\u8fc7\u70ed\u66f4!";
          break;

         case jsb.EventAssetsManager.UPDATE_PROGRESSION:
          var byteProgress = event.getPercent();
          var fileProgress = event.getPercentByFile();
          var downloadedFiles = event.getDownloadedFiles();
          var totalFiles = event.getTotalFiles();
          var downloadedBytes = event.getDownloadedBytes();
          var totalBytes = event.getTotalBytes();
          var msg = event.getMessage();
          this.lbl_update_status.string = "\u70ed\u66f4\u8fdb\u5ea6:" + byteProgress + "\u6587\u4ef6=" + msg;
          cc.log("byteProgress=", byteProgress, "fileProgress=", fileProgress, "downloadedFiles=", downloadedFiles, "totalFiles=", totalFiles, "downloadedBytes=", downloadedBytes, "totalBytes=", totalBytes, "msg=", msg);
          break;

         case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
         case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
          this.lbl_update_status.string = "\u8fdc\u7a0bmanifest\u6587\u4ef6\u4e0b\u8f7d\u5931\u8d25, \u8df3\u8fc7\u70ed\u66f4!";
          break;

         case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
          this.lbl_update_status.string = "\u5f53\u524d\u5df2\u7ecf\u662f\u6700\u65b0\u66f4\u65b0!";
          break;

         case jsb.EventAssetsManager.UPDATE_FINISHED:
          needRestart = true;
          this.lbl_update_status.string = "\u70ed\u66f4\u5b8c\u6bd5!";
          break;

         case jsb.EventAssetsManager.UPDATE_FAILED:
          this.lbl_update_status.string = "\u70ed\u66f4\u6587\u4ef6" + event.getMessage() + "\u5931\u8d25!";
          break;

         case jsb.EventAssetsManager.ERROR_UPDATING:
          this.lbl_update_status.string = "Asset update error:" + event.getAssetId() + "," + event.getMessage();
          break;

         case jsb.EventAssetsManager.ERROR_DECOMPRESS:
          this.lbl_update_status.string = "\u89e3\u538b\u9519\u8bef" + event.getMessage();
          break;

         case jsb.EventAssetsManager.NEW_VERSION_FOUND:
          this.lbl_update_status.string = "\u53d1\u73b0\u65b0\u7248\u672c\uff0c\u70b9\u51fb\u66f4\u65b0!";
          this.findNewVersion();
          this.realUpdate();
          break;

         default:
          return;
        }
        if (needRestart) {
          var searchPaths = jsb.fileUtils.getSeatchPaths();
          var newPaths = this._am.getLocalManifest().getSeatchPaths();
          cc.log("\u70ed\u66f4\u5b58\u50a8\u8def\u5f84newPaths=", newPaths);
          Array.prototype.unshift.apply(searchPaths, newPaths);
          jsb.fileUtils.setSearchPaths(searchPaths);
          cc.audioEngine.stopAll();
          cc.game.restart();
        }
      },
      onClick: function onClick(event, customEventData) {
        "btn_update" == customEventData && this.checkUpdate();
      }
    });
    cc._RF.pop();
  }, {} ],
  login: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b7c39QA0MBFApiMXf1dJnNE", "login");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        lbl_scene_tag: cc.Label
      },
      start: function start() {
        this.lbl_scene_tag.string = "\u767b\u9646\u573a\u666f\u54c8";
      },
      onClick: function onClick(event, customEventData) {
        "btn_go_game" == customEventData && cc.director.loadScene("game");
      }
    });
    cc._RF.pop();
  }, {} ]
}, {}, [ "game", "hotupdate", "login" ]);