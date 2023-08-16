////////////////////////////////////
// Grids
////////////////////////////////////
document.getElementById('core').addEventListener('click', () => {
    showGrid('grid-core');
});

document.getElementById('ads').addEventListener('click', () => {
    showGrid('grid-ads');
});

document.getElementById('context').addEventListener('click', () => {
    showGrid('grid-context');
});

document.getElementById('iap').addEventListener('click', () => {
    showGrid('grid-iap');
});

document.getElementById('leaderboard').addEventListener('click', () => {
    showGrid('grid-leaderboard');
});

document.getElementById('notifications').addEventListener('click', () => {
    showGrid('grid-notifications');
});

document.getElementById('player').addEventListener('click', () => {
    showGrid('grid-player');
});

document.getElementById('session').addEventListener('click', () => {
    showGrid('grid-session');
});

document.getElementById('tournament').addEventListener('click', () => {
    showGrid('grid-tournament');
});

////////////////////////////////////
// Ads
////////////////////////////////////
document.getElementById('ads-showInterstitial').addEventListener('click', () => {
    showInterstitial();
});

document.getElementById('ads-showRewarded').addEventListener('click', () => {
    showRewarded();
});

////////////////////////////////////
// Context
////////////////////////////////////
document.getElementById('context-getId').addEventListener('click', () => {
    contextGetId();
});

document.getElementById('context-getType').addEventListener('click', () => {
    contextGetType();
});

document.getElementById('context-getPlayersAsync').addEventListener('click', () => {
    contextGetPlayersAsync();
});

document.getElementById('context-inviteAsync').addEventListener('click', () => {
    contextInviteAsync();
});

document.getElementById('context-shareAsync').addEventListener('click', () => {
    contextShareAsync();
});

document.getElementById('context-shareLinkAsync').addEventListener('click', () => {
    contextShareLinkAsync();
});

document.getElementById('context-updateAsync').addEventListener('click', () => {
    contextUpdateAsync();
});

document.getElementById('context-chooseAsync').addEventListener('click', () => {
    contextChooseAsync();
});

document.getElementById('context-switchAsync').addEventListener('click', () => {
    contextSwitchAsync();
});

document.getElementById('context-createAsync').addEventListener('click', () => {
    contextCreateAsync();
});

document.getElementById('context-isSizeBetween').addEventListener('click', () => {
    contextIsSizeBetween();
});

////////////////////////////////////
// Core
////////////////////////////////////
document.getElementById('core-setLoadingProgress').addEventListener('click', () => {
    coreSetLoadingProgress();
});

document.getElementById('core-onPause').addEventListener('click', () => {
    coreOnPause();
});

document.getElementById('core-performHapticFeedbackAsync').addEventListener('click', () => {
    corePerformHapticFeedbackAsync();
});

document.getElementById('core-getSupportedAPIs').addEventListener('click', () => {
    coreGetSupportedAPIs();
});

////////////////////////////////////
// IAP
////////////////////////////////////
document.getElementById('iap-isEnabled').addEventListener('click', () => {
    iapIsEnabled();
});

document.getElementById('iap-getCatalogAsync').addEventListener('click', () => {
    iapGetCatalogAsync();
});

document.getElementById('iap-getPurchasesAsync').addEventListener('click', () => {
    iapGetPurchasesAsync();
});

document.getElementById('iap-makePurchaseAsync').addEventListener('click', () => {
    iapMakePurchaseAsync();
});

document.getElementById('iap-consumePurchaseAsync').addEventListener('click', () => {
    iapConsumePurchaseAsync();
});

////////////////////////////////////
// Leaderboard
////////////////////////////////////
document.getElementById('leaderboard-getLeaderboardAsync').addEventListener('click', () => {
    leaderboardGetLeaderboardAsync();
});

document.getElementById('leaderboard-sendEntryAsync').addEventListener('click', () => {
    leaderboardSendEntryAsync();
});

document.getElementById('leaderboard-getEntriesAsync').addEventListener('click', () => {
    leaderboardGetEntriesAsync();
});

