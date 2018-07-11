"use strict";
cc._RF.push(module, '94d9eukNMtCj7RlWUUQhCfK', 'updateScore');
// common/script/updateScore.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {},

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {},
    start: function start() {},
    init: function init(pool) {
        this.animation = this.node.getComponent(cc.Animation);
        this.animation.on('finished', this.finished, this);
        this.pool = pool;
        this.animation.play();
    },
    finished: function finished() {
        this.pool.put(this.node);
    }
    // update (dt) {},

});

cc._RF.pop();