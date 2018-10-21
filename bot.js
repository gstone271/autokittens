//Paste the contents of this file directly into the developer console
$("#botHelp").remove()
$('#helpDiv').prepend($(`<div id="botHelp">
<h2>Simba by Griffin Stone</h2>
<p>This program adds queueing buttons to the left of tasks you can automate, settings in the upper right, and queue information in the lower right.</p>
<p>Left click to increase a value, right click to decrease a value.</p>
<p>Queueing buttons are displayed as a 0, 1, or ∞ to the left of a button. <ul>
    <li>0: Don't buy this item.</li>
    <li>1: Put this item in the queue. When you have enough resources to buy it, and nothing higher in the queue needs those resources, buy it and put it at the bottom of the queue</li>
    <li>∞: As 1, but always move this item to the top of the queue (buy as many as possible).</li>
</ul></p>
<p>Settings: <ul>
    <li>Bot: Turns all bot functions on/off</li>
    <li>Game Speed: Can increase the speed of all game progress (even when the bot is off)</li>
    <li>Bot Speed: Controls how frequently the bot runs (per game tick)</li>
    <li>Bot Timer: <ul>
        <li>game: Run the bot in the game loop. Guarantees the bot will not lag behind the game, but may cause the game to lag. Very useful if using Web Worker.</li>
        <li>independent: Run the bot on a timer independent of the game loop.</li>
    </ul></li>
    <li>Timeskip bug: There is a bug in the game that causes time, but not the calendar, to move faster whenever you click a building. This causes the calendar to not be an accurate indicator of how much time has passed, and the bot to fall behind the game. Change to "fixed" to prevent time skipping.</li>
    <li>API: Increase to use more of the game API to improve performance and add features like trade log combining. Decrease to instead use the actual buttons in the game interface.</li>
    <li>Up Next: Controls the amount of information displayed in the Up Next panel.
        <br />In Verbose mode, enqueued items you have enough storage to buy are displayed, followed by the estimated time until it is bought and the resources you need more of to buy them. In Concise, the time and resources are not displayed.
        <br />If one of the needed resources is reserved by an item higher in the queue, this item is grayed out. In Concise, it is hidden instead.
    </li>
    <li>Master Plan: Try to move upwards through the tech tree automatically.<ul>
        <li>off: Don't queue anything you haven't asked for. Recommended to still have an idle game experience, but with less management.</li>
        <li>naive: Automatically enqueue technologies and upgrades that aren't useless or dangerous once the time to produce them is less than 15 minutes. Not recommended if you're actively managing the bot (and can make better decisions).</li>
    </ul></li>
    <li>Smart Storage: Don't buy storage (barn, warehouse, harbour) you don't need.<ul>
        <li>off: Buy storage as normal. The bot may buy too much storage, especially warehouses.</li>
        <li>aggressive: Only buy storage if you don't have enough to buy a queued upgrade or normal building (aqueduct, log house, library, mine, smelter, or workshop). Recommended in the early game.</li>
        <li>conservative: Only buy storage if you don't have enough to buy any of your queued normal buildings. Recommended in the mid and late game.</li>
    </ul></li>
    <li>Auto Craft: Automatically craft resouces that are near their max storage capacity. The bot won't attempt to buy buildings whose cost is so near your storage capacity that a needed resouce would be auto crafted.<ul>
        <li>off: Don't auto craft.</li>
        <li>normal: Craft resources that would be full by the time the bot plans to run again.</li>
        <li>safe: As normal, but assume twice as much time will pass before the bot runs. Useful at high game speeds, high bot speeds, or if the game is laggy. Consider using this mode if you see "Warning: [resource] full" messages in the console.</li>
    </ul></li>
    <li>Auto Farmer: Calculates the amount of catnip you need stockpiled today to survive a regular winter. Unlike the food advisor, this factors in the amount of catnip you're expected to produce before winter, making it more accurate and less overcautious.<ul>
        <li>off: Don't automatically switch kittens to farmers. The bot won't buy buildings or housing that would reduce your catnip below the needed catnip stockpile for a cold winter. You can starve if you have two cold seasons in the same year.</li>
        <li>on: Automatically switch a kitten to Farmer (from the most common job) if your catnip stockpile is not enough to survive winter. The bot will buy housing, but not buildings, that would reduce your catnip below the needed catnip stockpile for a cold winter. Also, gather the first 10 catnip of the game.</li>
    </ul></li>
    <li>Farmer ratio: Calculates the ratio of wood per farmer to wood per woodcutter. If this ratio is greater than one, you should switch all your woodcutters to farmers.</li>
    <li>Auto Converters: When on, automatically turns off any conversion buildings (eg. smelter) if all of the conversion products are full and nothing in the queue needs the resources you can craft from them. The disabled buildings will be listed below, and won't be purchased.</li>
    <li>Auto SETI: When on, automatically observe the sky. Doesn't work during redshift; if you have offline progression enabled, consider buying SETI to get more starcharts.</li>
</ul>If one setting is being overridden by another, its effective value will be displayed in parentheses. For example, Bot Speed currently cannot be faster than 1/Game Speed, unless Bot Timer is set to game.</p>
<p>Special buttons: These queueing buttons look normal but have a special effect when enabled, and may not actually use the queue.<ul>
    <li>Send Hunters: Send hunters whenever your catpower is full or you have nothing else in the queue which needs catpower</li>
    <li>Steel (in Workshop): Always make as much steel as possible (to prevent wasting coal, even if your queue needs more iron than coal)</li>
    <li>Transcend: Wait for faith to be full, then click Transcend once, then click Faith Reset, then Praise the Sun.</li>
    <li>Jobs: In the Jobs panel, left click a job to add it to the job queue; right click to remove. Whenever the bot buys housing, it will assign the new kitten to next job in the queue, then send that job to the end of the queue. The bot will not assign new kittens when you buy housing manually.</li>
</ul></p>
<p>Leaders: It is recommended that you make an Artisan your leader. For all tasks except crafting, if you already have a leader, the bot will automatically switch to a leader of the appropriate type. If API is set to none, a leader of the appropriate type must appear on the first page of kittens (you may need to promote one).</p>
<p>Trade: Sending trade caravans is queued like buildings. <ul>
    <li>When a trade is bought from the queue, it sends as many caravans as possible without spending a resource reserved for something higher in the queue.</li>
    <li>If your gold is near full, the bot will prioritize trades over other queued items (but not priority infinity items).</li>
    <li>The bot will not make trades for resources that you have a lot of already, unless you enable ignoreNeeds.</li>
    <li>It will only trade during optimal seasons, unless you enable ignoreSeasons.</li>
</ul>Next to tradeable resources, the bot will display the amount of time it would take one no-skill kitten to produce that much resource (in cats*ticks), or if kittens can't produce it, the amount of time it would take all your production to produce it (in ticks).</p>
<p>Auto Faith Reset: In the Order of the Sun panel, you can set Auto Reset to a percentage. When your base faith bonus (before Black Obelisk and Atheism bonuses) reaches this percentage, Simba will automatically store maximum faith, then reset praised faith (with apocrypha), then praise the sun.</p>
<p>Compatibility: Simba requires a modern browser (with HTML5 and ES6) and is currently only compatible with the English version of the game.</p>
<hr />
<h3>Kittens Game Official "Help"</h3>
</div>`))
$('#helpDiv').css({"margin-top": "0", top: "10%", overflow: "auto", "max-height": "75%"});
$("#botInfo").remove()
$('#gamePageContainer').append($('<div id="botInfo" style="position: absolute; bottom: 50px; right: 10px;">'))
updateBotInfoWidth = () => $("#botInfo").css("max-width", Math.max(225, $("#game").width() - $("#rightColumn")[0].getBoundingClientRect().right - 20));
updateBotInfoWidth();
$(window).resize(updateBotInfoWidth);
if (window.stopLoop) stopLoop();

/************** 
 * Utilities
**************/
flattenArr = arr => arr.reduce((acc, val) => acc.concat(val), []); //from Mozilla docs
getOwnText = el => { //https://stackoverflow.com/a/21249659/1914005
    return $(el).contents().map(function () {
        return this.nodeType == 3 && $.trim(this.nodeValue) ? $.trim(this.nodeValue) : undefined;
    }).get().join('')
}
arrayToObject = (array, keyField) => {//https://medium.com/dailyjs/rewriting-javascript-converting-an-array-of-objects-to-an-object-ec579cafbfc7
   return array.reduce((obj, item) => {
     obj[item[keyField]] = item
     return obj
   }, {})
}
maxBy = (arr, fun) => {
    var maxValue = Math.max(...arr.map(fun));
    //we could reduce the number of iterations by one but it doesn't matter
    return arr.find(item => fun(item) === maxValue);
}
Object.fromEntries = Object.fromEntries || function(arr) {
    var result = {};
    arr.forEach(entry => {
        result[entry[0]] = entry[1];
    })
    return result;
}
removeOne = (arr, match) => {
    var found = false;
    return arr.filter(item => {
        if (item === match && !found) {
            found = true;
            return false;
        } else {
            return true;
        }
    });
}

/************** 
 * Logging
**************/
log = (msg, quiet) => { console.log(msg); if (!quiet) game.msg(msg); }
addLog = item => {
    item.year = game.calendar.year;
    var roundedDay = Math.round(game.calendar.day * 100) / 100
    item.day = roundedDay + 100 * game.calendar.season;
    state.history.push(item);
}
logBuy = (bld, numBought) => addLog({ name: bld.name, type: "Buy", buy: bld, num: numBought});
logKitten = (numKittens, job) => addLog({ name: numKittens + " Kittens", type: "Kitten", kittens: numKittens, job: job});
logFaith = () => {
    var totalFaith = game.religion.faith;
    addLog({ name: game.getDisplayValueExt(totalFaith) + " Faith", type: "Faith", faith: totalFaith});
}
logTrades = () => {
    var totalTrades = state.totalTrades;
    addLog({ name: game.getDisplayValueExt(totalTrades) + " Trades", type: "Trades", trades: totalTrades});
}
logReset = () => addLog({ name: "Reset", type: "Reset", kittens: game.village.sim.getKittens()});
rotateLogs = () => {
    state.previousHistories.push(state.history);
    state.history = [];
    //compress previous histories in advance so that saving doesn't need too much CPU
    state.previousHistoriesCompressed = LZString.compressToBase64(JSON.stringify(state.previousHistories));
}
if (!game.realResetAutomatic) game.realResetAutomatic = game.resetAutomatic;
game.resetAutomatic = () => {
    logFaith();
    logReset();
    rotateLogs();
    state.queue = []; //todo reload master plan
    state.jobQueue = [];
    state.numKittens = 0;
    state.kittensAssigned = 0;
    state.populationIncrease = 0;
    state.autoHunt = false;
    state.autoSteel = false;
    if (window.usingBotStarter) {
        //based on resetAutomatic code
		game.timer.scheduleEvent(dojo.hitch(this, function() {
            game._resetInternal();
            game.mobileSaveOnPause = false;
            console.log("Reloading parent page")
            window.parent.location.reload();
        }));
    } else {
        game.realResetAutomatic();
    }
}
recountKittens = (newJob) => {
    var kittens = game.village.sim.getKittens();
    if (state.populationIncrease > 0) {
        state.populationIncrease--;
        state.kittensAssigned++;
    }
    if (state.populationIncrease === 0) {
        state.kittensAssigned = kittens;
    }
    if (kittens > state.numKittens) {
        state.numKittens = kittens;
        logKitten(kittens, newJob)
    }
}
getBestResetPoint = (history, onlyLocalMaxima) =>
    history
        .filter(entry => entry.type === "Kitten" || entry.type === "Reset")
        .map(entry => ({paragon: Math.max(0, entry.kittens - 70), year: entry.year + entry.day / 400}))
        .filter(entry => entry.year > 0) //prevent Infinity and NaN with cryochambers
        .map(entry => ({paragon: entry.paragon, year: entry.year, ratio: entry.paragon / entry.year}))
		.filter((point, index, arr) => !onlyLocalMaxima || point.ratio > 0 && [arr[index - 1], arr[index + 1]].every(neighbor => !neighbor || point.ratio >= neighbor.ratio))
        .sort((a, b) => b.ratio - a.ratio)

/************** 
 * Save/Load
**************/
save = () => { localStorage.setItem("simba.state", exportSave()); console.log("Bot state saved"); }
loadString = string => {
    var parsed = JSON.parse(LZString.decompressFromBase64(string));
    var rawQueue = parsed.queue;
    parsed.queue = [];
    if (parsed.previousHistoriesCompressed) { parsed.previousHistories = JSON.parse(LZString.decompressFromBase64(parsed.previousHistoriesCompressed)); }
    state = parsed;
    reloadQueue(rawQueue);
}
exportSave = () => {
    var savedState = Object.assign({}, state);
    delete(savedState.previousHistories); //use previousHistoriesCompressed instead to save CPU
    return LZString.compressToBase64(JSON.stringify(savedState));
}
importSave = saveString => {
    loadString(saveString);
    loadDefaults();
    initialize();
}
reloadQueue = queue => {
    state.queue = [];
    queue.forEach(item => enable(item.name, item.tab, item.panel, item.maxPriority, item.masterPlan));
}
load = () => {
    var data = localStorage.getItem("simba.state");
    var removeOldSave = false;
    if (!data) {
      data = localStorage.getItem("autokittens.state");
      if (data) {
        removeOldSave = true;
      }
    }
    if (data) {
        loadString(data);
    }
    loadDefaults();
    initialize();
    if (removeOldSave) {
      localStorage.removeItem("autokittens.state");
    }
}
loadDefaults = () => {
    if (!window.state) state = {};
    if (!window.botDebug) botDebug = {};
    falseyDefaults = {
        jobQueue: [],
        populationIncrease: 0,
        tradeTimer: 0,
        speed: 1,
        desiredTicksPerLoop: 8,
        queue: [],
        ticks: game.ticks,
        history: [],
        previousHistories: [],
        numKittens: game.village.sim.getKittens(),
        kittensAssigned: game.village.sim.getKittens(),
        leaderAssigned: game.village.leader ? true : false,
        verboseQueue: 0,
        disabledConverters: {},
        tradeMessages: 0,
        tradeResourceTotal: {}, 
        totalTrades: 0,
        lastTradeSeason: 0,
        lastTradeQuantity: 0,
        loopsUntilRun: 0,
        ignoreNeeds: {},
        ignoreSeason: {},
        masterPlanMode: 0,
        smartStorage: 0,
        autoReset: 1000, //should never be 0
    }
    Object.entries(falseyDefaults).forEach(entry => state[entry[0]] = state[entry[0]] || entry[1]);
    if (!state.previousHistoriesCompressed) state.previousHistoriesCompressed = LZString.compressToBase64(JSON.stringify(state.previousHistories));
    undefinedDefaults = {
        desiredApi: 1,
        autoCraftLevel: 1,
        autoFarmer: 1,
        autoSeti: true,
        autoConverters: true,
        runInGameLoop: true,
    }
    Object.entries(undefinedDefaults).forEach(entry => { if (state[entry[0]] === undefined) state[entry[0]] = entry[1] });
}
initialize = () => {
    state.ticks = game.ticks;
    setSpeed(state.speed);
    createSettingsMenu();
}
if (!game.console.realSave) game.console.realSave = game.console.save;
game.console.save = (data) => {
    try {
        save();
    } catch (err) {
        //eg. not enough storage
        //todo warn the user more loudly?
        console.error(err);
    }
    game.console.realSave(data);
}
wipeBotSave = () => localStorage.removeItem("simba.state");
if (!game.real_wipe) game.real_wipe = game._wipe;
game._wipe = () => {
    if (window.usingBotStarter) {
        //based on _wipe code
		game.timer.scheduleEvent(dojo.hitch(this, function() {
            wipeBotSave();
            game.mobileSaveOnPause = false;
            delete(LCstorage["com.nuclearunicorn.kittengame.savedata"]);
            //don't bother wiping the language setting
            console.log("Reloading parent page")
            window.parent.location.reload();
        }));
    } else {
        wipeBotSave();
        game.real_wipe();
    }
}

