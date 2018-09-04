var mvs = require("Matchvs");
var GLB = require("Glb");
var Appear_Role = {
    None: 0,
    Brother: 1,
    Teacher: 2,
    Besom: 3,
    Door: 4
};
cc.Class({
    extends: require("uiPanel"),

    properties: {
        hitAudio: {
            default: null,
            url: cc.AudioClip
        },
        laughAudio: {
            default: null,
            url: cc.AudioClip
        },
        closeDoorSmall: {
            default: null,
            url: cc.AudioClip
        },
        closeDoorAll: {
            default: null,
            url: cc.AudioClip
        },
        standUpAuido: {
            default: null,
            url: cc.AudioClip
        },
        besomNode: cc.Node,
        brotherNode: cc.Node,
        teacherNode: cc.Node,
        shutDoorSprite: cc.SpriteFrame,
        halfDoorSprite: cc.SpriteFrame,
        hitButtonNode: cc.Node,
        complacentButtonNode: cc.Node,
        addRedPrefab: cc.Prefab,
        reduceRedPrefab: cc.Prefab,
        addBluePrefab: cc.Prefab,
        reduceBluePrefab: cc.Prefab,
        redNumParent: cc.Node,
        blueNumParent: cc.Node,
        redScoreNode: cc.Node,
        blueScoreNode: cc.Node,
        timeNode: cc.Node,
        selfNode: cc.Node,
        otherNode: cc.Node,
        selfIcon: cc.Node,
        rivalIcon: cc.Node
    },

    onLoad() {
        this._super();
        this.curAppearRole = Appear_Role.None;
        this.totalInterval = 6;
        this.curInterval = 0;
        this.besomAnim = this.besomNode.getComponent(cc.Animation);
        this.besomAnimName = 'broom';
        this.brotherAnim = this.brotherNode.getComponent(cc.Animation);
        this.brotherAudio = this.brotherNode.getComponent(cc.AudioSource);
        this.brotherAnimName = 'teacherBro';
        this.teacherAnim = this.teacherNode.getComponent(cc.Animation);
        this.teacherAudio = this.teacherNode.getComponent(cc.AudioSource);

        this.halfDoorAnimName = 'noOpen';
        this.openDoorAnimName = 'openDoo';
        this.closeDoorAnimName = 'close';

        this.brotherAnim.on('finished', this.roleAlreadyAppear, this);
        this.teacherAnim.on('finished', this.roleAlreadyAppear, this);
        this.besomAnim.on('finished', this.roleAlreadyAppear, this);
        this.redScoreLabel = this.redScoreNode.getComponent(cc.Label);
        this.blueScoreLabel = this.blueScoreNode.getComponent(cc.Label);
        this.timeLabel = this.timeNode.getComponent(cc.Label);
        clientEvent.on(clientEvent.eventType.appearBesom, this.appearBesom, this);
        clientEvent.on(clientEvent.eventType.appearBrother, this.appearBrother, this);
        clientEvent.on(clientEvent.eventType.appearTeacher, this.appearTeacher, this);
        clientEvent.on(clientEvent.eventType.halfOpenDoor, this.halfOpenDoor, this);
        clientEvent.on(clientEvent.eventType.standUpEvent, this.standUpEvent, this);
        clientEvent.on(clientEvent.eventType.sitDown, this.sitDown, this);
        clientEvent.on(clientEvent.eventType.showAddRedNum, this.showAddRedNum, this);
        clientEvent.on(clientEvent.eventType.showReduceRedNum, this.showReduceRedNum, this);
        clientEvent.on(clientEvent.eventType.showBlueAddNum, this.showBlueAddNum, this);
        clientEvent.on(clientEvent.eventType.showReduceBlueNum, this.showReduceBlueNum, this);
        clientEvent.on(clientEvent.eventType.hitEvent, this.hit, this);
        clientEvent.on(clientEvent.eventType.complacentEvent, this.complacent, this);
        clientEvent.on(clientEvent.eventType.gameOver, this.gameOver, this);
        clientEvent.on(clientEvent.eventType.roundStart, this.roundStart, this);
        clientEvent.on(clientEvent.eventType.leaveRoomNotify, this.leaveRoom, this);
        clientEvent.on(clientEvent.eventType.leaveRoomMedNotify, this.leaveRoom, this);

        this.isPersonAppear = false;
        this.isNeedTiming = true;
        this.isPlayerStandUp = false;
        this.totalStandUpTime = 3;
        this.curStandUpTime = 0;
        this.addredNumPool = null;
        this.reduceRedNumPool = null;
        this.addBlueNumPool = null;
        this.reduceBlueNumPool = null;
        this.createPool();
        this.selfScore = 0;
        this.otherScore = 0;
        this.updateSelfScore(0);
        this.updateOtherScore(0);
        this.totalTime = 60;
        this.curTime = 60;
        this.timer = null;

        console.log("----------------");
        console.log(this.nodeDict);
        console.log(this.selfIcon);
        this.selfIcon.getComponent('playerIcon').setData({id: GLB.playerUserIds[0]});
        this.rivalIcon.getComponent('playerIcon').setData({id: GLB.playerUserIds[1]});
        this.self = this.selfNode.getComponent('player');
        this.other = this.otherNode.getComponent('player');

        this.nodeDict["exit"].on("click", this.exit, this);
    },

    leaveRoom(data) {
        if (Game.GameManager.gameState !== GameState.Over) {
            uiFunc.openUI("uiTip", function(obj) {
                var uiTip = obj.getComponent("uiTip");
                if (uiTip) {
                    if (data.leaveRoomInfo.userId !== GLB.userInfo.id) {
                        uiTip.setData("对手离开了游戏");
                    }
                }
            }.bind(this));
        }
    },

    roundStart: function() {
        // 回合画面表现--
        this.nodeDict['readyGo'].getComponent(cc.Animation).play();
        this.nodeDict['readyGo'].getComponent(cc.AudioSource).play();

        setTimeout(function() {
            this.countDownEvent();
        }.bind(this), 2500);
    },

    gameOver() {
        this.nodeDict['gameOver'].getComponent(cc.Animation).play();
        this.nodeDict['gameOver'].getComponent(cc.AudioSource).play();
        clearInterval(this.timer);
    },

    exit() {
        uiFunc.openUI("uiExit");
    },

    countDownEvent() {
        this.countDown();
        this.timer = setInterval(this.countDown.bind(this), 1000);
    },
    countDown() {
        if (Game.GameManager.gameState !== GameState.Play) {
            clearInterval(this.timer);
            return;
        }
        this.timeLabel.string = this.curTime.toString();
        if (this.curTime <= 0) {
            clearInterval(this.timer);
            if (GLB.isRoomOwner && Game.GameManager.gameState === GameState.Play) {
                var msg = {action: GLB.GAME_OVER_EVENT};
                Game.GameManager.sendEventEx(msg);
            }
            return;
        }
        if (this.curTime === 10) {
            this.nodeDict["countdown"].getComponent(cc.Animation).play("countdown7");
        } else if (this.curTime === 3) {
            this.nodeDict["countdown"].getComponent(cc.Animation).play("countdown3");
        }
        this.curTime--;
    },
    updateSelfScore(num) {
        this.selfScore += num;
        if (this.selfScore < 0) {
            this.selfScore = 0;
        }
        this.blueScoreLabel.string = this.selfScore.toString();
    },
    updateOtherScore(num) {
        this.otherScore += num;
        if (this.otherScore < 0) {
            this.otherScore = 0;
        }
        this.redScoreLabel.string = this.otherScore.toString();
    },
    createPool() {
        this.addredNumPool = new cc.NodePool();
        this.reduceRedNumPool = new cc.NodePool();
        this.addBlueNumPool = new cc.NodePool();
        this.reduceBlueNumPool = new cc.NodePool();
        for (var i = 0; i < 10; i++) {
            var addRedItem = cc.instantiate(this.addRedPrefab);
            var reduceRedItem = cc.instantiate(this.reduceRedPrefab);
            var addBlueItem = cc.instantiate(this.addBluePrefab);
            var reduceBlueItem = cc.instantiate(this.reduceBluePrefab);
            this.addredNumPool.put(addRedItem);
            this.reduceRedNumPool.put(reduceRedItem);
            this.addBlueNumPool.put(addBlueItem);
            this.reduceBlueNumPool.put(reduceBlueItem);
        }
    },
    getPoolItem(pool, prefab) {
        var item = null;
        if (pool.size() > 0) {
            item = pool.get();
        } else {
            item = cc.instantiate(prefab);
        }
        return item;
    },
    showAddRedNum() {
        var item = this.getPoolItem(this.addredNumPool, this.addRedPrefab);
        var score = item.getComponent('updateScore');
        item.parent = this.redNumParent;
        score.init(this.addredNumPool);
        this.updateOtherScore(1);
    },
    showReduceRedNum() {
        var item = this.getPoolItem(this.reduceRedNumPool, this.reduceRedPrefab);
        var score = item.getComponent('updateScore');
        item.parent = this.redNumParent;
        score.init(this.reduceRedNumPool);
        this.updateOtherScore(-2);
    },
    showBlueAddNum() {
        var item = this.getPoolItem(this.addBlueNumPool, this.addBluePrefab);
        var score = item.getComponent('updateScore');
        item.parent = this.blueNumParent;
        score.init(this.addBlueNumPool);
        this.updateSelfScore(1);
    },
    showReduceBlueNum() {
        var item = this.getPoolItem(this.reduceBlueNumPool, this.reduceBluePrefab);
        var score = item.getComponent('updateScore');
        item.parent = this.blueNumParent;
        score.init(this.reduceBlueNumPool);
        this.updateSelfScore(-2);
    },
    roleAlreadyAppear(event) {
        if (event.detail.name === this.openDoorAnimName || event.detail.name === this.brotherAnimName) {
            if (event.detail.wrapMode === 1) {
                this.isPersonAppear = true;
            } else {
                this.isNeedTiming = true;
            }
        }
        if (event.detail.name === this.halfDoorAnimName || event.detail.name === this.besomAnimName) {
            this.isNeedTiming = true;
        }


    },
    standUpEvent(param) {
        clientEvent.dispatch(clientEvent.eventType.standUpEventMed, param);
        if (this.self.playerState === Player_State.StandUp) {
            this.complacentButtonNode.active = false;
        } else {
            if (this.other.playerState === Player_State.StandUp) {
                this.complacentButtonNode.active = true;
            } else {
                this.complacentButtonNode.active = false;
            }
        }
        this.hitButtonNode.active = false;
        this.isPlayerStandUp = true;
        this.curStandUpTime = 0;
    },
    sitDownEvent() {
        var msg = {
            action: GLB.SIT_DOWN
        };
        Game.GameManager.sendEventEx(msg);
    },
    sitDown() {
        this.isPlayerStandUp = false;
        this.hitButtonNode.active = true;
        this.complacentButtonNode.active = false;
    },
    hitEvent() {
        if (Game.GameManager.gameState !== GameState.Play) {
            return;
        }
        if (this.isPersonAppear) {
            var msg = {
                action: GLB.STAND_UP
            };
        } else {
            var msg = {
                action: GLB.PLAYER_HIT
            };
        }
        Game.GameManager.sendEventEx(msg);
    },
    hit() {
        cc.audioEngine.play(this.hitAudio, false, 1);
    },
    complacentEvent() {
        if (Game.GameManager.gameState !== GameState.Play) {
            return;
        }
        var msg = {
            action: GLB.COMPLACENT
        };
        Game.GameManager.sendEventEx(msg);
    },
    complacent() {
        if (this.laughId) {
            var state = cc.audioEngine.getState(this.laughId);
            if (state === cc.audioEngine.AudioState.PLAYING) {
                return;
            }
        }
        this.laughId = cc.audioEngine.play(this.laughAudio, false, 1);
    },

    randomAppearRole() {
        var num = Math.random();
        var role = null;
        if (num < 0.25) {
            role = Appear_Role.Besom;
        } else if (num < 0.5 && num >= 0.25) {
            role = Appear_Role.Brother;
        } else if (num < 0.75 && num >= 0.5) {
            role = Appear_Role.Door;
        } else {
            role = Appear_Role.Teacher;
        }
        if (role === Appear_Role.Brother || role === Appear_Role.Teacher) {
            if (role === this.curAppearRole) {
                this.randomAppearRole();
                return;
            }
        }
        this.curAppearRole = role;
        return role;
    },
    randomNumBoth(Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        var num = Min + Math.round(Rand * Range); //四舍五入
        return num;
    },
    appearRole() {
        this.action = null;
        var role = this.randomAppearRole();
        if (role === Appear_Role.Besom) {
            this.action = GLB.APPEAR_BESOM;
        } else if (role === Appear_Role.Brother) {
            this.action = GLB.APPEAR_BROTHER;
        } else if (role === Appear_Role.Teacher) {
            this.action = GLB.APPEAR_TEACHER;
        } else if (role === Appear_Role.Door) {
            this.action = GLB.HALF_OPEN_DOOR;
        }
        var msg = {
            action: this.action
        };
        Game.GameManager.sendEventEx(msg);
    },
    appearBesom() {
        this.isNeedTiming = false;
        this.besomNode.active = true;
        this.besomAnim.play(this.besomAnimName);
        setTimeout(function() {
            this.besomNode.active = false;
        }.bind(this), 1000);
    },
    appearBrother() {
        this.isNeedTiming = false;
        var anim = this.brotherAnim.play(this.brotherAnimName);
        anim.wrapMode = cc.WrapMode.Normal;
        this.brotherAudio.play();
        setTimeout(function() {
            this.isPersonAppear = false;
            var anim = this.brotherAnim.play(this.brotherAnimName);
            anim.wrapMode = cc.WrapMode.Reverse;
        }.bind(this), 2000)
    },
    halfOpenDoor() {
        this.isNeedTiming = false;
        this.teacherAnim.play(this.halfDoorAnimName);
        setTimeout(function() {
            if (Game.GameManager.gameState !== GameState.Over) {
                cc.audioEngine.play(this.closeDoorSmall, false, 1);
            }
        }.bind(this), 1500);
    },
    appearTeacher() {
        this.isNeedTiming = false;
        this.teacherAnim.play(this.openDoorAnimName);
        setTimeout(function() {
            if (Game.GameManager.gameState !== GameState.Over) {
                this.isPersonAppear = false;
                this.teacherAnim.play(this.closeDoorAnimName);
                cc.audioEngine.play(this.closeDoorAll, false, 1);
            }
        }.bind(this), 4000);
        setTimeout(function() {
            this.teacherAudio.play();
        }.bind(this), 2000);
    },
    update(dt) {
        if (GLB.isRoomOwner && Game.GameManager.gameState === GameState.Play) {
            if (this.isPlayerStandUp) {
                if (this.curStandUpTime >= this.totalStandUpTime) {
                    // this.isPlayerStandUp = false;
                    this.sitDownEvent();
                } else {
                    this.curStandUpTime += dt;
                }
            } else {
                // if (!this.isNeedTiming) return;
                if (this.curInterval >= this.totalInterval) {
                    this.curInterval = 0;
                    this.totalInterval = this.randomNumBoth(4, 6);
                    this.appearRole();
                    if (this.action === GLB.APPEAR_TEACHER) {
                        this.totalInterval += 3;
                    }
                } else {
                    this.curInterval += dt;
                }
            }

        }
    },

    onDestroy() {

        this.brotherAnim.off('finished', this.roleAlreadyAppear, this);
        this.teacherAnim.off('finished', this.roleAlreadyAppear, this);
        this.besomAnim.off('finished', this.roleAlreadyAppear, this);
        clientEvent.off(clientEvent.eventType.appearBesom, this.appearBesom, this);
        clientEvent.off(clientEvent.eventType.appearBrother, this.appearBrother, this);
        clientEvent.off(clientEvent.eventType.appearTeacher, this.appearTeacher, this);
        clientEvent.off(clientEvent.eventType.halfOpenDoor, this.halfOpenDoor, this);
        clientEvent.off(clientEvent.eventType.standUpEvent, this.standUpEvent, this);
        clientEvent.off(clientEvent.eventType.sitDown, this.sitDown, this);
        clientEvent.off(clientEvent.eventType.showAddRedNum, this.showAddRedNum, this);
        clientEvent.off(clientEvent.eventType.showReduceRedNum, this.showReduceRedNum, this);
        clientEvent.off(clientEvent.eventType.showBlueAddNum, this.showBlueAddNum, this);
        clientEvent.off(clientEvent.eventType.showReduceBlueNum, this.showReduceBlueNum, this);
        clientEvent.off(clientEvent.eventType.hitEvent, this.hit, this);
        clientEvent.off(clientEvent.eventType.complacentEvent, this.complacent, this);
        clientEvent.off(clientEvent.eventType.gameOver, this.gameOver, this);
        clientEvent.off(clientEvent.eventType.roundStart, this.roundStart, this);
        clientEvent.off(clientEvent.eventType.leaveRoomNotify, this.leaveRoom, this);
        clientEvent.off(clientEvent.eventType.leaveRoomMedNotify, this.leaveRoom, this);

    }

});
