console.log("Waiting for document")
botAdded = false;
botInterval = 0;
botSave = undefined;
gameSave = undefined;
addBot = () => {
    if (window.gamePage && !botAdded) {
        if (gameSave) {
            console.log("Importing saved game")
            game.saveImportDropboxText(gameSave, () => {})
        }
        if (botSave) {
            console.log("Importing saved bot state")
            localStorage.setItem("autokittens.state", botSave)
        }
        console.log("Adding bot")
        document.body.appendChild(botScript);
        botAdded = true;
    }
    if (botAdded) {
        clearInterval(botInterval);
    }
}
document.body.onload = () => {
    console.log("Waiting for game loaded")
    botInterval = setInterval(addBot, 100);
    addBot();
    var realInitGame = initGame;
    initGame = () => {
        realInitGame();
        addBot();
    }
}