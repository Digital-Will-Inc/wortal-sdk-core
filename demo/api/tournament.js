let tournamentID = "";

function tournamentGetCurrentAsync() {
    Wortal.tournament.getCurrentAsync()
        .then(result => appendText(JSON.stringify(result)))
        .catch(error => appendText(error));
}

function tournamentGetAllAsync() {
    Wortal.tournament.getAllAsync()
        .then(result => {
            appendText(JSON.stringify(result));
            if (result.length > 0) {
                id = result[0].id;
            }
        })
        .catch(error => appendText(error));
}

function tournamentPostScoreAsync() {
    Wortal.tournament.postScoreAsync(100)
        .then(() => {
            appendText("Score posted");
        })
        .catch(error => appendText(error));
}

function tournamentCreateAsync() {
    Wortal.tournament.createAsync(100, {title: "test tournament"}, {level: 1})
        .then(result => {
            console.log(result);
            appendText(JSON.stringify(result));
            appendText(result.payload["level"]);
        })
        .catch(error => appendText(error));
}

function tournamentShareAsync() {
    Wortal.tournament.shareAsync({score: 100, data: { myReplayData: 'data' } })
        .then(result => appendText(JSON.stringify(result)))
        .catch(error => appendText(error));
}

function tournamentJoinAsync() {
    appendText(Wortal.context.getId());
    Wortal.tournament.joinAsync(tournamentID)
        .then(() => {
            appendText(Wortal.context.getId());
        })
        .catch(error => appendText(error));
}