/************** 
 * Queue Logic
**************/
Reservations = function(initialReserved) {
    this.reserved = Object.fromEntries(Object.entries(initialReserved).map(entry => [entry[0], Object.assign({}, entry[1])]));
}
Object.assign(Reservations.prototype, {
    //reserve current now, plus once you own current, reserve production every tick, until you have total
    get: function(res) { if (!this.reserved[res]) { this.reserved[res] = { current: 0, production: 0, total: 0 }; } return this.reserved[res]; },
    add: function(res, current, production, total) {
        if ([current, production, total].some(isNaN)) throw new Error("Reserving NaN!")
        var reservation = this.get(res);
        reservation.current += current;
        reservation.production += production;
        reservation.total += total;
    },
    addCurrent: function(res, val) { this.add(res, val, 0, val) },
    addOverTime: function(res, val, ticks, productionAvailable) {
        //todo maybe it would be correct to just not include this, and if production is negative, reserve a negative amount of production if appropriate
        if (productionAvailable < 0) productionAvailable = 0;
        var maxOverTime = ticks * productionAvailable;
        var currentNeeded;
        var productionNeeded;
        if (maxOverTime <= 0 || isNaN(maxOverTime)) {
            productionNeeded = 0;
            currentNeeded = val;
        } else if (maxOverTime >= val) {
            productionNeeded = val / ticks;
            currentNeeded = 0;
        } else {
            productionNeeded = productionAvailable;
            currentNeeded = val - maxOverTime;
        }
        this.add(res, currentNeeded, productionNeeded, val);
    },
    clone: function() { return new Reservations(this.reserved) },
});
getTimeToChange = reservations => {
    return Math.ceil(Math.min(...Object.entries(reservations.reserved).map(entry => {
        var resource = entry[0];
        var reservation = entry[1];
        if (reservation.total <= reservation.current) return Infinity;
        return (reservation.total - reservation.current) / reservation.production;
    })))
}
//get what the reservations will be the next time a partial reservation is fulfilled, and how many ticks until this happens
//simulate production of resources by decreasing reservation. assumes that you have enough storage space for both the reservation and whatever you want to buy
getNextFutureReservations = reservations => {
    var timeToChange = getTimeToChange(reservations);
    if (timeToChange === Infinity) {
        return { ticks: Infinity, reserved: reservations };
    } else if (timeToChange <= 0) {
        console.error(reservations);
        throw new Error("Miscalculated time to change: " + timeToChange);
    } else {
        return { ticks: timeToChange, reserved: getFutureReservations(reservations, timeToChange) }
    }
}
getFutureReservations = (reservations, ticksPassed) => {
    return new Reservations(Object.fromEntries(Object.entries(reservations.reserved).map(entry => {
        var resource = entry[0];
        var reservation = entry[1];
        var totalProductionPerTick = reservation.production;
        var totalProduction = totalProductionPerTick * ticksPassed;
        var total = Math.max(0, reservation.total - totalProduction);
        var current = Math.min(reservation.current, total);
        return [resource, { current: current, production: total > current ? reservation.production : 0, total: total }]
    })))
}
var getIngredientsNeeded = price => 
    (canCraft(price.name) ? multiplyPrices(getCraftPrices(price.name), Math.ceil(price.val / getCraftRatio(price.name)) ) : [])
//get the sum of the prices and the prices to craft any missing resources
getEffectivePrices = (prices, reserved) => {
    var totalPricesMap = {};
    var shortages = prices;
    var maxDepth = 10;
    var getShortage = price => ({ name: price.name, 
        val: Math.max(0, price.val - Math.max(0, getResourceOwned(price.name) - reserved.get(price.name).current - (totalPricesMap[price.name] || 0))) 
    })
    while (shortages.length) {
        if (!maxDepth--) {
            //if the game ever lets you craft scaffold back into catnip...
            console.error("Infinite loop finding shortages:")
            console.error(shortages)
            break;
        }
        var nextShortages = flattenArr(shortages.map(getShortage).map(getIngredientsNeeded));
        shortages.forEach(price => totalPricesMap[price.name] = (totalPricesMap[price.name] || 0) + price.val)
        shortages = nextShortages;
    }
    return Object.entries(totalPricesMap).map(price => ({name: price[0], val: price[1]}))
}
getTicksNeeded = (effectivePrices, originalPrices, reserved) => {
    var unaffordablePrices = effectivePrices.filter(price => !canAffordOne(price, reserved));
    return Math.max(0, ...unaffordablePrices
        .filter(price => originalPrices.some(originalPrice => price.name === originalPrice.name))
        .map(price => getTicksToEnough(price, reserved))
    );
}
reserveBufferTime = game.rate * 60 * 5; //5 minutes: reserve enough of non-limiting resources to be this far ahead of the limiting resource
bufferTicksNeeded = ticksNeeded => Math.max(0, ticksNeeded - reserveBufferTime);
canAffordOne = (price, reserved) => price.val <= 0 || getResourceOwned(price.name) - (reserved ? reserved.get(price.name).current : 0) >= price.val;
canAfford = (prices, reserved) => prices.every(price => canAffordOne(price, reserved));
//ticks until you have enough. May be infinite.
getTicksToEnough = (price, reserved, owned, forSteel) => {
    if (owned === undefined) {
        if (price.name === "iron" && state.autoSteel) {
            //this might be negative; that's ok
            owned = getResourceOwned(price.name) - getResourceOwned("coal");
        } else {
            owned = getResourceOwned(price.name);
        }
    }
    if (owned - reserved.get(price.name).current >= price.val) {
        return 0;
    }
    if (getEffectiveResourcePerTick(price.name) === 0) {
        if (canCraft(price.name)) {
            var ingredients = getIngredientsNeeded({name: price.name, val: price.val + reserved.get(price.name).current - owned});
            var ingredientForSteel = state.autoSteel && price.name === "steel";
            if (ingredientForSteel) {
                //autoSteel ignores reservations
                //ugh way too much special case logic for this
                reserved = new Reservations({});
            }
            //more accurate calculation for crafted resources with no production
            //still inaccurate for manuscript once you have printing press, but at least this special case is the common case for crafts
            return Math.max(...ingredients.map(ingredientPrice => getTicksToEnough(ingredientPrice, reserved, getResourceOwned(ingredientPrice.name), ingredientForSteel)))
        } else {
            //just a performance improvement
            return Infinity;
        }
    }
    //maybe optimize this to reduce the total number of calls to getFutureReservations (easily cached)
    var timeToChange = getTimeToChange(reserved);
    var baseProduction = getCraftingResourcePerTick(price.name, reserved, forSteel);
    var freeProduction; //production not reserved at all
    var reservedForShortageProduction; //production reserved for a "current" reservation
    //this seems too complicated, maybe if Reservations was redesigned this would be simpler
    if (reserved.get(price.name).current > owned) {
        //just ignore negative production, it won't last forever. needed to prevent infinite loop
        reservedForShortageProduction = Math.max(0, baseProduction);
        freeProduction = 0;
        timeToChange = Math.min(timeToChange, Math.ceil((reserved.get(price.name).current - owned) / reservedForShortageProduction));
    } else {
        reservedForShortageProduction = 0;
        freeProduction = baseProduction - reserved.get(price.name).production;
    }
    if (freeProduction <= 0) {
        //all production is reserved
        if (timeToChange === Infinity) return Infinity;
        return timeToChange + getTicksToEnough(price, getFutureReservations(reserved, timeToChange), owned + reservedForShortageProduction * timeToChange);
    } else if (freeProduction * timeToChange + owned - reserved.get(price.name).current >= price.val) {
        return Math.ceil((price.val + reserved.get(price.name).current - owned) / freeProduction);
    } else {
        if (timeToChange === Infinity) throw new Error("Infinite price???");
        return timeToChange + getTicksToEnough(price, getFutureReservations(reserved, timeToChange), owned + freeProduction * timeToChange)
    }
}
getResourcesToReserve = (effectivePrices, ticksNeeded, reserved) => {
    var isLimitingResource = price => !canAffordOne(price, reserved) && getTicksToEnough(price, reserved) >= ticksNeeded;

    //this is probably wrong in the case of items costing steel + iron/plate, but atm this is just some upgrades so don't bother
    var needSteel = effectivePrices.some(price => price.name === "steel");
    var newReserved = reserved.clone();
    var limitingResources = {};
    var reserveNonLimiting = price => 
        newReserved.addOverTime(price.name, price.val, ticksNeeded, getCraftingResourcePerTick(price.name, newReserved, needSteel));
    var reserveLimiting = price => {
        newReserved.addCurrent(price.name, price.val);
        limitingResources[price.name] = true;
    }
    effectivePrices.forEach(price => {
        if (isLimitingResource(price)) {
            reserveLimiting(price);
        } else {
            reserveNonLimiting(price);
        }
    })
    return {newReserved: newReserved, limitingResources: Object.keys(limitingResources)};
}
findPriorities = (queue, reserved) => {
    if (queue.length == 0) return [];
    var found = queue[0];
    var prices = found.getPrices();
    if (!found.isEnabled() || !haveEnoughStorage(prices, reserved)) return findPriorities(queue.slice(1), reserved);
    var unavailableResources = prices.map(price => price.name).filter(res => reserved.get(res).current > getResourceOwned(res));
    var viable = unavailableResources.length ? false : true;
    var effectivePrices = getEffectivePrices(prices, reserved);
    var realTicksNeeded = getTicksNeeded(effectivePrices, prices, reserved);
    var ticksNeeded = bufferTicksNeeded(realTicksNeeded);
    var toReserve = getResourcesToReserve(effectivePrices, ticksNeeded, reserved);
    return [{bld: found, reserved, viable, unavailable: unavailableResources, limiting: toReserve.limitingResources, ticksNeeded: realTicksNeeded}]
        .concat(findPriorities(queue.slice(1), toReserve.newReserved));
}
subtractUnreserved = (reserved, bought) => {
    var newReserved = reserved.clone();
    //this shouldn't cause a negative reservation
    Object.keys(bought).forEach(res => newReserved.addCurrent(res, -bought[res]))
    return newReserved;
}
tryBuy = (priorities) => {
    var bought = [];
    var reservationsBought = {};
    priorities.forEach(plan => {
        var bld = plan.bld;
        var reserved = subtractUnreserved(plan.reserved, reservationsBought);
        var prices = bld.getPrices();
        craftAdditionalNeeded(prices, reserved);
        if (canAfford(prices, reserved)) {
            var numBought = bld.buy(reserved);
            if (numBought === undefined) numBought = 1;
            if (numBought) {
                if (!bld.silent) log("Buying " + bld.name, bld.quiet);
                if (!bld.noLog) logBuy(bld, numBought);
                bought = bought.concat([bld]);
                //unreserve resources -- makes trading not have as many log entries
                prices.forEach(price => reservationsBought[price.name] = (reservationsBought[price.name] || 0) + price.val);
            }
        }
    });
    return bought;
}
updateQueue = (queue, bought) => {
    return queue.filter(bld => !bought.includes(bld)).concat(bought.filter(bld => !bld.once));
}
setVerbosity = level => {
    if (level >= 0 && level <= 1) {
        state.verboseQueue = level;
        updateUpNext(botDebug.priorities);
    }
}
moreVerbose = () => setVerbosity(state.verboseQueue + 1);
lessVerbose = () => setVerbosity(state.verboseQueue - 1);
updateUpNext = priorities => {
    var filter;
    var getHtml;
    if (state.verboseQueue) {
        filter = plan => true;
        getHtml = plan => "<span" + (plan.viable ? "" : ' style="color: #999999"') + ">"
             + plan.bld.name
             + " (" + ticksToDisplaySeconds(plan.ticksNeeded) + ")"
             + " (" + Array.from(new Set(plan.limiting.concat(plan.unavailable))).map(getResourceTitle).join(", ") + ")</span>"
    } else {
        filter = plan => plan.viable;
        getHtml = plan => plan.bld.name;
    }
    $("#botInfo").html("Up next: <br />" + priorities.filter(filter).map(getHtml).join("<br />"));
}
buyPrioritiesQueue = (queue) => {
    var maxPriority = queue.filter(bld => bld.maxPriority);
    queue = maxPriority.concat(queue.filter(bld => !bld.maxPriority));
    var reserved = new Reservations({});
    reserved.addCurrent("catnip", getWinterCatnipStockNeeded(canHaveColdSeason()));
    reserved.addCurrent("furs", getFursStockNeeded());
    var priorities = findPriorities(queue, reserved);
    botDebug.priorities = priorities;
    updateUpNext(priorities);
    var bought = tryBuy(priorities);
    return updateQueue(queue, bought);
}

