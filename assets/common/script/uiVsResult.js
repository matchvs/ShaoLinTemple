var uiPanel = require("uiPanel");
var mvs = require("Matchvs");
var GLB = require("Glb");
cc.Class({
    extends: uiPanel,

    properties: {
        loseClip: {
            default: null,
            url: cc.AudioClip
        },
        victoryClip: {
            default: null,
            url: cc.AudioClip
        }
    },

    start() {
        this.player = this.nodeDict["player"].getComponent("resultPlayerIcon");
        this.player.setData(GLB.playerUserIds[0]);
        this.rival = this.nodeDict["rival"].getComponent("resultPlayerIcon");
        this.rival.setData(GLB.playerUserIds[1]);
        this.nodeDict["vs"].active = false;
        this.nodeDict["score"].active = true;

        var gamePanel = uiFunc.findUI("uiGamePanel");
        if (gamePanel) {
            var gamePanelScript = gamePanel.getComponent("uiGamePanel");
            this.selfScore = gamePanelScript.selfScore;
            this.otherScore = gamePanelScript.otherScore;
        }
        if (this.selfScore >= this.otherScore) {
            this.nodeDict["lose"].active = false;
            this.nodeDict["win"].active = true;
        } else {
            this.nodeDict["lose"].active = true;
            this.nodeDict["win"].active = false;
        }
        var isWin = this.selfScore >= this.otherScore;
        if (isWin) {
            cc.audioEngine.play(this.victoryClip, false, 1);
        } else {
            cc.audioEngine.play(this.loseClip, false, 1);
        }

        this.nodeDict["playerScore"].getComponent(cc.Label).string = this.selfScore;
        this.nodeDict["rivalScore"].getComponent(cc.Label).string = this.otherScore;

        this.nodeDict["quit"].on("click", this.quit, this);

        if (isWin) {
            // 发送胜局记录--
            Game.GameManager.loginServer();
        }
    },

    quit: function() {
        mvs.engine.leaveRoom("");
        var gamePanel = uiFunc.findUI("uiGamePanel");
        if (gamePanel) {
            gamePanel.destroy();
            uiFunc.closeUI("uiGamePanel");
        }
        uiFunc.closeUI(this.node.name);
        this.node.destroy();


        Game.GameManager.lobbyShow();
    }
});
