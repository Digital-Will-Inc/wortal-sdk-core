function playerGetID() {
    const id = Wortal.player.getID();
    appendText(id);
}

function playerGetName() {
    const name = Wortal.player.getName();
    appendText(name);
}

function playerGetPhoto() {
    const photo = Wortal.player.getPhoto();
    appendText(photo);
}

function playerIsFirstPlay() {
    const isFirstPlay = Wortal.player.isFirstPlay();
    appendText(isFirstPlay);
}

function playerGetDataAsync() {
    Wortal.player.getDataAsync(["test"])
        .then(result => appendText(JSON.stringify(result)))
        .catch(error => appendText(error));
}

function playerSetDataAsync() {
    Wortal.player.setDataAsync({test: "test"})
        .then("Data set")
        .catch(error => appendText(error));
}

function playerFlushDataAsync() {
    Wortal.player.flushDataAsync()
        .then("Data flushed")
        .catch(error => appendText(error));
}

function playerGetConnectedPlayersAsync() {
    Wortal.player.getConnectedPlayersAsync()
        .then(result => {
            appendText("Connected players: " + result.length);
            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    appendText(`Player ${i}: ${result[i].name}`);
                }
            }
        })
        .catch(error => appendText(error));
}

function playerGetSignedPlayerInfoAsync() {
    Wortal.player.getSignedPlayerInfoAsync()
        .then(result => appendText(JSON.stringify(result)))
        .catch(error => appendText(error));
}

function playerGetASIDAsync() {
    Wortal.player.getASIDAsync()
        .then(result => appendText(JSON.stringify(result)))
        .catch(error => appendText(error));
}

function playerGetSignedASIDAsync() {
    Wortal.player.getSignedASIDAsync()
        .then(result => appendText(JSON.stringify(result)))
        .catch(error => appendText(error));
}

function playerCanSubscribeBotAsync() {
    Wortal.player.canSubscribeBotAsync()
        .then(result => appendText(JSON.stringify(result)))
        .catch(error => appendText(error));
}

function playerSubscribeBotAsync() {
    Wortal.player.subscribeBotAsync()
        .then("Bot subscribed")
        .catch(error => appendText(error));
}

function playerGetTokenAsync() {
    Wortal.player.getTokenAsync()
        .then(result => appendText(result))
        .catch(error => appendText(error));
}

function playerOnLogin() {
    Wortal.player.onLogin(() => appendText("Login"));
}