document.getElementById('leaderboard-getPlayerEntryAsync').addEventListener('click', () => {
    leaderboardGetPlayerEntryAsync();
});

document.getElementById('leaderboard-getEntryCountAsync').addEventListener('click', () => {
    leaderboardGetEntryCountAsync();
});

document.getElementById('leaderboard-getConnectedPlayersEntriesAsync').addEventListener('click', () => {
    leaderboardGetConnectedPlayersEntriesAsync();
});

////////////////////////////////////
// Notifications
////////////////////////////////////
document.getElementById('notifications-scheduleAsync').addEventListener('click', () => {
    notificationsScheduleAsync();
});

document.getElementById('notifications-getHistoryAsync').addEventListener('click', () => {
    notificationsGetHistoryAsync();
});

document.getElementById('notifications-cancelAsync').addEventListener('click', () => {
    notificationsCancelAsync();
});

document.getElementById('notifications-cancelAllAsync').addEventListener('click', () => {
    notificationsCancelAllAsync();
});

////////////////////////////////////
// Player
////////////////////////////////////
document.getElementById('player-getID').addEventListener('click', () => {
    playerGetID();
});

document.getElementById('player-getName').addEventListener('click', () => {
    playerGetName();
});

document.getElementById('player-getPhoto').addEventListener('click', () => {
    playerGetPhoto();
});

document.getElementById('player-isFirstPlay').addEventListener('click', () => {
    playerIsFirstPlay();
});

document.getElementById('player-getDataAsync').addEventListener('click', () => {
    playerGetDataAsync();
});

document.getElementById('player-setDataAsync').addEventListener('click', () => {
    playerSetDataAsync();
});

document.getElementById('player-flushDataAsync').addEventListener('click', () => {
    playerFlushDataAsync();
});

document.getElementById('player-getConnectedPlayersAsync').addEventListener('click', () => {
    playerGetConnectedPlayersAsync();
});

document.getElementById('player-getSignedPlayerInfoAsync').addEventListener('click', () => {
    playerGetSignedPlayerInfoAsync();
});

document.getElementById('player-getASIDAsync').addEventListener('click', () => {
    playerGetASIDAsync();
});

document.getElementById('player-getSignedASIDAsync').addEventListener('click', () => {
    playerGetSignedASIDAsync();
});

document.getElementById('player-canSubscribeBotAsync').addEventListener('click', () => {
    playerCanSubscribeBotAsync();
});

document.getElementById('player-subscribeBotAsync').addEventListener('click', () => {
    playerSubscribeBotAsync();
});

////////////////////////////////////
// Session
////////////////////////////////////
document.getElementById('session-getEntryPointData').addEventListener('click', () => {
    sessionGetEntryPointData();
});

document.getElementById('session-getEntryPointAsync').addEventListener('click', () => {
    sessionGetEntryPointAsync();
});

document.getElementById('session-setSessionData').addEventListener('click', () => {
    sessionSetSessionData();
});

document.getElementById('session-getLocale').addEventListener('click', () => {
    sessionGetLocale();
});

document.getElementById('session-getTrafficSource').addEventListener('click', () => {
    sessionGetTrafficSource();
});

document.getElementById('session-getPlatform').addEventListener('click', () => {
    sessionGetPlatform();
});

document.getElementById('session-getDevice').addEventListener('click', () => {
    sessionGetDevice();
});

////////////////////////////////////
// Tournament
////////////////////////////////////
document.getElementById('tournament-getCurrentAsync').addEventListener('click', () => {
    tournamentGetCurrentAsync();
});

document.getElementById('tournament-getAllAsync').addEventListener('click', () => {
    tournamentGetAllAsync();
});

document.getElementById('tournament-postScoreAsync').addEventListener('click', () => {
    tournamentPostScoreAsync();
});

document.getElementById('tournament-createAsync').addEventListener('click', () => {
    tournamentCreateAsync();
});

document.getElementById('tournament-shareAsync').addEventListener('click', () => {
    tournamentShareAsync();
});

document.getElementById('tournament-joinAsync').addEventListener('click', () => {
    tournamentJoinAsync();
});
