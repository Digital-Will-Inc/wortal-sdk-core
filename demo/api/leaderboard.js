function leaderboardGetLeaderboardAsync() {
    Wortal.leaderboard.getLeaderboardAsync()
        .then(result => appendText(JSON.stringify(result)))
        .catch(error => appendText(error));
}

function leaderboardSendEntryAsync() {
    Wortal.leaderboard.sendEntryAsync(100)
        .then(result => appendText(JSON.stringify(result)))
        .catch(error => appendText(error));
}

function leaderboardGetEntriesAsync() {
    Wortal.leaderboard.getEntriesAsync()
        .then(result => appendText(JSON.stringify(result)))
        .catch(error => appendText(error));
}

function leaderboardGetPlayerEntryAsync() {
    Wortal.leaderboard.getPlayerEntryAsync()
        .then(result => appendText(JSON.stringify(result)))
        .catch(error => appendText(error));
}

function leaderboardGetEntryCountAsync() {
    Wortal.leaderboard.getEntryCountAsync()
        .then(result => appendText(JSON.stringify(result)))
        .catch(error => appendText(error));
}

function leaderboardGetConnectedPlayersEntriesAsync() {
    Wortal.leaderboard.getConnectedPlayersEntriesAsync()
        .then(result => appendText(JSON.stringify(result)))
        .catch(error => appendText(error));
}
