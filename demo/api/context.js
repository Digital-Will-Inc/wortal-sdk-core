let contextID = "";

function contextGetId() {
    const id = Wortal.context.getId();
    appendText(`getId: ${id}`);
}

function contextGetType() {
    const type = Wortal.context.getType();
    appendText(`getType: ${type}`);
}

function contextGetPlayersAsync() {
    Wortal.context.getPlayersAsync((players) => {
        appendText(`getPlayersAsync: ${players}`);
    });
}

function contextInviteAsync() {
    Wortal.context.inviteAsync({
        image: payloadImage,
        text: 'Invite text',
        cta: 'Play',
        data: {exampleData: 'yourData'},
    }).then(() => appendText("Invite sent!"))
        .catch(error => appendText(error));
}

function contextShareAsync() {
    Wortal.context.shareAsync({
        image: payloadImage,
        text: 'Share text',
        cta: 'Play',
        data: {exampleData: 'yourData'},
    }).then(result => appendText(result))
        .catch(error => appendText(error));
}

function contextShareLinkAsync() {
    Wortal.context.shareLinkAsync({
        image: payloadImage,
        text: 'Share text',
        data: {exampleData: 'yourData'},
    }).then(() => appendText("Link shared!"))
        .catch(error => appendText(error));
}

function contextUpdateAsync() {
    Wortal.context.updateAsync({
        image: payloadImage,
        text: 'Update text',
        cta: 'Play',
        data: { exampleData: 'yourData' },
    }).then(() => appendText("Updated!"))
        .catch(error => appendText(error));
}

function contextChooseAsync() {
    Wortal.context.chooseAsync()
        .then(() => appendText(Wortal.context.getId()))
        .catch(error => appendText(error));
}

function contextSwitchAsync() {
    Wortal.context.switchAsync(contextID)
        .then(() => appendText(Wortal.context.getId()))
        .catch(error => appendText(error));
}

function contextCreateAsync() {
    Wortal.context.createAsync('player123')
        .then(() => appendText(Wortal.context.getId()))
        .catch(error => appendText(error));
}

function contextIsSizeBetween() {
    const isSizeBetween = Wortal.context.isSizeBetween(2, 4);
    appendText(`isSizeBetween: ${isSizeBetween}`);
}
