let achievementID = "ach";

function achievementsGetAchievementsAsync() {
    Wortal.achievements.getAchievementsAsync()
        .then(achievements => {
            appendText(achievements);
        })
        .catch(error => {
            appendText(error);
        });
}

function achievementsUnlockAchievementAsync() {
    Wortal.achievements.unlockAchievementAsync(achievementID)
        .then(achievement => {
            appendText("Achievement unlocked: " + achievement);
        })
        .catch(error => {
            appendText(error);
        });
}
