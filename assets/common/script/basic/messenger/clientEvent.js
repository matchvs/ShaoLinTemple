window.clientEvent = {
    eventType: {
        openUI: "openUI",
        closeUI: "closeUI",
        gameStart: "gameStart",
        gameOver: "gameOver",
        roundStart: "roundStart",
        time: "time",
        score: "score",

        playerAccountGet: "playerAccountGet",
        initResponse: "initResponse",
        errorResponse: "errorResponse",
        joinRoomResponse: "joinRoomResponse",
        joinRoomNotify: "joinRoomNotify",
        leaveRoomResponse: "leaveRoomResponse",
        leaveRoomNotify: "leaveRoomNotify",
        joinOverResponse: "joinOverResponse",
        createRoomResponse: "createRoomResponse",
        getRoomListResponse: "getRoomListResponse",
        getRoomDetailResponse: "getRoomDetailResponse",
        getRoomListExResponse: "getRoomListExResponse",
        kickPlayerResponse: "kickPlayerResponse",
        kickPlayerNotify: "kickPlayerNotify",
        hitEvent: "hitEvent",
        appearBesom: "appearBesom",
        appearBrother: "appearBrother",
        appearTeacher: "appearTeacher",
        halfOpenDoor: "halfOpenDoor",
        standUpEvent: "standUpEvent",
        standUpEventMed: "standUpEventMed",
        complacentEvent: 'complacentEvent',
        sitDown: 'sitDown',
        showAddRedNum: 'showAddRedNum',
        showReduceRedNum: 'showReduceRedNum',
        showBlueAddNum: 'showBlueAddNum',
        showReduceBlueNum: 'showReduceBlueNum'
    },
    eventListener: null
}

clientEvent.init = function() {
    clientEvent.eventListener = eventListener.create();
};

clientEvent.on = function(eventName, handler, target) {
    if (typeof eventName !== "string") {
        return;
    }
    clientEvent.eventListener.on(eventName, handler, target);
};

clientEvent.off = function(eventName, handler, target) {
    if (typeof eventName !== "string") {
        return;
    }
    clientEvent.eventListener.off(eventName, handler, target);
};

clientEvent.clear = function(target) {
    clientEvent.eventListener.clear(target);
};

clientEvent.dispatch = function(eventName, data) {
    if (typeof eventName !== "string") {
        return;
    }
    clientEvent.eventListener.dispatch(eventName, data);
};