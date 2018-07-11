"use strict";
cc._RF.push(module, 'baf50XihDRFIaBGw0Wxvakp', 'player');
// common/script/player.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        ID: {
            default: 0
        }
    },

    onLoad: function onLoad() {
        this.gameManager = cc.find('Canvas').getComponent('gameManager');
        this.animation = this.node.getComponent(cc.Animation);
        this.animation.on('finished', this._finished, this);
        this.hitAnimName = 'beat1';
        this.beHitedAnimName = 'beingBeaten';
        this.standUpAnimName = 'bescold';
        this.complacentAnimName = 'dese';
        this.sitDownAnimName = 'lunges';
        this.playerState = Player_State.None;
        clientEvent.on(clientEvent.eventType.hitEvent, this.hitEvent, this);
        clientEvent.on(clientEvent.eventType.standUpEventMed, this.standUpEvent, this);
        clientEvent.on(clientEvent.eventType.complacentEvent, this.complacentEvent, this);
        clientEvent.on(clientEvent.eventType.sitDown, this.sitDown, this);
    },
    complacentEvent: function complacentEvent(param) {
        if (param.ID === this.ID) {
            this.complacent();
        }
    },
    standUpEvent: function standUpEvent(param) {
        if (param.ID === this.ID) {
            this.standUp();
        }
    },
    sitDown: function sitDown() {
        this.playerState = Player_State.SitDown;
        this.animation.play(this.sitDownAnimName);
    },
    hitEvent: function hitEvent(param) {
        if (param.ID === this.ID) {
            this.hit();
        } else {
            this.beingHit();
        }
    },
    hit: function hit() {
        this.node.setSiblingIndex(999);
        this.playerState = Player_State.Hit;
        this.animation.play(this.hitAnimName);
    },
    beingHit: function beingHit() {
        this.node.setSiblingIndex(0);
        this.playerState = Player_State.BeingHit;
        this.animation.play(this.beHitedAnimName);
    },
    standUp: function standUp() {
        this.playerState = Player_State.StandUp;
        this.animation.play(this.standUpAnimName);
    },
    complacent: function complacent() {
        this.playerState = Player_State.Complacent;
        this.animation.play(this.complacentAnimName);
    },
    _finished: function _finished(event) {
        this.playerState = Player_State.none;
    },
    onDestroy: function onDestroy() {
        this.animation.off('finished', this._finished, this);

        clientEvent.off(clientEvent.eventType.hitEvent, this.hitEvent, this);
        clientEvent.off(clientEvent.eventType.standUpEventMed, this.standUpEvent, this);
        clientEvent.off(clientEvent.eventType.complacentEvent, this.complacentEvent, this);
        clientEvent.off(clientEvent.eventType.sitDown, this.sitDown, this);
    }
});

cc._RF.pop();