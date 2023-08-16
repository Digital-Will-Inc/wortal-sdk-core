const mainGrid = document.getElementById('main-grid');
const secondaryGrids = document.querySelectorAll('.secondary-grid');
const textOutput = document.getElementById('text-output');
const backButton = document.querySelectorAll('.back-button');

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

backButton.forEach(button => {
    button.addEventListener('click', () => {
        mainGrid.style.display = 'grid';
        hideAllSecondaryGrids();
    });
});

setTimeout(() => {
    coreSetLoadingProgress();
}, 2000);
