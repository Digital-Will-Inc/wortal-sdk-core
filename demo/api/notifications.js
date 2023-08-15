let id = "";

function notificationsScheduleAsync() {
    Wortal.notifications.scheduleAsync("Test", "Test", 1)
        .then(result => appendText(JSON.stringify(result)))
        .catch(error => appendText(error));
}

function notificationsGetHistoryAsync() {
    Wortal.notifications.getHistoryAsync()
        .then(result => {
            appendText(JSON.stringify(result));
            if (result.length > 0) {
                id = result[0].id;
            }
        })
        .catch(error => appendText(error));
}

function notificationsCancelAsync() {
    Wortal.notifications.cancelAsync(id)
        .then(result => appendText(JSON.stringify(result)))
        .catch(error => appendText(error));
}

function notificationsCancelAllAsync() {
    Wortal.notifications.cancelAllAsync()
        .then(result => appendText(JSON.stringify(result)))
        .catch(error => appendText(error));
}