/************** 
 * Main Loop
**************/
mainLoop = () => {
    assignFirstLeader();
    if (state.autoFarmer) {
        gatherIntialCatnip();
        preventStarvation();
    }
    if (state.autoSteel) craftAll("steel")
    //todo make trades try harder to do more
    if (isResourceFull("gold")) state.queue.filter(bld => bld.constructor.name === "Trade" && bld.isEnabled()).forEach(bld => promote(bld.name));
    state.queue = buyPrioritiesQueue(state.queue);
    if (state.autoConverters) manageConverters();
    loadUnicornRecipes();
    doAutoCraft();
    additionalActions.forEach(action => action());
    if (state.masterPlanMode) queueNewTechs();
    updateUi();
    var ticksPassed = game.ticks - state.ticks;
    if (ticksPassed !== state.ticksPerLoop) console.log(ticksPassed + " ticks passed (expected " + state.ticksPerLoop + ")")
    state.ticks = game.ticks;
}
additionalActions = [
    () => {
        if (state.autoSeti) $('#observeBtn').click()
    },
    () => { 
        if (state.autoHunt && (isResourceFull("manpower") || getTotalDemand("manpower") === 0) && getResourceOwned("manpower") >= 100) { 
            withLeader("Manager", () => $('a:contains("Send hunters")')[0].click())
        }
    },
    () => {
        if (state.populationIncrease > 0 && game.village.isFreeKittens() && game.village.sim.getKittens() > state.kittensAssigned) {
            var job = state.jobQueue.find(job => isJobEnabled(job))
            if (job) {
                state.jobQueue = removeOne(state.jobQueue, job);
                state.jobQueue.push(job);
            } else {
                job = "woodcutter";
            }
            //it's actually possible to cheat and click on a button that hasn't been revealed yet
            withTab("Village", () => {
                getJobButton(job).click();
                log("Assigned new kitten to " + job);
            });
            recountKittens(job);

        }
    },
    () => state.tradeTimer++,
    () => {
        if (state.autoReset < 1000 && state.autoReset < getBaseFaithProductionBonus(game.religion.faith)) {
            if (!findQueue("Transcend") && !findQueue("Faith Reset")) {
                enable("Faith Reset", "Religion", "Order of the Sun");
            }
        } else {
            disable("Faith Reset");
        }
    }
]

/************** 
 * Conversion
**************/
converters = ["smelter", "calciner", "biolab", "accelerator"]
getEffectsByNamePattern = (effects, pattern) => {
    return Object.keys(effects)
        .filter(name => name.match(pattern))
        .map(key => ({name: key.replace(pattern, ""), val: effects[key]}))
}
getConsumptionsPerTick = effects => getEffectsByNamePattern(effects, /PerTickCon$/)
getProductionsPerTick = effects => getEffectsByNamePattern(effects, /PerTickAutoprod$/)
//if adding is true, reject productions that, if added, would make the resource become full
//otherwise, only reject productions of resources that are already full
//either way, only reject productions if they cannot be crafted into something useful
isUselessProduction = (production, adding) => {
    return production.val === 0 || (
        isResourceFull(production.name, adding ? production.val * getResourceConversionRatio(production.name) : 0)
        && !autoCrafts.some(craft => 
            canCraft(craft.name) && craft.prices.some(price => price.name === production.name) && getTotalDemand(craft.name) > 0
        )
    )
}
manageConverters = () => {
    converters.map(name => game.bld.get(name)).forEach(converter => {
        var productions = getProductionsPerTick(converter.effects);
        if (converter.on && productions.length && productions.every(isUselessProduction)) {
            console.log("Disabling " + converter.name);
            enableConverter(converter, -1);
            state.disabledConverters[converter.name] = Math.min(converter.val, 1 + (state.disabledConverters[converter.name] || 0));
        } else if (state.disabledConverters[converter.name] && productions.some(production => !isUselessProduction(production, true))) {
            console.log("Re-enabling " + converter.name);
            enableConverter(converter, 1);
            state.disabledConverters[converter.name]--;
        }
    })
}
getResourceConversionRatio = res => {
    return getResourceGenericRatio(res) * (1 + game.prestige.getParagonProductionRatio() * 0.05);
}
enableConverter = (converter, amount) => {
    if (state.api >= 1) {
        converter.on = Math.max(0, Math.min(converter.val, converter.on + amount));
        game.upgrade(converter.upgrades);
    } else {
        withTab("Bonfire", () => {
            var outerButton = findButton(converter.label);
            var button = amount > 0 ? getBuildingIncreaseButton(outerButton) : getBuildingDecreaseButton(outerButton);
            for (var i = 0; i < Math.abs(amount); i++) {
                button.click();
            }
        })
    }
}
resetConverters = () => {
    Object.entries(state.disabledConverters).forEach(disabled => enableConverter(game.bld.get(disabled[0]), disabled[1]))
    state.disabledConverters = {};
}

/************** 
 * Resources
**************/
getResourceOwned = resName => game.resPool.get(resName).value
getResourceMax = resName => game.resPool.get(resName).maxValue || Infinity
getCraftInternalName = longName => game.workshop.crafts.find(row => row.label === longName).name;
getResourceLongTitle = resInternalName => game.workshop.crafts.find(row => row.name === resInternalName).label;
resourceTitleCache = arrayToObject(game.resPool.resources, "name");
resourceNameCache = arrayToObject(game.resPool.resources, "title");
getResourceTitle = resInternalName => resourceTitleCache[resInternalName].title;
getResourceInternalName = resTitle => resourceNameCache[resTitle].name;
fixPriceTitle = price => ({ val: price.val, name: getResourceTitle(price.name) });
getPrice = (prices, res) => (prices.filter(price => price.name === res)[0] || {val: 0}).val
//TODO calculate if resource production is zero (getEffectiveProduction -- make sure all events are ok)
getTotalDemand = res => {
    //this could be optimized a lot...
    var prices = flattenArr(state.queue.map(bld => bld.getPrices()).filter(prices => haveEnoughStorage(prices)));
    var allPrices = [];
    var maxDepth = 10;
    while (prices.length && maxDepth--) {
        if (!maxDepth) console.error("Infinite loop for " + res)
        allPrices = allPrices.concat(prices);
        prices = flattenArr(prices
            .filter(price => canCraft(price.name))
            .map(price => multiplyPrices(getCraftPrices(price.name), Math.ceil(price.val / getCraftRatio(price.name)))))
    }
    return allPrices
        .filter(price => price.name === res)
        .map(price => price.val)
        .reduce((acc, item) => acc + item, 0)
}
getSafeStorage = (res, autoCraftLevel, additionalProduction) => {
    if (autoCraftLevel === undefined) autoCraftLevel = state.autoCraftLevel;
    if (!additionalProduction) additionalProduction = 0;
    var max = getResourceMax(res);
    return max === Infinity ? max : max - autoCraftLevel * state.ticksPerLoop * (getEffectiveResourcePerTick(res, state.ticksPerLoop) + additionalProduction);
}
haveEnoughStorage = (prices, reserved) => prices.every(price => getSafeStorage(price.name) >= price.val + (reserved ? reserved.get(price.name).current : 0))
isResourceFull = (res, additionalProduction) => getResourceOwned(res) >= getSafeStorage(res, Math.max(state.autoCraftLevel, 1), additionalProduction);

getCraftingResourcePerTick = (res, reserved, forSteel) => {
    var resourcePerTick = getEffectiveResourcePerTick(res);
    if (canCraft(res)) {
        //special case steel: we always craft it
        var ignoreReservations = res === "steel" && state.autoSteel || !reserved;
        var prices = getCraftPrices(res);
        //for catnip, this will be wrong due to seasons
        //don't worry about it for now
        resourcePerTick += Math.max(0, getCraftRatio(res) * Math.min(...prices.map(price => 
            (getCraftingResourcePerTick(price.name, reserved, res === "steel" || forSteel) - (ignoreReservations ? 0 : reserved.get(price.name).production)) / price.val
        )));
    }
    if (res === "iron" && state.autoSteel && !forSteel) {
        resourcePerTick = Math.max(0, resourcePerTick - getCraftingResourcePerTick("coal", reserved));
    }
    //todo production from trade???? maybe just blueprints based on gold income?? needs more consistent trading
    return resourcePerTick;
}
/**
 * bestCaseTicks: if nonzero, assume you will have this many ticks of the maximum possible astronomical events (for save storage calculation)
 */
getEffectiveResourcePerTick = (res, bestCaseTicks) => {
    if (!bestCaseTicks) bestCaseTicks = 0;
    var resourcePerTick = game.getResourcePerTick(res, true);
    var bestCaseDays = Math.ceil(bestCaseTicks * game.calendar.dayPerTick);
    var effectiveDaysPerTick = bestCaseTicks ? bestCaseDays / bestCaseTicks : game.calendar.dayPerTick;
    var meteorRatio = game.prestige.getPerk("chronomancy").researched ? 1.1 : 1
    var starRatio = meteorRatio * (game.prestige.getPerk("astromancy").researched ? 2 : 1)
    if (res === "science" || res === "starchart" && game.science.get("astronomy").researched) {
        var astronomicalEventChance = bestCaseTicks ? 1 : Math.min(((25 / 10000) + game.getEffect("starEventChance")) * starRatio, 1);
        var eventsPerTick = astronomicalEventChance * effectiveDaysPerTick;
        var valuePerEvent;
        if (res === "science") {
            var celestialBonus = game.workshop.get("celestialMechanics").researched ? 5 : 0;
            valuePerEvent = (25 + celestialBonus) * ( 1 + game.getEffect("scienceRatio"));
        } else {
            valuePerEvent = 1;
        }
        resourcePerTick += eventsPerTick * valuePerEvent;
    }
    if (res === "minerals" || res === "science" && game.workshop.get("celestialMechanics").researched) {
        var meteorChance = bestCaseTicks ? 1 : 10 / 10000 * meteorRatio;
        var eventsPerTick = meteorChance * effectiveDaysPerTick;
        var valuePerEvent;
        if (res === "minerals") {
            valuePerEvent = 50 + 25 * game.getEffect("mineralsRatio");
        } else {
            valuePerEvent = 15 * ( 1 + game.getEffect("scienceRatio"));
        }
        resourcePerTick += eventsPerTick * valuePerEvent;
    }
    //don't bother with ivory and unicorns income; it doesn't matter
    if (res === "furs" && state.autoHunt) {
        var effectiveCatpowerPerTick = Math.max(0, 
            getEffectiveResourcePerTick("manpower", bestCaseTicks)
                - getEffectiveResourcePerTick("gold", bestCaseTicks) * 50 / 15
        )
        resourcePerTick += getFursPerHunt() * effectiveCatpowerPerTick / 100;
    }
    //don't bother with the other possible events; they don't have capacities
    return resourcePerTick;
}
var getFursPerHunt = () => {
    var managerBonus = .05 * (1 + game.prestige.getBurnedParagonRatio())
    var huntRatio = game.getEffect("hunterRatio") + managerBonus;
    var maxResult = 80 + 65 * huntRatio;
    return maxResult / 2;
}

/************** 
 * Crafting
**************/
Recipe = class {
    constructor(data) {
        //assumes that changes in game state are automatically reflected in data object
        //if this changes, we'll need to instead save the name and make the data a getter property
        this.data = data;
        this.shouldCraftAll = data.prices.some(price => getResourceMax(price.name) < Infinity);
    }
    get name() {
        return this.data.name;
    }
    //sidebar
    get title() {
        return this.data.label;
    }
    //Workshop tab craft button
    get longTitle() {
        return getResourceLongTitle(this.name);
    }
    get prices() {
        //data.prices doesn't account for starchart discount on ships
        return game.workshop.getCraftPrice(this.data);
    }
    get canCraft() {
        return this.data.unlocked 
            //construction required for first craft, though it is possible to cheat and click the buttons before they're shown 
            && ((game.bld.get("workshop").val && game.science.get("construction").researched) || this.name === "wood")
            && this.prices.every(price => getResourceMax(price.name) >= price.val);
    }
    get craftRatio() {
        return getCraftRatio(this.name);
    }
    craftAll() {
        if (this.shouldCraftAll) {
            craftAll(this.name);
        }
    }
    craftMultiple(amount) {
        craftMultiple(this.data, amount);
    }
}
UnicornRecipe = class extends Recipe {
    constructor(name, button, getRatio, apiCraftMultiple) {
        super({name, label: getResourceTitle(name), prices: button.model.prices});
        this.button = button;
        this.getRatio = getRatio;
        this.apiCraftMultiple = apiCraftMultiple;
    }
    get longTitle() {
        return this.button.model.name;
    }
    get prices() {
        return this.data.prices;
    }
    get canCraft() {
        return game.bld.get("ziggurat").val && game.science.get("theology").researched;
    }
    get craftRatio() {
        return this.getRatio();
    }
    craftAll() {
        //note: all 4 current unicorn recipes have shouldCraftAll==false
        if (this.shouldCraftAll) {
            this.craftMultiple(getAffordableAmount(this.prices))
        }
    }
    craftMultiple(amount) {
        if (amount > 0) {
            if (state.api >= 1) {
                this.apiCraftMultiple(this.button, amount)
            } else {
                withTab("Religion", () => {
                    for (var i = 0; i < amount; i++) {
                        buyButton(this.longTitle);
                    }
                });
            }
        }
    }
}
buyItemMultiple = (button, amount) => {
    for (var i = 0; i < amount; i++) {
        button.controller.buyItem(button.model, null, () => {});
    }
}
sacrificeMultiple = (button, amount) => button.controller.sacrifice(button.model, amount)
refineMultiple = (button, amount) => button.controller._refine(button.model, amount)
recipeMap = arrayToObject(game.workshop.crafts.map(data => new Recipe(data)), "name");
loadUnicornRecipes = () => {
    if (!recipeMap["tears"] && game.bld.get("ziggurat").val) {
        withTab("Religion", () => {
            //need to open the religion tab once for the game to load these buttons
            var unicornRecipes = arrayToObject([
                new UnicornRecipe("tears", game.religionTab.sacrificeBtn, 
                    () => game.bld.get("ziggurat").val, sacrificeMultiple),
                new UnicornRecipe("timeCrystal", game.religionTab.sacrificeAlicornsBtn, 
                    () => 1 + game.getEffect("tcRefineRatio"), sacrificeMultiple),
                new UnicornRecipe("sorrow", game.religionTab.refineBtn, 
                    () => 1, buyItemMultiple),
                new UnicornRecipe("relic", game.religionTab.refineTCBtn,
                    () => 1 + game.getEffect("relicRefineRatio") * game.religion.getZU("blackPyramid").val, refineMultiple),
            ], "name");
            Object.assign(recipeMap, unicornRecipes);
        });
    }
}
getCraftPrices = craft => { return recipeMap[craft].prices }
multiplyPrices = (prices, quantity) => prices.map(price => ({ name: price.name, val: price.val * quantity }))
craftTableElem = $('.craftTable');
getCraftTableElem = () => {
    if (!craftTableElem.length) {
        craftTableElem = $('.craftTable');
    }
    return craftTableElem;
}
getAffordableAmount = prices => Math.min(...prices.map(price => Math.floor(getResourceOwned(price.name) / price.val)))
findCraftAllButton = (name) => getCraftTableElem().children('div.res-row:contains("' + getResourceTitle(name) + '")').find('div.craft-link:contains("all")')[0]
findCraftButtons = (name) => getCraftTableElem().children('div.res-row:contains("' + getResourceTitle(name) + '")').find('div.craft-link:contains("+")');
craftFirstTime = name => {
    if (canAfford(getCraftPrices(name))) {
        withTab("Workshop", () => {
            var longTitle = getResourceLongTitle(name);
            log("First time crafting " + longTitle, true);
            findButton(longTitle).click();
        })
    }
}
craftAll = name => {
    if (state.api >= 1) {
        if (canCraft(name)) game.workshop.craftAll(name);
    } else {
        var button = findCraftButtonValues(name, 1).pop(); 
        if (button) button.click(); 
    }
}
var craftButtonRatios = [
    //data from WCraftRow
    { min: 1, ratio: 0.01 },
    { min: 25, ratio: 0.05 },
    { min: 100, ratio: 0.1 },
    //we could include the all as {ratio: 1} and treat it the same as the rest if we wanted
]
findCraftButtonValues = (craft, craftRatio) => {
    if (!canCraft(craft)) {
        return [];
    } else if (craft === "wood" && game.bld.get("workshop").val === 0) {
        return [{click: () => withTab("Bonfire", () => findButton("Refine catnip").click()), times: 1, amount: craftRatio}]
    } else if (getResourceOwned(craft) === 0) {
        return [{click: () => craftFirstTime(craft), times: 1, amount: craftRatio}]
    } else {
        var craftAllButton = findCraftAllButton(craft);
        var craftAllTimes = getAffordableAmount(getCraftPrices(craft));
        return craftButtonRatios.filter(ratio => craftAllTimes >= ratio.min).map((ratio, idx) => {
            var craftTimes = Math.max(ratio.min, Math.floor(craftAllTimes * ratio.ratio))
            var craftAmount = craftTimes * craftRatio
            return { 
                click: () => { var button = findCraftButtons(craft)[idx]; if (button) button.click(); },
                times: craftTimes, 
                amount: craftAmount
            };
        }).concat(craftAllButton ? {click: () => craftAllButton.click(), times: craftAllTimes, amount: craftAllTimes * craftRatio } : []);
    }
}
craftOne = name => { var button = findCraftButtonValues(name, getCraftRatio(name))[0]; if (button) { button.click(); return button.amount; } else { return 0; } }
getEnoughResource = res => {
    if (res === "furs") {
        return getFursStockNeeded();
    } else if (getResourceMax(res) === Infinity) {
        return getEnoughCraft(res);
    } else {
        return getSafeStorage(res);
    }
}
getEnoughCraft = res =>
    state.queue
        .map(bld => bld.getPrices())
        .concat(game.science.techs.filter(tech => tech.unlocked && !tech.researched) //save some compendiums midgame
            .map(tech => tech.prices))
        .map(prices => getPrice(prices, res))
        .reduce((sum, val) => sum + val, 0)
