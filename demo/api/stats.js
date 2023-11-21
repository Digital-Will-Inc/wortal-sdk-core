let statsID = "testscore";

function statsGetStatsAsync() {
    Wortal.stats.getStatsAsync(statsID)
        .then(results => {
            appendText(results);
        })
        .catch(error => {
            appendText(error);
        });
}

function statsPostStatsAsync() {
    Wortal.stats.postStatsAsync(statsID, 10)
        .then(() => {
            appendText("Stats posted successfully");
        })
        .catch(error => {
            appendText(error);
        });
}
