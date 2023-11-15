function statsGetStatsAsync() {
    Wortal.stats.getStatsAsync("Level 1")
        .then(results => {
            appendText(results);
        })
        .catch(error => {
            appendText(error);
        });
}

function statsPostStatsAsync() {
    Wortal.stats.postStatsAsync("Level 1", 10)
        .then(() => {
            appendText("Stats posted successfully");
        })
        .catch(error => {
            appendText(error);
        });
}