autoCrafts = game.workshop.crafts
    //parchment is needed to spend culture and science autocrafting, and there's no other craft for furs
    .filter(craft => craft.prices.some(price => getResourceMax(price.name) < Infinity || craft.name === "parchment"))
preferSteelCrafting = () => {
    //prefer steel over plate
    var steelIndex = autoCrafts.findIndex(craft => craft.name === "steel")
    var steelCraft = autoCrafts.splice(steelIndex, 1)[0];
    autoCrafts.unshift(steelCraft);
}
preferSteelCrafting();
doAutoCraft = () => {
    autoCrafts.forEach(craft => {
        if (canCraft(craft.name)) {
            var getAmountToCraft = price => {
                var safeCrafts = (getResourceOwned(price.name) - getEnoughResource(price.name)) / price.val
                return getResourceMax(price.name) === Infinity ? Math.floor(safeCrafts) : Math.ceil(safeCrafts);
            }
            var timesToCraft = Math.min(...craft.prices.map(getAmountToCraft))
            craftMultiple(craft, timesToCraft);
        }
    });
}
craftMultiple = (craft, timesToCraft) => {
    if (timesToCraft <= 0) {
        return;
    }
    if (state.api >= 1) {
        game.craft(craft.name, timesToCraft);
    } else {
        var craftRatio = getCraftRatio(craft.name);
        var maxClicks = 20; //don't expect to need this many clicks, prevent something bad
        while (timesToCraft > 0 && maxClicks--) {
            var craftButtons = findCraftButtonValues(craft.name, craftRatio);
            if (!craftButtons.length) {
                //button hasn't shown up yet (we just crafted one of the requirements)
                break;
            }
            var targetButton = craftButtons.reduce((smallerButton, biggerButton) => 
                biggerButton.times < timesToCraft ? biggerButton : smallerButton
            )
            if (craft.name === "wood") {
                //special case: only craftable resource where the craft target has a max capacity
                var maxBeamCrafts = 10; //also useful in case we try to autocraft catnip before we have a workshop
                while (getResourceOwned(craft.name) + targetButton.amount > getResourceMax(craft.name) && maxBeamCrafts--) {
                    craftOne("beam");
                }
            }
            craft.prices.filter(price => getResourceOwned(price.name) === getResourceMax(price.name) && price.name !== "culture")
                .forEach(price => console.log("Warning: " + price.name + " full " + (price.name === "science" ? "(do you have enough manuscripts?)" : "(did the bot lag?)")))
            targetButton.click();
            timesToCraft -= targetButton.times;
        }
    }
}
setAutoCrafting = level => {
    if (level >= 0 && level <= 2) {
        state.autoCraftLevel = level;
    }
}
canCraft = resInternalName => {
    var recipe = recipeMap[resInternalName];
    return recipe && recipe.canCraft;
}
shouldDelayCrafting = res => recipeMap[res] && !recipeMap[res].shouldCraftAll;
getAdditionalNeeded = (prices, reserved) => 
    prices
        .map(price => ({ name: price.name, val: (price.val + reserved.get(price.name).current - getResourceOwned(price.name))}))
        .filter(price => price.val > 0);
craftAdditionalNeeded = (prices, reserved) => {
    var needed = getAdditionalNeeded(prices, reserved);
    var tryCraft = prices => prices.filter(price => canCraft(price.name))
        .filter(price => price.val < Infinity)
        .forEach(price => makeCraft(price.name, price.val, reserved));
    tryCraft(needed.filter(price => !shouldDelayCrafting(price.name)));
    var nowNeeded = getAdditionalNeeded(prices, reserved);
    if (nowNeeded.every(price => shouldDelayCrafting(price.name))) {
        tryCraft(nowNeeded);
    }
}
getCraftRatio = res => game.getResCraftRatio({ name: res }) + 1;
makeCraft = (craft, amountNeeded, reserved) => {
    var recipe = recipeMap[craft];
    var timesToCraft = Math.ceil(amountNeeded / recipe.craftRatio);
    var totalPrices = multiplyPrices(recipe.prices, timesToCraft);
    craftAdditionalNeeded(totalPrices, reserved);
    if (canAfford(totalPrices, reserved)) {
        recipe.craftMultiple(timesToCraft);
    } else if (recipe.prices.every(price => !reserved.get(price.name).current)) {
        recipe.craftAll();
    }
}
getTotalCraftPrices = (res) => {
    var totalPricesMap = {};
    var prices = getCraftPrices(res);
    var maxDepth = 10;
    while (prices.length) {
        if (!maxDepth--) {
            //if the game ever lets you craft scaffold back into catnip...
            console.error("Infinite loop finding craft prices:")
            console.error(prices)
            break;
        }
        var nextPrices = flattenArr(prices.map(getIngredientsNeeded));
        prices.forEach(price => totalPricesMap[price.name] = (totalPricesMap[price.name] || 0) + price.val)
        prices = nextPrices;
    }
    return Object.entries(totalPricesMap).map(price => ({name: price[0], val: price[1]}))
}

/************** 
 * Starvation
**************/
//todo: all of this is wrong in accelerated time
//but the calendar speed is also bugged in accelerated time, wait for fix
canHaveColdSeason = () => game.calendar.year > 3;
getWinterCatnipProduction = isCold => {
    return getSeasonalCatnipProduction(isCold ? .1 : .25);
}
getSeasonalCatnipProduction = weatherMod => {
    //calcResourcePerTick always uses the current weather--adjust this away
    var currentWeather = game.calendar.getWeatherMod();
    var adjustedSeason = { modifiers: { catnip: weatherMod - currentWeather } }
    return getTrueResourcePerTick("catnip", adjustedSeason);
}
//season is optional
//get the up-to-date, rather than cached, per-tick value
getTrueResourcePerTick = (res, season) => {
    return game.calcResourcePerTick(res, season) + game.getResourcePerTickConvertion(res);
}
ticksPerSeason = () => 100 / game.calendar.dayPerTick;
ticksLeftInSeason = () => (100 - game.calendar.day) / game.calendar.dayPerTick;
getExpectedCatnipBeforeWinter = () => {
    if (game.calendar.season === 3) return 0;
    return game.getResourcePerTick("catnip", true) * ticksLeftInSeason()
        + (2 - game.calendar.season) * getSeasonalCatnipProduction(1) * ticksPerSeason();
}
getWinterCatnipStockNeeded = (isCold, additionalConsumption, ignorePopulationIncrease) => {
    if (!additionalConsumption) additionalConsumption = 0;
    //we could base this off actual kitten capacity, but if the kittens have already starved we might just need to let them starve
    if (!ignorePopulationIncrease) additionalConsumption += state.populationIncrease * -game.village.catnipPerKitten;
    if (game.calendar.season === 3) {
        return Math.max(0, -(getTrueResourcePerTick("catnip") - additionalConsumption) * ticksLeftInSeason())
    } else {
        return Math.max(0, -(getWinterCatnipProduction(isCold) - additionalConsumption) * ticksPerSeason() - getExpectedCatnipBeforeWinter())
    }
}
getAdditionalCatnipNeeded = populationIncrease => {
    return getWinterCatnipStockNeeded(canHaveColdSeason(), populationIncrease * -game.village.catnipPerKitten) - getWinterCatnipStockNeeded(canHaveColdSeason(), 0)
}
getFursStockNeeded = () => {
    var catpowerPerSec = game.getResourcePerTick("manpower", true);
    if (catpowerPerSec <= 0) {
        return game.getResourcePerTick("furs", true) >= 0 ? 0 : Infinity;
    }
    return Math.max(0, -game.getResourcePerTick("furs", true) * ((getResourceMax("manpower") + 50 * getResourceOwned("gold") / 15) / catpowerPerSec))
}
gatherIntialCatnip = () => {
    if (game.bld.get("field").val === 0 && getResourceOwned("catnip") < 10) {
        withTab("Bonfire", () => {
            var maxClicks = 10;
            while (getResourceOwned("catnip") < 10 && maxClicks--) {
                findButton("Gather catnip").click()
            }
        });
    }
}
preventStarvation = () => {
    if (getResourceOwned("catnip") < getWinterCatnipStockNeeded(false, 0, true) && game.science.get("agriculture").researched) {
        log("Making a farmer to prevent starvation (needed " + game.getDisplayValueExt(getWinterCatnipStockNeeded(false, 0, true)) + " catnip)")
        switchToJob("farmer");
    }
}
setAutoFarmer = auto => {
    state.autoFarmer = auto;
}

/************** 
 * Jobs
**************/
getJobCounts = () => {
    return game.village.jobs.map(job => ({
        name: job.name, 
        val: game.village.sim.kittens.filter(kitten => kitten.job === job.name).length
    }));
}
getJobLongName = jobName => game.village.jobs.find(job => job.name === jobName).title;
getJobShortName = jobLongName => game.village.jobs.find(job => job.title === jobLongName).name;
getJobButton = jobName => findButton(getJobLongName(jobName));
//decrease button uses en dash (–), not hyphen (-)
decreaseJob = jobName => getJobButton(jobName).find('a:contains("[–]")')[0].click();
//when we decrease a job, other job big buttons don't become immediately enabled; instead click the +
increaseJob = jobName => getJobButton(jobName).find('a:contains("[+]")')[0].click();
isJobEnabled = jobName => game.village.jobs.find(job => job.name === jobName).unlocked;
switchToJob = jobName => {
    if (isJobEnabled(jobName)) {
        withTab("Village", () => {
            if (game.village.isFreeKittens() && state.populationIncrease) {
                recountKittens(jobName);
            }
            if (!game.village.isFreeKittens()) {
                var mostCommonJob = maxBy(getJobCounts().filter(job => job.name !== jobName), job => job.val);
                if (mostCommonJob.val > 0) {
                    decreaseJob(mostCommonJob.name);
                }
            }
            if (game.village.isFreeKittens()) {
                increaseJob(jobName);
                if (game.workshop.get("register").researched) {
                    findButton("Manage Jobs").click();
                }
            }
        });
    } else {
        console.error("Job " + jobName + " not unlocked yet!");
    }
}
resourceEffectNames = ["GlobalRatio", "Ratio", "RatioReligion", "SuperRatio"]
/**
 * Get the relative production ratio of assigning a kitten to a job producing resInternalName. Doesn't include festivals. Not for engineers.
 */
getResourceKittenRatio = resInternalName => {
    var totalRatio = getResourceProductionRatio(resInternalName);
    totalRatio *= 1 + game.getEffect(resInternalName + "JobRatio");
    totalRatio *= game.village.happiness;
    return totalRatio;
}
//production ratio for all regular (not conversion) production. Doesn't include space production bonuses
getResourceProductionRatio = resInternalName => {
    var totalRatio = resourceEffectNames
        .map(effect => game.getEffect(resInternalName + effect))
        .reduce((total, ratioAdded) => total * (1 + ratioAdded), 1);
    totalRatio *= getResourceGenericRatio(resInternalName);
    var steamworks = game.bld.get("steamworks");
    var swEffectGlobal = steamworks.effects[resInternalName+"RatioGlobal"];
    if (steamworks.on > 0 && swEffectGlobal) {
        totalRatio *= 1 + swEffectGlobal;
    }
    totalRatio *= 1 + game.prestige.getParagonProductionRatio();
    return totalRatio;
}
//production ratio component for both buildings and kittens
getResourceGenericRatio = resInternalName => {
    var totalRatio = 1 + (game.religion.getProductionBonus() / 100);
    if (!game.resPool.get(resInternalName).transient && resInternalName !== "catnip") {
        //from game.calcResourcePerTick
        if (resInternalName !== "oil") {
            var steamworks = game.bld.get("steamworks");
            var swRatio = steamworks.on > 0 ? (1 + steamworks.effects["magnetoBoostRatio"] * steamworks.on) : 1;
            totalRatio *= 1 + (game.getEffect("magnetoRatio") * swRatio);
        }
        if (resInternalName !== "uranium") {
            //reactors
            totalRatio *= 1 + game.getEffect("productionRatio");
        }
    }
    return totalRatio;
}
//Doesn't include skill level.
getResourcePerTickPerKitten = (res, jobName) => {
    if (jobName === undefined) {
        var directJob = getJobForResource(res);
        var directProduction = directJob ? getResourcePerTickPerKitten(res, directJob.name) : 0;
        var indirectProduction = canCraft(res) ? 
            Math.min(...getCraftPrices(res).map(price => getResourcePerTickPerKitten(price.name) / price.val)) * getCraftRatio(res)
            : 0
        return Math.max(directProduction, indirectProduction);
    }
    return (game.village.getJob(jobName).modifiers[res] || 0) * getResourceKittenRatio(res);
}
getWoodPerFarmer = () => getResourcePerTickPerKitten("catnip", "farmer") * getCraftRatio("wood") / getPrice(getCraftPrices("wood"), "catnip")
getFarmerEffectiveness = () => getWoodPerFarmer() / getResourcePerTickPerKitten("wood", "woodcutter")
//from game.villageTab.getValueModifierPerSkill
baseSkillRatioAtMaxLevel = 1.75
//from village.updateResourceProduction
getBestPossibleSkillRatio = () => 1 + (baseSkillRatioAtMaxLevel - 1) * (1 + game.getEffect("skillMultiplier")) / 4
getJobForResource = res => game.village.jobs.find(job => job.modifiers[res]);

