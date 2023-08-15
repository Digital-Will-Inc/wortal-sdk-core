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
    Wortal.player.getDataAsync()
        .then(result => appendText(JSON.stringify(result)))
        .catch(error => appendText(error));
}

function playerSetDataAsync() {
    Wortal.player.setDataAsync({test: "test"})
        .then(result => appendText(JSON.stringify(result)))
        .catch(error => appendText(error));
}

function playerFlushDataAsync() {
    Wortal.player.flushDataAsync()
        .then(result => appendText(JSON.stringify(result)))
        .catch(error => appendText(error));
}

function playerGetConnectedPlayersAsync() {
    Wortal.player.getConnectedPlayersAsync()
        .then(result => appendText(JSON.stringify(result)))
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
        .then(result => appendText(JSON.stringify(result)))
        .catch(error => appendText(error));
}
