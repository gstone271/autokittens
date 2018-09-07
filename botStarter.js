console.log("Waiting for document")
botAdded = false;
botInterval = 0;
addBot = () => {
    if (window.gamePage && !botAdded) {
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