/************** 
 * Leaders
**************/
apiSetLeader = newLeader => {
    var oldLeader = game.village.leader;
    if (oldLeader) oldLeader.isLeader = false;
    newLeader.isLeader = true;
    game.village.leader = newLeader;
}
clickSetLeader = (newLeader, job) => {
    if (!job) job = "";
    var jobFilter = $("#gameContainerId select");
    if (job !== jobFilter.val()) jobFilter.val(job)[0].dispatchEvent(new Event("change"));
    var leaderButton = $('div.panelContainer:contains("Census") > div.container > div:contains("' + newLeader.name + " " + newLeader.surname + '") a:contains("☆")').first();
    if (leaderButton.length) {
        leaderButton[0].click();
    } else {
        console.error("Warning: Unable to find leader with job " + job)
        console.error(newLeader);
    }
}
assignFirstLeader = () => {
    if (!state.leaderAssigned && game.science.get("civil").researched) {
        if (game.village.leader) {
            //TODO does the game just automake a leader when you get civil???
            state.leaderAssigned = true;
        } else {
            var isArtisan = kitten => kitten.trait.name === "engineer";
            var targetLeader;
            if (state.api >= 1) {
                targetLeader = game.village.sim.kittens.find(isArtisan);
                if (targetLeader) {
                    apiSetLeader(targetLeader);
                }
            } else {
                var clickable = getClickableKitten(isArtisan);
                if (clickable) {
                    targetLeader = clickable.kitten;
                    withTab("Village", () => clickSetLeader(targetLeader, clickable.job));
                }
            }
            if (targetLeader) {
                log("Assigned first leader to Artisan (job: " + getJobLongName(targetLeader.job) + ")")
            }
        }
    }
}
//only the 10 most experienced kittens of each job type are clickable
getClickableKitten = condition => {
    var maxKittensDisplayed = 10;
    var firstPageKitten = game.village.sim.kittens.slice(-maxKittensDisplayed).find(condition);
    if (firstPageKitten) {
        return { kitten: firstPageKitten };
    }
    return game.village.jobs.filter(job => job.unlocked).map(job => {
        return { 
            kitten: game.village.sim.kittens.filter(kitten => kitten.job === job.name).slice(-maxKittensDisplayed).find(condition),
            job: job
        }
    }).find(candidate => candidate.kitten)
}
withLeader = (leaderType, op) => {
    if (!game.science.get("civil").researched || game.challenges.currentChallenge === "anarchy" || !leaderType) {
        return op();
    } else if (state.api >= 1) {
        var oldLeader = game.village.leader;
        var newLeader = game.village.sim.kittens.find(kitten => kitten.trait.title === leaderType);
        if (newLeader) {
            apiSetLeader(newLeader);
        } else {
            console.error("Unable to find leader type " + leaderType + ". Are you low on kittens?");
        }
        try {
            return op();
        } finally {
            if (oldLeader && newLeader) apiSetLeader(oldLeader);
        }
    } else {
        withTab("Village", () => {
            var oldLeader = getClickableKitten(kitten => kitten.isLeader);
            var newLeader = getClickableKitten(kitten => kitten.trait.title === leaderType);
            if (oldLeader && newLeader) {
                clickSetLeader(newLeader.kitten, newLeader.job);
            } else console.error("Unable to find leader type " + leaderType + ". Make sure to promote a kitten of that type so they appear on the first page.");
            try {
                return op();
            } finally {
                if (oldLeader && newLeader) clickSetLeader(oldLeader.kitten, oldLeader.job);
            }
        });
    }
}


/************** 
 * Trading
**************/
var tradeTimerDuration = 10;
tradeWith = race => $('div.panelContainer:contains("' + race + '") span:contains("Send caravan")').click()
getTradeButtons = race => $('div.panelContainer:contains("' + race + '") div.btnContent').children(":visible")
getTradeData = race => game.diplomacy.get(race.toLowerCase());
getTradeValue = (race, bestCase) => {
    var tradeData = getTradeData(race);
    var standingRatio = bestCase ? 200 : game.getEffect("standingRatio") + (game.prestige.getPerk("diplomacy").researched ? 10 : 0);
    var attitudeMultiplier = {
        hostile: Math.min(1, tradeData.standing + standingRatio / 100),
        neutral: 1,
        friendly: 1 + .25 * Math.min(1, tradeData.standing + standingRatio / 200)
    }[tradeData.attitude]
    var ships = game.resPool.get("ship").value;
    var energyRatio = tradeData.name === "leviathans" ? 1 + 0.02 * tradeData.energy : 1;
    return tradeData.sells.map(sell => ({
        name: sell.name, 
        val: (sell.name === "titanium" ? 1.5 * (1 + ships / 50) : sell.value)
            * (1 + game.diplomacy.getTradeRatio())
            * (bestCase ? (1 + sell.delta/2) : 1)
            * attitudeMultiplier
            * energyRatio
            * bestCase ? 1 : (sell.name === "titanium" ? Math.min(1, .15 + ships * .0035) : sell.chance / 100)
            * sell.seasons[seasonNames[game.calendar.season]]
    }))
}
seasonNames = ["spring", "summer", "autumn", "winter"];
makeRoomForTrades = (race) => {
    //TODO for sharks, also craft away the beams
    var loopsToNextTrade = Math.max(1, state.autoCraftLevel);
    var tradesToMake = Math.ceil((getResourceOwned("gold") - getSafeStorage("gold", loopsToNextTrade)) / 15)
    var storageNeeded = multiplyPrices(getTradeValue(race, true), tradesToMake);
    storageNeeded.forEach(price => {
        var craft = game.workshop.crafts.find(craft => craft.prices.some(craftPrice => craftPrice.name === price.name));
        if (craft && canCraft(craft.name)) {
            var excess = getResourceOwned(price.name) + price.val - getSafeStorage(price.name)
            var timesToCraft = Math.max(0, Math.ceil(excess / craft.prices.find(craftPrice => craftPrice.name === price.name).val))
            craftMultiple(craft, timesToCraft);
        }
    })
}
gainTradeResources = yieldResTotal => Object.fromEntries(Object.entries(yieldResTotal).map(entry => [entry[0], game.resPool.addResEvent(...entry)]))
updateTradeMessages = (yieldResTotal, quantityTraded) => {
    var tradeSeason = game.calendar.year + game.calendar.season / 4;
    if (tradeSeason !== state.lastTradeSeason) {
        //make new logs each season
        state.tradeResourceTotal = {};
        state.tradeMessages = 0;
        state.lastTradeSeason = tradeSeason;
        state.lastTradeQuantity = 0;
    }
    var actualTradeMessages = clearTradeLogs(state.tradeMessages);
    if (actualTradeMessages !== state.tradeMessages || state.tradeSeason) {
        //did not successfully clear logs; something else appeared
        state.tradeResourceTotal = {};
        state.lastTradeQuantity = 0;
    }
    Object.entries(yieldResTotal).forEach(entry => state.tradeResourceTotal[entry[0]] = (state.tradeResourceTotal[entry[0]] || 0) + entry[1])
    state.lastTradeQuantity += quantityTraded;
    state.tradeMessages = msgTrades(state.tradeResourceTotal, state.lastTradeQuantity);
}
//from diplomacy.gainTradeRes
msgTrades = (yieldResTotal, amtTrade) => {
    //add this return value
    var totalMessages = 1;
    for (var res in yieldResTotal){
        //just need to rip this one line out
        //var amt = this.game.resPool.addResEvent(res, yieldResTotal[res]);
        var amt = yieldResTotal[res];
        if (amt > 0){
            if (res == "blueprint"){
                game.msg($I("trade.msg.resources", [game.getDisplayValueExt(amt), res]) + "!", "notice", "trade", true);
            } else if (res == "titanium"){
                game.msg($I("trade.msg.resources", [game.getDisplayValueExt(amt), res]) + "!", "notice", "trade", true);
            } else {
                var resPool = game.resPool.get(res);
                var name = resPool.title || res;
                game.msg($I("trade.msg.resources", [game.getDisplayValueExt(amt), name]), null, "trade", true);
            }
            totalMessages++;
        }
    }
    game.msg($I("trade.msg.trade.caravan", [amtTrade]), null, "trade");
    return totalMessages;
}
clearTradeLogs = (expectedTradeMessages) => {
    var tradeMessages = 0;
    for (var i = game.console.messages.length - 2; i >= 0; i--) {
        if (game.console.messages[i].tag === "trade") tradeMessages++; else break;
    }
    if (tradeMessages === expectedTradeMessages || expectedTradeMessages === undefined) {
        game.console.messages.splice(game.console.messages.length - 1 - tradeMessages, tradeMessages);
        game.ui.renderConsoleLog();
    }
    return tradeMessages;
}

/************** 
 * Master Plan
**************/
//buildings using common, limited-storage resources, with normal or low price ratios
var commonBuildings = ["aqueduct", "logHouse", "library", "mine", "smelter", "workshop"];
var isStorageLimited = (smartStorageMode) => {
    switch (smartStorageMode) {
        case 0:
            return true;
        case 1:
            //aggressive--some building or upgrade must be limited
            return state.queue
                .filter(bld => (commonBuildings.includes(bld.internalName) || bld.constructor.name == "Science") && bld.isUnlocked())
                .map(bld => bld.getPrices())
                .some(prices => prices.some(price => price.val > getSafeStorage(price.name) && price.name !== "science"))
        case 2: 
            //conservative--all buildings must be limited
            return commonBuildings
                    .filter(name => game.bld.get(name).unlocked && findQueue(getBuildingLabel(name)))
                    .map(name => game.bld.getPrices(name))
                    .every(prices => prices.some(price => price.val > getSafeStorage(price.name)))
        default:
            throw new Error("Unknown smart storage mode")
    }
}
var getMaxProductionTicksNeeded = (prices) => {
    return Math.max(...prices.map(price =>
        price.val / Math.max(0, getCraftingResourcePerTick(price.name, new Reservations({}), true))
    ));
}
//ok to queue things that aren't unlocked yet
var getUnresearched = buildings => buildings.filter(data => !(data.researched || data.val))
var uselessBuilds = [
    "ziggurat", "barges", "steelPlants", "factoryAutomation", "advancedAutomation", "pneumaticPress",
     "factoryOptimization", "factoryRobotics", "seti", "ecology", "unicornSelection", "ai", "chronophysics",
     "metaphysics", "cryptotheology", "thorium", "advExogeology", "superconductors", "spaceEngineers",
     "photovoltaic"
]
//can be built, but might be detrimental
var dangerousBuilds = [
    "pumpjack", //you might prefer to have energy-free oil
    "warehouse" //too many >.<
]
//build at any cost (technically infinite cost when you have no income)
var priorityBuilds = [
    "calciner",
    "accelerator"
]
//too valuable to be spent by a naive master plan
var specialResources = ["relic", "timeCrystal", "void"]
var isUseful = bld => {
    var specialCases = {
        mineralHoes: () => getJobCounts().find(job => job.name === "farmer").val,
        ironHoes: () => specialCases.mineralHoes(),
        register: () => game.challenges.currentChallenge !== "anarchy",
        satelliteRadio: () => game.bld.get("amphitheatre").stage === 1 && game.space.getBuilding("sattelite").val >= 5,
        enrichedUranium: () => game.bld.get("reactor").val >= 5,
        hydroPlantTurbines: () => game.bld.get("aqueduct").stage === 1,
        hubbleTelescope: () => (game.space.getBuilding("sattelite").val + game.space.getBuilding("researchVessel").val * 10) >= 3,
        solarSatellites: () => game.space.getBuilding("sattelite").val >= 5,
        hut: () => game.space.getBuilding("field").val >= 20,
        mint: () => getResourceMax("manpower") > 20000,
        mansion: () => game.bld.get("calciner").val >= 20,
        biolab: () => specialCases.mansion(),
        workshop: () => game.science.get("writing").researched,
    }
    if (specialCases[bld.name]) return specialCases[bld.name]();
    return !uselessBuilds.includes(bld.name) && !dangerousBuilds.includes(bld.name) && !bld.prices.some(price => specialResources.includes(price.name));
}
//luckily we're only concerned with the first copy of a building, so we don't need to worry about price ratios
var notTooExpensive = bld => priorityBuilds.includes(bld.name) || getMaxProductionTicksNeeded(bld.prices) <= maxProductionCostToEnable;
//todo base this on the max production cost of the cheapest queued building sharing a resource price with it?
var maxProductionCostToEnable = game.rate * 60 * 15; //15 minutes
//TODO only add each thing once (if human intervenes)
scienceData = {
    Bonfire: game.bld.buildingsData,
    Science: Object.values(game.science.metaCache),
    Workshop: game.workshop.upgrades,
    Space: Object.values(game.space.metaCache),
}
var queueNewTechs = () => {
    ["Workshop", "Science"].forEach(tab => {
        getUnresearched(scienceData[tab]).filter(isUseful).filter(notTooExpensive).forEach(bld => {
            //todo require that it's enabled???
            if (!findQueue(bld.label))
                enable(bld.label, tab, undefined, false, true);
        })
    })
}
var clearMasterPlan = () => {
    state.queue = state.queue.filter(bld => !bld.masterPlan);
}

