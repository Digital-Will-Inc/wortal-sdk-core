const mainGrid = document.getElementById('main-grid');
const secondaryGrids = document.querySelectorAll('.secondary-grid');
const textOutput = document.getElementById('text-output');
const backButton = document.querySelectorAll('.back-button');
const audioPlayer = document.getElementById("audioPlayer");

function hideAllSecondaryGrids() {
    secondaryGrids.forEach(grid => {
        grid.style.display = 'none';
    });
}

function showGrid(gridId) {
    hideAllSecondaryGrids();
    const gridToShow = document.getElementById(gridId);
    gridToShow.style.display = 'grid';
    mainGrid.style.display = 'none';
}

function appendText(message) {
    console.log(message);

    // On screen log for device testing.
    if (typeof message === 'object') {
        message = JSON.stringify(message);
    }
    const currentText = textOutput.value;
    textOutput.value = currentText + message + '\n';
}

function playAudio() {
    audioPlayer.play();
}

function pauseAudio() {
    audioPlayer.pause();
}

backButton.forEach(button => {
    button.addEventListener('click', () => {
        mainGrid.style.display = 'grid';
        hideAllSecondaryGrids();
    });
});

/*
// This is used when not testing manual initialization.
setTimeout(() => {
    Wortal.setLoadingProgress(100);
}, 2000);
*/

// This is used when testing manual initialization, set the data-manual-init attribute to true on the script tag.
Wortal.initializeAsync()
    .then(() => {
        appendText('Initialized');
        Wortal.setLoadingProgress(100);
        Wortal.startGameAsync()
            .then(() => appendText('Started'))
            .catch(error => appendText(error));
    })
    .catch(error => appendText(error));

window.addEventListener('wortal-sdk-initialized', () => {
    appendText('Wortal SDK initialized event received.');
});
