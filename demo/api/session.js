function sessionGetEntryPointData() {
    const entryPointData = Wortal.session.getEntryPointData();
    appendText(entryPointData);
}

function sessionGetEntryPointAsync() {
    Wortal.session.getEntryPointAsync()
        .then(result => appendText(JSON.stringify(result)))
        .catch(error => appendText(error));
}

function sessionSetSessionData() {
    Wortal.session.setSessionData({test: "test"});
}

function sessionGetLocale() {
    const locale = Wortal.session.getLocale();
    appendText(locale);
}

function sessionGetPlatform() {
    const platform = Wortal.session.getPlatform();
    appendText(platform);
}

function sessionGetTrafficSource() {
    const trafficSource = Wortal.session.getTrafficSource();
    appendText(trafficSource);
}

function sessionGetDevice() {
    const device = Wortal.session.getDevice();
    appendText(device);
}

function sessionGetOrientation() {
    const orientation = Wortal.session.getOrientation();
    appendText(orientation);
}

function sessionOnOrientationChange() {
    Wortal.session.onOrientationChange((orientation) => {
        appendText(orientation);
    });
}