/************** 
 * Queueables
**************/
housingMap = {
    Hut: 2,
    "Log House": 1,
    Mansion: 1,
    "Space Station": 2,
}
//remove percentages, counts, and (complete)
trimButtonText = text => text.replace(/(\(|\[)[^\])]*(\)|\])/g, "").trim()
findButton = name => $('#gameContainerId span:visible').filter((idx, button) => trimButtonText(button.innerText) === name).parents("div.btn")
//bonfire increase/decrease uses simple +/-, unlike jobs which use [] and en dash
//make sure not to grab the -all button
getBuildingDecreaseButton = button => button.find('a').filter((idx, elem) => elem.innerText.trim() === "-")[0];
getBuildingIncreaseButton = button => button.find('a').filter((idx, elem) => elem.innerText.trim() === "+")[0];
buyButton = (name) => {
    var button = findButton(name);
    //might not have been enabled in the ui yet--after crafting a resource, you have to wait 1 tick
    if (button.hasClass("disabled")) {
        return 0;
    } else {
        button.click();
        return 1;
    }
}
tabBuyButton = (tab, name) => {
    return withTab(tab, () => buyButton(name));
}
Queueable = class {
    //TODO the naming conventions should be refactored to match Recipe
    constructor(name, tab, panel, maxPriority, masterPlan) {
        this.name = name;
        this.tab = tab;
        this.panel = panel;
        this.maxPriority = maxPriority;
        this.masterPlan = masterPlan;
    }
    buy(reserved) {
        var bought = withLeader(this.buyingLeader, () => tabBuyButton(this.tab, this.name));
        if (bought) {
            state.populationIncrease += housingMap[this.name] || 0;
            if (!this.noLog && this.getPrices().some(price => price.name === "gold")) {
                //log how many trades before buying a gold-cost building, so that in master plan mode, we can plan to buy at least that many trades first
                logTrades();
            }
            if (!this.noLog && this.getPrices().some(price => price.name === "faith")) {
                logFaith();
            }
        }
        return bought;
    }
    get buyingLeader() {
        //todo account for leader (scientist, philosopher) effects on prices
        return undefined;
    }
    getPrices() {
        throw new Error("Needs to be overridden");
    }
    isUnlocked() {
        return true;
    }
    isEnabled() {
        return this.isUnlocked();
    }
}
DataQueable = class extends Queueable {
    constructor(name, tab, panel, maxPriority, masterPlan) {
        super(name, tab, panel, maxPriority, masterPlan);
        this.data = this.getData();
    }
    get internalName() {
        return this.data.name;
    }
    getData() {
        throw new Error("Needs to be overridden");
    }
    getPrices() {
        return multiplyPrices(this.data.prices, Math.pow(this.data.priceRatio || 1, this.data.val || 0));
    }
    isUnlocked() {
        return this.data.unlocked && !this.data.researched;
    }
    isEnabled() {
        return super.isEnabled()
            && !state.disabledConverters[this.internalName]
            && (!["Barn", "Warehouse", "Harbour"].includes(this.name) || isStorageLimited(state.smartStorage))
            && (!this.data.val || !this.data.noStackable);
    }
    get once() {
        return this.data.noStackable;
    }
}
DataListQueueable = (dataList, leader) => class extends DataQueable {
    constructor(name, tab, panel, maxPriority, masterPlan) {
        super(name, tab, panel, maxPriority, masterPlan);
    }
    getData() {
        return dataList.find(data => data.label === this.name
            || data.title === this.name
            || data.stages && data.stages.some(stage => stage.label === this.name));
    }
    get buyingLeader() {
        return leader;
    }
}

getBuildingLabel = internalName => {
    var data = game.bld.get(internalName);
    return data.label || data.stages[data.stage].label;
}
Building = class extends DataListQueueable(game.bld.buildingsData) {
    constructor(name, tab, panel, maxPriority, masterPlan) {
        super(name, tab, panel, maxPriority, masterPlan);
    }
    getPrices() { 
        var prices = game.bld.getPrices(this.internalName);
        if (housingMap[this.name] && !(game.science.get("agriculture").researched && state.autoFarmer)) {
            prices = prices.concat({name: "catnip", val: getAdditionalCatnipNeeded(true, housingMap[this.name])});
        }
        return prices;
    }
}

Craft = class extends Queueable {
    constructor(name, tab, panel, maxPriority, masterPlan) {
        super(name, tab, panel, maxPriority, masterPlan);
        this.resName = getCraftInternalName(name);
    }
    buy() { 
        return craftOne(this.resName)
    }
    getPrices() { 
        return getCraftPrices(this.resName)
    }
    isEnabled() { 
        return canCraft(this.resName)
    }
}

Science = DataListQueueable(Object.values(game.science.metaCache), "Scientist")

WorkshopUpgrade = DataListQueueable(game.workshop.upgrades, "Scientist");

Space = class extends DataListQueueable(Object.values(game.space.metaCache)) {
    constructor(name, tab, panel, maxPriority, masterPlan) {
        super(name, tab, panel, maxPriority, masterPlan);
    }
    getPrices() { 
        return classes.ui.space.PlanetBuildingBtnController.prototype.getPrices.call(game.space, {metadata: this.data});
    }
}

OrderOfTheSun = class extends DataListQueueable(game.religion.religionUpgrades, "Philosopher") {
    constructor(name, tab, panel, maxPriority, masterPlan) {
        super(name, tab, panel, maxPriority, masterPlan);
    }
    isEnabled() {
        return super.isEnabled() && game.religion.faith >= this.data.faith;
    }
    getPrices() { 
        return multiplyPrices(super.getPrices(), 0.9);
    }
};

Ziggurats = DataListQueueable(game.religion.zigguratUpgrades);

Cryptotheology = DataListQueueable(game.religion.transcendenceUpgrades);

Trade = class extends DataListQueueable(game.diplomacy.races, "Merchant") {
    constructor(name, tab, panel, maxPriority, masterPlan) {
        //overwrite name with panel
        super(panel, tab, panel, maxPriority, masterPlan);
        this.quiet = true;
        this.noLog = true;
    }
    buy(reserved) {
        var quantityTraded = 0;
        if (state.api >= 1 || state.tradeTimer >= tradeTimerDuration || getResourceOwned("manpower") * 1.2 > getResourceMax("manpower") || this.overrideNeeds()) {
            if (this.overrideNeeds()) {
                makeRoomForTrades(this.panel);
            }
            withLeader("Merchant", () => {
                var prices = this.getPrices();
                if (state.api >= 1) {
                    var yieldResTotal = null;
                    while (canAfford(prices, reserved) && this.needProduct(1, yieldResTotal) && quantityTraded < 100000) {
                        prices.forEach(price => game.resPool.addResEvent(price.name, -price.val));
                        yieldResTotal = game.diplomacy.tradeInternal(game.diplomacy.races.find(race => race.title === this.panel), true, yieldResTotal);
                        quantityTraded++;
                    }
                    if (yieldResTotal) {
                        yieldResTotal = gainTradeResources(yieldResTotal);
                        updateTradeMessages(yieldResTotal, quantityTraded);
                    }
                } else {
                    withTab("Trade", () => {
                        if (!canAfford(prices, reserved)) console.error(reserved);
                        var maxClicks = 10;
                        while (maxClicks > 0 && canAfford(prices, reserved) && this.needProduct(1)) {
                            var allQuantity = Math.floor(Math.min(...prices.map(price => getResourceOwned(price.name) / price.val)));
                            buttons = getTradeButtons(this.panel).toArray().map((elem) => {
                                text = $(elem).text();
                                return {
                                    button: elem,
                                    quantity: text === "Send caravan" ? 1 : text === "all" ? allQuantity : text.replace("x", "") * 1
                                }
                            });
                            affordableButtons = buttons.filter((button) => canAfford(multiplyPrices(prices, button.quantity), reserved) && this.needProduct(button.quantity)); //always nonempty
                            targetButton = maxBy(affordableButtons, button => button.quantity);
                            targetButton.button.click();
                            quantityTraded += targetButton.quantity;
                            maxClicks--;
                        }
                    })
                }
                state.tradeTimer = 0;
            })
        }
        state.totalTrades += quantityTraded;
        return quantityTraded;
    }
    isEnabled() {
        return (this.needProduct(1) || this.overrideNeeds())
            && (this.bestSeason() || this.ignoreSeason())
            && (this.name !== "Leviathans" || game.diplomacy.get("leviathans").duration);
    }
    getPrices() { 
        return [{name: "manpower", val: 50}, {name: "gold", val: 15}].concat(this.data.buys);
    }
    needProduct(quantity, resourcesSoFar) {
        if (!resourcesSoFar) resourcesSoFar = {};
        return getTradeValue(this.panel, true).every(sell => 
            getResourceOwned(sell.name) * (this.overrideNeeds() ? 1 : 1.1)
                    + sell.val * quantity + (resourcesSoFar[sell.name] || 0)
                < getResourceMax(sell.name)
            || sell.name === "sorrow");
    }
    bestSeason() {
        return this.data.sells[0].seasons[seasonNames[game.calendar.season]] >= Math.max(...Object.values(this.data.sells[0].seasons))
    }
    overrideNeeds() {
        return isResourceFull("gold") && state.ignoreNeeds[this.panel] || state.ignoreNeeds[this.panel] >= 2;
    }
    ignoreSeason() {
        return isResourceFull("gold") && state.ignoreSeason[this.panel] || state.ignoreSeason[this.panel] >= 2;
    }
};

PraiseSun = class extends Queueable {
    constructor(name, tab, panel, maxPriority, masterPlan) {
        super(name, tab, panel, maxPriority, masterPlan);
        this.silent = true;
        this.noLog = true;
    }
    buy() {
        if (state.api >= 1) {
            game.religion.praise();
        } else {
            $('#fastPraiseContainer > a')[0].click();
        }
    }
    getPrices() {
        return [{ name: "faith", val: Math.min(getResourceOwned("faith"), .9 * getResourceMax("faith")) }];
    }
}
Transcend = class extends Queueable {
    constructor(name, tab, panel, maxPriority, masterPlan) {
        super(name, tab, panel, maxPriority, masterPlan);
        this.once = true;
    }
    buy() {
        withTab("Religion", () => { 
            var faithResetOnly = this.name !== "Transcend";
            var realConfirm = window.confirm;
            try {
                window.confirm = () => true;
                if (!faithResetOnly) findButton(this.name).click();
                $('a:contains("[Faith Reset]")')[0].click();
                $('#fastPraiseContainer > a').click();
            } finally {
                window.confirm = realConfirm;
            }
        });
    }
    getPrices() {
        return [{ name: "faith", val: .95 * getResourceMax("faith") }];
    }
}
HoldFestival = class extends Queueable {
    constructor(name, tab, panel, maxPriority, masterPlan) {
        super(name, tab, panel, maxPriority, masterPlan);
        this.quiet = true;
        this.noLog = true;
    }
    getPrices() {
        return [{ name: "manpower", val: 1500 }, { name: "culture", val: 5000 }, { name: "parchment", val: 2500 }];
    }
    isEnabled() {
        return game.calendar.festivalDays === 0;
    }
}
SendExplorers = class extends Queueable {
    constructor(name, tab, panel, maxPriority, masterPlan) {
        super(name, tab, panel, maxPriority, masterPlan);
        this.once = true;
    }
    getPrices() {
        return [{ name: "manpower", val: 1000 }];
    }
    //TODO detect when new races are available
}
FeedElders = class extends Queueable {
    constructor(name, tab, panel, maxPriority, masterPlan) {
        super(name, tab, panel, maxPriority, masterPlan);
        this.once = true;
    }
    getPrices() {
        return [{ name: "necrocorn", val: 1 }];
    }
    //TODO detect when new races are available
}

/************** 
 * Queue Management
**************/
disable = name => state.queue = state.queue.filter(bld => !(bld.name === name));
decreasePriority = name => {
    var item = findQueue(name);
    if (item) {
        if (item.maxPriority) {
            item.maxPriority = false;
            demote(name);
        } else {
            disable(name);
        }
    }
}
findQueue = name => state.queue.filter(bld => bld.name === name)[0];
getPriority = name => {
    var item = findQueue(name);
    if (item) {
        if (item.maxPriority) {
            return Infinity;
        } else {
            return 1;
        }
    } else {
        return 0;
    }
}
promote = name => { var item = findQueue(name); disable(name); if (item) state.queue.unshift(item); }
demote = name => { var item = findQueue(name); disable(name); if (item) state.queue.push(item); }
increasePriority = (name, tab, panel) => {
    var existing = findQueue(name);
    if (existing) {
        existing.maxPriority = true;
    } else {
        enable(name, tab, panel);
    }
}
enable = (name, tab, panel, maxPriority, masterPlan) => {
    var type;
    if (specialBuys[name]) type = specialBuys[name];
    else if (tab === "Bonfire") type = Building;
    else if (panel === "Crafting") type = Craft;
    else if (tab === "Science") type = Science;
    else if (tab === "Workshop") type = WorkshopUpgrade;
    else if (tab === "Space") type = Space;
    else if (tab === "Trade") type = Trade;
    else if (panel === "Order of the Sun") type = OrderOfTheSun;
    else if (panel === "Ziggurats") type = Ziggurats;
    else if (panel === "Cryptotheology") type = Cryptotheology;
    else console.error(tab + " tab not supported yet!");
    var created = new type(name, tab, panel);
    if (maxPriority) created.maxPriority = true;
    if (masterPlan) created.masterPlan = true;
    state.queue.push(created);
}

/************** 
 * Tabs
**************/
tabNumbers = { Bonfire: 1, Village: 2 } //these have changing names, but fixed position
openTab = name => {
    var tabButton = tabNumbers[name] ? getTabButtonByNumber(tabNumbers[name]) : getTabButtonByName(name);
    if (tabButton.length) {
        tabButton[0].click();
        return true;
    } else {
        console.error("Unable to open tab " + name)
        return false;
    }
}
getTabButtonByName = name => $('a.tab:contains("' + name + '")');
getTabButtonByNumber = tabNumber => $('a.tab:nth-of-type(' + tabNumber + ')');
withTab = (tab, op) => {
    if (tab === getActiveTab() || !tab) {
        return op();
    } else {
        var oldTab = $('a.tab.activeTab');
        var oldScroll = $("#midColumn").scrollTop();
        if (openTab(tab)) {
            try {
                return op();
            } finally {
                oldTab[0].click();
                $("#midColumn").scrollTop(oldScroll);
            }
        }
    }
}
getActiveTab = () => {
    return game.ui.activeTabId;
}

/************** 
 * Speed
**************/
setDesiredTicksPerLoop = desired => {
    if (desired >= 1) {
        state.desiredTicksPerLoop = desired;
    }
    setSpeed(state.speed);
}
setSpeed = spd => {
    if (spd >= 1) {
        state.speed = spd;
        state.ticksPerLoop = state.runInGameLoop ? state.desiredTicksPerLoop : Math.max(state.desiredTicksPerLoop, spd);
        state.delay = 200 * state.ticksPerLoop / spd
        updateApiLevel();
    }
    setRunning(state.running);
}
speedUp = () => setSpeed(state.speed * 2);
slowDown = () => setSpeed(state.speed / 2);
if (!game.realUpdateModel) game.realUpdateModel = game.updateModel;
game.updateModel = () => {
    if (!(state.disableTimeskip && game.isRendering)) {
        for (var i = 0; i < Math.min(state.speed, state.ticksPerLoop); i++) { 
            if (i !== 0) {
                game.calendar.tick();
                //speed must not be a multiple of 5; otherwise this will cause the tooltips to never update (ui.js uses ticks % 5)
                game.ticks++;
                //might be going so fast you would miss astro events
                if (state.autoSeti && game.calendar.observeBtn) game.calendar.observeHandler();
            }
            game.realUpdateModel(); 
        }
    }
}
if (!game.realRender) game.realRender = game.render;
game.render = () => {
    //game.render ultimately calls game.updateModel, causing a 1-tick timeskip every time you click a button
    game.isRendering = true;
    try {
        game.realRender();
    } finally {
        game.isRendering = false;
    }
}
//this makes the UI display the right /sec values but makes the calendar too fast
//if (!game.realGetRateUI) game.realGetRateUI = game.getRateUI
//game.getRateUI = () => state.speed * game.realGetRateUI();
setDesiredApiLevel = level => {
    if (level >= 0 && level <= 1) {
        state.desiredApi = level;
        updateApiLevel();
    }
}
moreApi = () => setDesiredApiLevel(state.desiredApi + 1);
lessApi = () => setDesiredApiLevel(state.desiredApi - 1);
updateApiLevel = () => {
    state.api = Math.max(state.desiredApi, state.speed > 1 ? 1 : 0);
}

