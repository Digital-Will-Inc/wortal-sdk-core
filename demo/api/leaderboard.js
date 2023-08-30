function leaderboardGetLeaderboardAsync() {
    Wortal.leaderboard.getLeaderboardAsync("global")
        .then(result => appendText(JSON.stringify(result)))
        .catch(error => appendText(error));
}

function leaderboardSendEntryAsync() {
    Wortal.leaderboard.sendEntryAsync("global", 100)
        .then(result => appendText(JSON.stringify(result)))
        .catch(error => appendText(error));
}

function leaderboardGetEntriesAsync() {
    Wortal.leaderboard.getEntriesAsync("global", 10)
        .then(result => appendText(JSON.stringify(result)))
        .catch(error => appendText(error));
}

function leaderboardGetPlayerEntryAsync() {
    Wortal.leaderboard.getPlayerEntryAsync("global")
        .then(result => appendText(JSON.stringify(result)))
        .catch(error => appendText(error));
}

function leaderboardGetEntryCountAsync() {
    Wortal.leaderboard.getEntryCountAsync("global")
        .then(result => appendText(JSON.stringify(result)))
        .catch(error => appendText(error));
}

function leaderboardGetConnectedPlayersEntriesAsync() {
    Wortal.leaderboard.getConnectedPlayersEntriesAsync("global", 10)
        .then(result => appendText(JSON.stringify(result)))
        .catch(error => appendText(error));
}
