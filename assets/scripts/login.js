cc.Class({
    extends: cc.Component,

    properties: {
        lbl_scene_tag: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.lbl_scene_tag.string = "登陆场景哈马奶提";
    },

    onClick: function(event, customEventData){
        if(customEventData == "btn_go_game"){
            cc.director.loadScene("game");
        }
    }
});