/************** 
 * Running
**************/
setRunning = newRunning => {
    state.running = newRunning;
    if (state.running) {
        startLoop();
    } else {
        stopLoop();
    }
}
loopHandle = 0;
stopLoop = () => {
    clearInterval(loopHandle);
}
startLoop = () => { 
    stopLoop();
    if (state.runInGameLoop) {
        if (!(game.worker || game.useWorkers && game.isWebWorkerSupported())) {
            //need to restart the game loop to use our version of game.tick
            //technically we only need to do this once, even if we start and stop the bot, but it's fine to do it more
            game.start();
        }
    } else {
        loopHandle = setInterval(mainLoop, state.delay);
    }
    mainLoop();
}
if (!game.realTick) game.realTick = game.tick;
game.tick = () => {
    var runLoop = state.running && state.runInGameLoop;
    var ticks = runLoop ? state.speed / state.ticksPerLoop : 1;
    for (var tick = 0; tick < ticks; tick++) {
        game.realTick();
        if (runLoop) {
            if (state.loopsUntilRun <= 0) {
                mainLoop();
                state.loopsUntilRun = state.ticksPerLoop / state.speed - 1;
            } else {
                state.loopsUntilRun--;
            }
        }
    }
}

/************** 
 * Interface
**************/
ignoredButtons = ["Gather catnip", "Manage Jobs", "Promote kittens", "Clear", "Reset", "Tempus Stasit", "Tempus Fugit", "Sacrifice Unicorns", "Sacrifice Alicorns", "Refine Tears", "Refine Time Crystals", "Buy bcoin", "Sell bcoin"]
//we could add support for void space and chronoforge, but meh
ignoredPanels = ["Metaphysics", "Challenges", "Void Space", "Chronoforge"]
stateButtons = {
    "Send hunters": "autoHunt",
    "Steel": "autoSteel",
}
specialBuys = {
    "Hold Festival": HoldFestival,
    "Faith Reset": Transcend,
    "Transcend": Transcend,
    "Praise the sun!": PraiseSun,
    //allow refine catnip from Bonfire
    "Refine Catnip": Craft,
    "Send explorers": SendExplorers,
    "Feed elders": FeedElders,
}
getManagedItem = manageButton => trimButtonText($(manageButton).parent().find("span").first().text());
getPanelTitle = elem => getOwnText($(elem).parents('.panelContainer').children('.title')).trim();
updateButton = (elem, tab) => {
    var item = getManagedItem(elem);
    var panel = getPanelTitle(elem);
    if (ignoredButtons.includes(item) || ignoredPanels.includes(panel)) {
        $(elem).text("");
    } else {
        var value;
        var asInt = bool => bool ? 1 : 0;
        if (stateButtons[item] && tab !== "Science") {
            value = asInt(state[stateButtons[item]]);
        } else if (tab === "Village" && panel === "Jobs") {
            var jobName = getJobShortName(item);
            value = state.jobQueue.filter(job => job === jobName).length;
        } else if (tab === "Trade" && !specialBuys[item]) {
            value = getPriority(panel);
        //Bonfire page refine button has a lowercase c
        } else if (item === "Refine catnip") {
            value = getPriority("Refine Catnip");
        } else {
            value = getPriority(item);
        }
        var text = value === Infinity ? "∞" : value;
        $(elem).text(text);
    }
}
buttonClick = (elem, leftClick) => {
    var item = getManagedItem(elem);
    var tab = getActiveTab();
    var panel = getPanelTitle(elem);
    if (tab === "Trade" && !specialBuys[item]) item = panel;
    //Bonfire page refine button has a lowercase c
    if (item === "Refine catnip") item = "Refine Catnip";
    if (stateButtons[item] && tab !== "Science") {
        state[stateButtons[item]] = leftClick;
    } else if (panel === "Jobs") {
        var jobName = getJobShortName(item);
        if (leftClick) {
            state.jobQueue.push(jobName);
        } else {
            state.jobQueue = removeOne(state.jobQueue, jobName);
        }
    } else {
        if (leftClick) {
            increasePriority(item, tab, panel);
        } else {
            decreasePriority(item);
        }
    }
    updateButton(elem, tab);
}
updateManagementButtons = () => {
    $('div.btn.nosel:not(:has(>p))').prepend($('<p class="botManage" style="position: absolute; left: -13px; top: -4px" onclick="event.stopPropagation(); buttonClick(this, true)" oncontextmenu="event.stopPropagation(); event.preventDefault(); buttonClick(this, false)">0</p>'));
    var tabCache = getActiveTab();
    $("p.botManage").each((idx, elem) => updateButton(elem, tabCache));
}
ticksToDisplaySeconds = ticks => ticks === Infinity ? "???" : game.toDisplaySeconds(ticks / game.rate)
settingsMenu = [
    {
        name: "helpUpperRight",
        leftClick: () => $('#helpDiv').toggle(),
        rightClick: () => $('#helpDiv').hide(),
        getHtml: () => "Help"
    },
    {
        name: "botOn",
        leftClick: () => setRunning(true),
        rightClick: () => setRunning(false),
        getHtml: () => "Bot: " + (state.running ? "on" : "off")
    },
    {
        name: "gameSpeed",
        leftClick: speedUp,
        rightClick: slowDown,
        getHtml: () => "Game Speed: " + state.speed + "x"
            + (state.speed > 30 ? " <br />(right click<br />to lower)" : "")
    },
    {
        name: "botSpeed",
        leftClick: () => setDesiredTicksPerLoop(state.desiredTicksPerLoop / 2),
        rightClick: () => setDesiredTicksPerLoop(state.desiredTicksPerLoop * 2),
        getHtml: () => "Bot Speed: " + (state.desiredTicksPerLoop === state.ticksPerLoop ? "1/" + state.ticksPerLoop : "(1/" + state.ticksPerLoop + ")")
    },
    {
        name: "mainLoopMode",
        leftClick: () => { state.runInGameLoop = true; setSpeed(state.speed) },
        rightClick: () => { state.runInGameLoop = false; setSpeed(state.speed) },
        getHtml: () => "Bot Timer: " + (state.runInGameLoop ? "game" : "independent")
    },
    {
        name: "disableTimeskip",
        leftClick: () => state.disableTimeskip = true,
        rightClick: () => state.disableTimeskip = false,
        getHtml: () => "Timeskip bug: " + (state.disableTimeskip ? "fixed" : "normal")
    },
    {
        name: "apiLevel",
        leftClick: moreApi,
        rightClick: lessApi,
        getHtml: () => "API: " + (state.desiredApi ? "some" : state.api ? "(some)" : "none")
    },
    {
        name: "masterPlanMode",
        leftClick: () => state.masterPlanMode = 1,
        rightClick: () => { state.masterPlanMode = 0; clearMasterPlan() },
        getHtml: () => "Master Plan: " + (state.masterPlanMode ? "naive" : "off")
    },
    {
        name: "queueVerbosity",
        leftClick: moreVerbose,
        rightClick: lessVerbose,
        getHtml: () => "Up Next: " + (state.verboseQueue ? "verbose" : "concise")
    },
    {
        name: "smartStorage",
        leftClick: () => state.smartStorage = Math.min(2, state.smartStorage + 1),
        rightClick: () => state.smartStorage = Math.max(0, state.smartStorage - 1),
        getHtml: () => "Smart storage: " + ["off", "<br />aggressive", "<br />conservative"][state.smartStorage]
    },
    {
        name: "autoCraft",
        leftClick: () => setAutoCrafting(state.autoCraftLevel + 1),
        rightClick: () => setAutoCrafting(state.autoCraftLevel - 1),
        getHtml: () => "Auto Craft: " + ["off", "normal", "safe"][state.autoCraftLevel]
    },
    {
        name: "autoFarmer",
        leftClick: () => setAutoFarmer(1),
        rightClick: () => setAutoFarmer(0),
        getHtml: () => "Auto Farmer: " + ["off", "on"][state.autoFarmer]
            + "<br />(need " + game.getDisplayValueExt(getWinterCatnipStockNeeded(false)) + " catnip)"
            + "<br />farmer ratio: " + game.getDisplayValueExt(getFarmerEffectiveness())
    },
    {
        name: "autoConverters",
        leftClick: () => state.autoConverters = true,
        rightClick: () => { state.autoConverters = false; resetConverters() },
        getHtml: () => "Auto Converters: " + (state.autoConverters ? "on" : "off")
            + Object.keys(state.disabledConverters).filter(key => state.disabledConverters[key]).map(key => "<br />(disabled " + state.disabledConverters[key] + " " + key + "s)")
    },
    {
        name: "autoSeti",
        leftClick: () => state.autoSeti = true,
        rightClick: () => state.autoSeti = false,
        getHtml: () => "Auto SETI: " + (state.autoSeti ? "on" : "off")
    },
];
var eventHandler = action => event => {
    event.preventDefault();
    if (action) action();
    updateSettingsMenu();
};
createSettingsButton = data => {
    var button = $('<div id="' + data.name + '" style="margin-bottom: 5px">');
    button.click(eventHandler(data.leftClick));
    button.contextmenu(eventHandler(data.rightClick));
    return button;
}
createSettingsMenu = () => {
    $("#botSettings").remove()
    var botSettings = $('<div id="botSettings" style="position: absolute; top: 50px; right: 10px; z-index: 1">');
    settingsMenu.map(createSettingsButton).forEach(button => botSettings.append(button));
    $('#gamePageContainer').append(botSettings);
    updateSettingsMenu();
}
updateSettingsMenu = () => {
    settingsMenu.forEach(item => $('#' + item.name).html(item.getHtml()));
}
var rightOfButtonStyle = ' style="position: absolute; left: 270px; top: 7px; width: 270px; text-align: left"'
displayJobQueue = () => {
    var jobInfo = $("#jobInfo")
    if (!jobInfo.length) { jobInfo = $('<div id="jobInfo" style="float: right;">'); $("#gameContainerId > div.tabInner > div:nth-child(1) > div.container > table").after(jobInfo); }
    jobInfo.html("Job Queue: " + state.jobQueue.map(job => "<br />" + getJobLongName(job)).join(''))
}
displayTradeValues = () => {
    $("#gameContainerId div.trade-race > .left > div").toArray().forEach(div => {
        var elem = $(div);
        if (!elem.children(".buys, .sells").length) return;
        var resource = getResourceInternalName(getOwnText(elem)); 
        var kittenProduction = getResourcePerTickPerKitten(resource);
        var production = kittenProduction ? kittenProduction : getCraftingResourcePerTick(resource, new Reservations({}), true);
        if (production > 0) {
            if (resource === "catnip" && getFarmerEffectiveness() < 1) production /= getFarmerEffectiveness();
            var tradeInfo = elem.children(".tradeInfo");
            if (!tradeInfo.length) { tradeInfo = $("<span class=\"tradeInfo\">"); elem.append(tradeInfo); }
            var raceName = getPanelTitle(elem);
            var raceData = getTradeData(raceName);
            var ticks = 0;
            var amount;
            if (elem.children(".buys").length) {
                amount = getPrice(raceData.buys, resource);
                if (kittenProduction) ticks += 50 / getResourcePerTickPerKitten("manpower", "hunter");
            } else {
                amount = getPrice(getTradeValue(raceName), resource);
            }
            ticks += amount / production;
            tradeInfo.text(" (" + game.getDisplayValueExt(ticks) + (kittenProduction ? " cat*t)" : " t)"))
        }
    })
}
displayGoldValue = () => {
    var kittenGoldProduction = getResourcePerTickPerKitten("gold");
    if (kittenGoldProduction) {
        var goldInfo = $("#goldInfo")
        if (!goldInfo.length) { goldInfo = $('<div id="goldInfo" style="float: left; margin-top: -15px">'); $("#gameContainerId > .tabInner").prepend(goldInfo); }
        goldInfo.text("15 Gold: " + game.getDisplayValueExt(15 / kittenGoldProduction) + " cat*t")
    }
}
displayBlueprintValue = () => {
    if (canCraft("blueprint")) {
        var blueprintInfo = $("#blueprintInfo")
        if (!blueprintInfo.length) { blueprintInfo = $('<div id="blueprintInfo" style="float: left; margin-top: -15px; margin-right: 15px;">'); $("#gameContainerId > .tabInner").prepend(blueprintInfo); }
        var totalPrices = getTotalCraftPrices("blueprint");
        var scienceCost = getPrice(totalPrices, "science") / 10;
        var fursCost = getPrice(totalPrices, "furs") / 10;
        var scienceKittensTicks = scienceCost / getResourcePerTickPerKitten("science");
        var fursKittenTicks = fursCost / getFursPerHunt() * 100 / getResourcePerTickPerKitten("manpower");
        var totalKittenTicks = scienceKittensTicks + fursKittenTicks;
        blueprintInfo.text("Blueprints: " + game.getDisplayValueExt(totalKittenTicks) + " cat*t/trade")
    }
}
displayTradeAgressionSettings = () => {
    $("#gameContainerId div.panelContainer > .title").toArray().forEach(div => {
        var elem = $(div);
        var raceName = getPanelTitle(elem);
        ["ignoreNeeds", "ignoreSeason"].forEach(buttonType => {
            var button = $("#" + buttonType + raceName);
            if (!button.length) {
                var updateButton = () => $("#" + buttonType + raceName).html(buttonData.getHtml());
                var buttonData = {
                    name: buttonType + raceName,
                    leftClick: () => { state[buttonType][raceName] = Math.min(2, (state[buttonType][raceName] || 0) + 1); updateButton(); },
                    rightClick: () => { state[buttonType][raceName] = Math.max(0, (state[buttonType][raceName] || 0) - 1); updateButton(); },
                    getHtml: () => buttonType + ": " + ["never", "max gold", "always"][(state[buttonType][raceName] || 0)]
                }
                button = createSettingsButton(buttonData);
                button.css("margin-bottom", "0");
                button.css("margin-left", "10px");
                button.css("display", "inline-block");
                elem.append(button);
                updateButton();
            }
        })
    })
}
displayParagonInfo = () => {
    if (game.village.sim.getKittens() > 70) {
        var paragonInfo = $("#paragonInfo");
        if (!paragonInfo.length) { paragonInfo = $('<div id="paragonInfo" style="float: right">'); $("#gameContainerId > div > div.panelContainer:nth-child(2) > div.toggle").after(paragonInfo); }
        paragonInfo.html("Best resets (local maxima of paragon/y): <br />"
            + getBestResetPoint(state.history, true).slice(0, 5)
                .map(point => 
                    "Paragon: " + game.getDisplayValueExt(point.paragon)
                    + " Year: " +  game.getDisplayValueExt(point.year)
                    + " Per Year: " + game.getDisplayValueExt(point.ratio, false, false, 3)
                ).join("<br />")
        )
    }
}
displayPreviousHistoryInfo = () => {
    if (state.previousHistories.length > 0) {
        var pastParagonInfo = $("#pastParagonInfo");
        if (!pastParagonInfo.length) { pastParagonInfo = $('<div id="pastParagonInfo">'); $("#gameContainerId > div.tabInner").append(pastParagonInfo); }
        pastParagonInfo.html("Past resets: <br />"
            + state.previousHistories
                .map(history => history.find(event => event.type === "Reset"))
                .map(point => 
                    "Paragon: " + game.getDisplayValueExt(point.kittens - 70)
                    + " Year: " +  game.getDisplayValueExt(point.year + point.day / 400)
                    + " Per Year: " + game.getDisplayValueExt((point.kittens - 70) / (point.year + point.day / 400), false, false, 3)
                ).join("<br />")
        )
    }
}
getBaseFaithProductionBonus = faith => {
    var rate = game.religion.getRU("solarRevolution").on ? game.getTriValue(faith, 1000) : 0;
    return game.getHyperbolicEffect(rate, 1000);
}
getFaithProductionBonus = faith => {
    //from religion.getProductionBonus; now accepts faith parameter
    var atheismBonus = game.challenges.getChallenge("atheism").researched ? game.religion.getTranscendenceLevel() * 0.1 : 0;
    var blackObeliskBonus = game.religion.getTranscendenceLevel() * game.religion.getTU("blackObelisk").val * 0.005;
    return getBaseFaithProductionBonus(faith) * (1 + atheismBonus + blackObeliskBonus);
}
getIncreasedFaith = (praised, faithBonus, ticks) => {
    //try not to spend too much time on this math
    var maxIterations = 20;
    var ticksPerIteration = ticks / state.ticksPerLoop > maxIterations ? Math.ceil(ticks / maxIterations) : state.ticksPerLoop;
    var baseFaithProduction = getEffectiveResourcePerTick("faith") / (1 + getFaithProductionBonus(praised));
    var basePraisedProduction = baseFaithProduction * faithBonus;
    var totalPraised = praised;
    var totalIncreasedProduction = 0;
    for (var ticksSoFar = 0; ticksSoFar < ticks;) {
        var ticksPassed = Math.min(ticksPerIteration, ticks - ticksSoFar);
        totalIncreasedProduction += ticksPassed * (1 + getFaithProductionBonus(totalPraised));
        totalPraised += basePraisedProduction * ticksPassed * (1 + getFaithProductionBonus(totalPraised));
        ticksSoFar += ticksPassed;
    }
    return { totalPraised, totalIncreasedProduction };
}
//if min or max is infinite, guess must be nonzero
binarySearch = (lessThan, min, max, guess, maxIterations, precision) => {
    if (maxIterations <= 0 || max - min < precision) {
        return { min, max };
    }
    if (lessThan(guess)) {
        var newGuess = min === -Infinity ? (guess > 0 ? -guess : guess * 2) : (guess + min) / 2;
        return binarySearch(lessThan, min, guess, newGuess, maxIterations - 1, precision);
    } else {
        var newGuess = max === Infinity ? (guess > 0 ? guess * 2 : -guess) : (guess + max) / 2;
        return binarySearch(lessThan, guess, max, newGuess, maxIterations - 1, precision);
    }
}
displayFaithResetPayoff = () => {
    //TODO double check this
    if (game.religion.faith >= game.religion.getRU("apocripha").faith && getEffectiveResourcePerTick("faith") > 0) {
        var apocryphaInfo = $("#apocryphaInfo");
        if (!apocryphaInfo.length) { apocryphaInfo = $('<div id="apocryphaInfo"' + rightOfButtonStyle + '>'); findButton("Apocrypha").prepend(apocryphaInfo); }
        var timeToMaxFaith = Math.ceil(getResourceMax("faith") / getEffectiveResourcePerTick("faith"))
        var getFaithBonus = faithRatio => game.religion.getTriValueReligion(faithRatio);
        var bonusRatioGained = game.religion.getApocryphaResetBonus(1.01);
        var faithBonus = game.religion.getFaithBonus();
        var increasedFaithBonus = getFaithBonus(game.religion.faithRatio + bonusRatioGained);
        var reducedPraised = getResourceMax("faith") * (1 + increasedFaithBonus);
        //alternative: don't reset faith
        var alternativePraised = getIncreasedFaith(game.religion.faith, faithBonus, timeToMaxFaith).totalPraised;

        var faithPaidOff = ticks => getIncreasedFaith(reducedPraised, increasedFaithBonus, ticks).totalPraised
                > getIncreasedFaith(alternativePraised, faithBonus, ticks).totalPraised;
        var productionPaidOff = ticks => getIncreasedFaith(reducedPraised, increasedFaithBonus, ticks).totalIncreasedProduction
                > getIncreasedFaith(alternativePraised, faithBonus, ticks).totalIncreasedProduction;
        var faithPayoffEstimate = binarySearch(faithPaidOff, 0, Infinity, timeToMaxFaith, 20, 1);
        //don't want a zero or infinite guess
        var productionPayoffGuess = faithPayoffEstimate.max === Infinity ? faithPayoffEstimate.min * 2 : faithPayoffEstimate.max * 2;
        var productionPayoffEstimate = binarySearch(productionPaidOff, 0, Infinity, productionPayoffGuess, 20, 1);

        var getDisplay = estimate => estimate.max - estimate.min < 5 ? 
            ticksToDisplaySeconds(estimate.max) 
            : ticksToDisplaySeconds(estimate.min) + " - " + ticksToDisplaySeconds(estimate.max)
        apocryphaInfo.html(" (" + getDisplay(faithPayoffEstimate) + " faith payback)"
            + "<br /> (" + getDisplay(productionPayoffEstimate) + " production payback)")
    }
}
displayApocryphaNeededToTranscend = () => {
    if (game.religion.faith >= game.religion.getRU("transcendence").faith) {
        var transcendenceInfo = $("#transcendenceInfo");
        if (!transcendenceInfo.length) { transcendenceInfo = $('<div id="transcendenceInfo"' + rightOfButtonStyle + '>'); findButton("Transcendence").prepend(transcendenceInfo); }
        var tclevel = game.religion.getTranscendenceLevel();
        var apocryphaNeeded = game.religion.getTranscendenceRatio(tclevel+1) - game.religion.getTranscendenceRatio(tclevel);
        var percentageOwned = game.religion.faithRatio / apocryphaNeeded * 100;
        transcendenceInfo.text(" (" + game.getDisplayValueExt(percentageOwned) + "% of apocrypha needed)");
    }
}
displayAutoResetSettings = () => {
    if (game.religion.getRU("apocripha").val) {
        $("#gameContainerId div.panelContainer > .title").toArray().forEach(div => {
            var elem = $(div);
            if (getPanelTitle(elem) !== "Order of the Sun") return;
            var autoResetButton = $("#autoResetButton");
            if (!autoResetButton.length) {
                var updateButton = () => $("#autoResetButton").html(buttonData.getHtml());
                var buttonData = {
                    name: "autoResetButton",
                    leftClick: () => { state.autoReset = Math.min(1000, state.autoReset + 100); updateButton(); },
                    rightClick: () => { state.autoReset = Math.max(100, state.autoReset - 100); updateButton(); },
                    getHtml: () => "Auto Reset: " + (state.autoReset === 1000 ? "never" : state.autoReset + "%")
                }
                autoResetButton = createSettingsButton(buttonData);
                autoResetButton.css("float", "right");
                elem.append(autoResetButton);
                updateButton();
            }
        })
    }
}
var starchartBuildings = ["Satellite", "Research Vessel", "Space Beacon"]
displayStarchartPayoffs = () => {
    starchartBuildings.forEach(name => {
        var button = findButton(name);
        if (button.length) {
            var panel = getPanelTitle(button);
            var bld = new Space(name, "Space", panel);
            var starchartPrice = getPrice(bld.getPrices(), "starchart")
            var starchartProduction = bld.getData().effects.starchartPerTickBaseSpace * getResourceProductionRatio("starchart");
            var starchartPayoff = starchartPrice / starchartProduction;
            
            var starchartInfo = button.children(".starchartInfo");
            if (!starchartInfo.length) { starchartInfo = $('<div class="starchartInfo"' + rightOfButtonStyle + '>'); button.append(starchartInfo); }

            starchartInfo.text("Starchart payoff: " + ticksToDisplaySeconds(starchartPayoff))
        }
    })
}
var spaceProductionBonusBuildings = ["Space Elevator", "Orbital Array"]
displayUnobtainiumPayoffs = () => {
    spaceProductionBonusBuildings.forEach(name => {
        var button = findButton(name);
        if (button.length) {
            var panel = getPanelTitle(button);
            var bld = new Space(name, "Space", panel);
            var unobtainiumPrice = getPrice(bld.getPrices(), "unobtainium") + getIngredientsNeeded({name: "eludium", val: getPrice(bld.getPrices(), "eludium")})[0].val
            var spaceProductionBonus = bld.getData().effects.spaceRatio;
            //spaceRatio calculation from calcResourcePerTick
            spaceProductionBonus *= 1 + game.workshop.get("spaceManufacturing").researched * game.bld.get("factory").on * game.bld.get("factory").effects.craftRatio * .75;
            //assumes all unobtainium is produced from PerTickSpace sources, like Lunar Outpost
            var unobtainiumProduction = spaceProductionBonus * game.getEffect("unobtainiumPerTickSpace");
            var unobtainiumPayoff = unobtainiumPrice / unobtainiumProduction;
            
            var unobtainiumInfo = button.children(".unobtainiumInfo");
            if (!unobtainiumInfo.length) { unobtainiumInfo = $('<div class="unobtainiumInfo"' + rightOfButtonStyle + '>'); button.append(unobtainiumInfo); }

            unobtainiumInfo.text("Unobtainium payoff: " + ticksToDisplaySeconds(unobtainiumPayoff))
        }
    })
}
specialUis = {
    Village: () => {
        displayJobQueue();
    },
    Trade: () => {
        displayTradeValues();
        displayGoldValue();
        displayBlueprintValue();
        displayTradeAgressionSettings();
    },
    Religion: () => {
        displayApocryphaNeededToTranscend();
        displayFaithResetPayoff();
        displayAutoResetSettings();
    },
    Space: () => {
        displayStarchartPayoffs();
        displayUnobtainiumPayoffs();
    },
    Time: () => {
        displayParagonInfo();
        displayPreviousHistoryInfo();
    },
}
updateUi = () => {
    updateManagementButtons();
    updateSettingsMenu();
    specialUi = specialUis[getActiveTab()];
    if (specialUi) specialUi();
}

