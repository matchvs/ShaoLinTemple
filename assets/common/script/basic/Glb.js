var obj = {
    RANDOM_MATCH: 1,  // 随机匹配
    PROPERTY_MATCH: 2,  // 属性匹配
    MAX_PLAYER_COUNT: 2,
    PLAYER_COUNTS: [2],
    COOPERATION: 1,
    COMPETITION: 2,
    GAME_START_EVENT: "gameStart",
    GAME_TIME: "gameTime",
    GAME_OVER_EVENT: "gameOver",
    ROUND_START: "roundStart",
    READY: "ready",
    channel: 'MatchVS',
    platform: 'alpha',
    IP: "wxrank.matchvs.com",
    PORT: "3010",

    gameId: 201365,
    gameVersion: 1,
    appKey: '948a134e98284ebaa99b111924abca3b',
    secret: '52f41bf1607946c0a5697cdd983f0b00',

    gameType: 2,
    matchType: 1,
    tagsInfo: { "title": "A" },
    userInfo: null,
    playerUserIds: [],
    playerSet: new Set(),
    isRoomOwner: false,
    events: {},

    syncFrame: false,
    FRAME_RATE: 20,
    roomId: 0,
    playertime: 180,
    isGameOver: false,
    PLAYER_HIT: 'playerHit',
    APPEAR_BESOM: 'appearBesom',
    APPEAR_BROTHER: 'appearBrother',
    APPEAR_TEACHER: ' appearTeacher',
    HALF_OPEN_DOOR: 'halfOpenDoor',
    STAND_UP: 'standUp',
    COMPLACENT: 'complacent',
    SIT_DOWN: 'sitDown'
};
module.exports = obj;