/************** 
 * Initialize
**************/
loadUnicornRecipes();
if (window.state) {
    loadDefaults();
    //if we've updated class behavior, get the new behavior
    reloadQueue(state.queue);
    initialize();
} else {
    load();
}
log("Simba loaded")
/*
todo:
buy script (-> genetic algorithm)
--master plan mode
----separate state and config variables
----goals: concrete, moon, eludium, beyond
----big queue of jobs, techs, upgrades
------techs and upgrades built from (queue slots since unlock, isBought)
----handle queued items whose resources have no production
------require effective production > 0 || enough supply already
--------might need to improve effective production calculation
----------ensure craftables have enough storage
--strategy viability
----exclude useless techs
------mint, (ziggurat), barges, steel plants, workshop automation, advanced automation, pneumatic press, factory optimization, factory robotics, seti, ecology, unicorn selection, artificial intelligence, metaphysics, cryptotheology
----questionable techs
------nuclear fission, biochemistry, genetics, telecommunication
----optional techs
------architecture, acoustics, drama and poetry, biology, combustion, metallurgy, robotics
--run scoring
----10pt per science, building type
----5pt per kitten
----2pt per upgrade
----1pt per building
----1pt per %faith bonus
----2000pt if moon +1pt/day early
--compare with human performance
----human vs. human + bot vs. master plan
----human plays 10min/2hr (+10min at start of game?)
------after 10min passed, pause game; once ready, fast forward 1:50 and then pause
----time to moon, paragon/hr (go for unobtainium huts; use best paragon/hr)
------graph #technologies, #kittens
trade calculations -> needsResource function
--can get stuck needing titanium but with too much iron
----compare the ticks produced to decide titanium is more important?
--can get stuck with max titanium and no steel
----trade with dragons? low quantity might not be worth it
----better to keep trading with zebras than to trade with griffins sometimes
--trade more like crafting
----like faith, log how many trades were made before a building costing gold was bought; reserve that much gold
------need to figure out how to have the gold reserved from the building but not the trade
--calculate resouce per kitten for trades
faith reset without transcending
improve performance at high speeds
--lag indicator (ticks/sec)
energy calculations
improve interface
--buy quantity: 0, 1/2, 1, 2, infinity
----1/2: when none of your craft chain is reserved, become normal and go to end of queue
------maybe instead, only enabled when the resource is full, holding more than 2x the amount needed for the entire queue
----2: queued twice
--turn off Up Next, hide settings menu
--right click a job in the queue to remove it
reserve ivory like furs
early game needs:
--job management
----wood/catnip efficiency
------factor in skill learning rate (give 5% leeway if kitten is already better at its current job?)
----set next job based on highest need in queue (measured in ticks)?
----unassign scholars when useless (reassign?)
----wood/geologist efficiency (for trade)
----job ratio, change ratio with upgrades?
--promote leader
--try harder to get rid of ivory??
--don't spam First time crafting foobar if it's reduced to 0 (eg. negative production)
organize code (but it has to be one file :/)
reservations seems still not correct (crafting too early)
--eg blueprint need, with enough compendiums, still reserves
--kittens can still starve in cold winter??? doesn't seem to be reserving properly
----might have been a race condition with the first day of winter
log human actions?
don't craft away Chronosphere resources
check for updates
payoff time for buildings
fix once for buildings--check at time of buy
populationIncrease has problems, ever since the kittensAssigned added
--fix when two kittens arrive in one loop
deal with building upgrades (or maybe just don't; might be optimal)
mode to not craft compendiums
add extra info to help
allow buying stuff with cost between safe storage and actual storage
--when all resources are close to full, allow them to become completely full
can't get religion bonus while on religion tab
selling buildings isn't noticed
*/