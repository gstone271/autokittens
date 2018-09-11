//Paste the contents of this file directly into the developer console
if (window.stopLoop) stopLoop();
$("#botInfo").remove()
$('#gamePageContainer').append($('<div id="botInfo" style="position: absolute; bottom: 50px; right: 10px;">'))

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
logReset = () => addLog({ name: "Reset", type: "Reset", kittens: game.village.sim.getKittens()});
rotateLogs = () => {
    state.previousHistories.push(state.history);
    state.history = [];
}
if (!game.realResetAutomatic) game.realResetAutomatic = game.resetAutomatic;
game.resetAutomatic = () => {
    logFaith();
    logReset();
    rotateLogs();
    state.queue = []; //todo reload master plan
    state.numKittens = 0;
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
    if (kittens > state.numKittens) {
        state.numKittens = kittens;
        logKitten(kittens, newJob)
    }
}

/************** 
 * Save/Load
**************/
save = () => { localStorage.setItem("autokittens.state", exportSave()); console.log("Bot state saved"); }
loadString = string => {
    var parsed = JSON.parse(LZString.decompressFromBase64(string));
    var rawQueue = parsed.queue;
    parsed.queue = [];
    state = parsed;
    reloadQueue(rawQueue);
}
exportSave = () => LZString.compressToBase64(JSON.stringify(state));
importSave = saveString => {
    loadString(saveString);
    loadDefaults();
    initialize();
}
reloadQueue = queue => {
    state.queue = [];
    queue.forEach(item => enable(item.name, item.tab, item.panel));
}
load = () => {
    data = localStorage.getItem("autokittens.state");
    if (data) {
        loadString(data);
    }
    loadDefaults();
    initialize();
}
loadDefaults = () => {
    if (!window.state) state = {};
    if (!state.defaultJob) state.defaultJob = "Woodcutter";
    if (!state.populationIncrease) state.populationIncrease = 0;
    if (!state.tradeTimer) state.tradeTimer = 0;
    if (!state.speed) state.speed = 1;
    if (!state.queue) state.queue = [];
    if (!state.ticks) state.ticks = game.ticks;
    if (!state.history) state.history = [];
    if (!state.previousHistories) state.previousHistories = [];
    if (!state.numKittens) state.numKittens = game.village.sim.getKittens();
    if (!state.desiredApi) state.desiredApi = 0;
    if (!state.verboseQueue) state.verboseQueue = 0;
    if (!window.botDebug) botDebug = {};
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
wipeBotSave = () => localStorage.removeItem("autokittens.state");
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
reserveBufferTime = game.rate * 60 * 5; //5 minutes: reserve enough of non-limiting resources to be this far ahead of the limiting resource
findPriorities = (queue, reserved) => {
    if (queue.length == 0) return [];
    var found = queue[0];
    var prices = found.getPrices();
    if (!found.isEnabled() || !haveEnoughStorage(prices, reserved)) return findPriorities(queue.slice(1, queue.length), reserved);
    var unavailableResources = prices.map(price => price.name).filter(res => (reserved[res] || 0) > getResourceOwned(res));
    var viable = unavailableResources.length ? false : true;
    var canAffordOne = price => getResourceOwned(price.name) - (reserved[price.name] || 0) > price.val;
    var getTicksToEnough = price => //ticks until you have enough. May be infinite or negative
        (price.val + (reserved[price.name] || 0) - getResourceOwned(price.name)) / getEffectiveResourcePerTick(price.name, false, reserved);
    var unaffordablePrices = prices.filter(price => !canAffordOne(price));
    //todo: this isn't correct for repeat prices (eg steel + gear). but the reserveBufferTime helps
    var ticksNeeded = Math.max(0, Math.max(...unaffordablePrices.map(getTicksToEnough)) - reserveBufferTime);
    //assumes the price is unaffordable
    var isLimitingResource = price => getTicksToEnough(price) >= ticksNeeded;
    //if the resource is craftable, need to figure out which of its components is limiting
    //ticksNeeded is ok
    var getIngredientsNeeded = price => (canCraft(price.name) ? multiplyPrices(getCraftPrices(price.name), Math.ceil(price.val / getCraftRatio(price.name)) ) : [])

    var newReserved = Object.assign({}, reserved);
    var limitingResources = {};
    //amount to reserve, if you will have ticks production
    var getEnoughForTicks = (price, ticks) => Math.max(0, (newReserved[price.name] || 0) + price.val - (ticks * getEffectiveResourcePerTick(price.name, false, newReserved) || 0))
    var reserveNonLimiting = price => newReserved[price.name] = (newReserved[price.name] || 0) + getEnoughForTicks(price, ticksNeeded);
    var reserveLimiting = price => {
        newReserved[price.name] = (newReserved[price.name] || 0) + price.val;
        limitingResources[price.name] = true;
    }
    prices.filter(canAffordOne).forEach(reserveNonLimiting);
    //don't reserve infinity?
    var getShortage = price => ({ name: price.name, val: Math.max(0, (newReserved[price.name] || 0) - getResourceOwned(price.name) + price.val) })
    var shortages = unaffordablePrices;
    var maxDepth = 10;
    while (shortages.length) {
        if (!maxDepth--) {
            //if the game ever lets you craft scaffold back into catnip...
            console.error("Infinite loop finding shortages:")
            console.error(shortages)
            break;
        }
        shortages.filter(isLimitingResource).forEach(reserveLimiting);
        shortages.filter(price => !isLimitingResource(price)).forEach(reserveNonLimiting);
        shortages = flattenArr(shortages.map(getIngredientsNeeded)).map(getShortage);
    }
    return [{bld: found, reserved: reserved, viable: viable, unavailable: unavailableResources, limiting: Object.keys(limitingResources)}]
        .concat(findPriorities(queue.slice(1, queue.length), newReserved));
}
subtractUnreserved = (reserved, bought) => {
    var newReserved = Object.assign({}, reserved);
    Object.keys(bought).forEach(res => newReserved[res] = (newReserved[res] - bought[res]) || 0)
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
             + " (" + Array.from(new Set(plan.limiting.concat(plan.unavailable))).join(", ") + ")</span>"
    } else {
        filter = plan => plan.viable;
        getHtml = plan => plan.bld.name;
    }
    $("#botInfo").html("Up next: <br />" + priorities.filter(filter).map(getHtml).join("<br />"));
}
buyPrioritiesQueue = (queue) => {
    var priorities = findPriorities(queue, {catnip: getWinterCatnipStockNeeded(canHaveColdSeason()), furs: getFursStockNeeded()});
    botDebug.priorities = priorities;
    updateUpNext(priorities);
    var bought = tryBuy(priorities);
    return updateQueue(queue, bought);
}

/************** 
 * Main Loop
**************/
mainLoop = () => {
    gatherIntialCatnip();
    preventStarvation();
    if (state.autoSteel) craftAll("steel")
    //todo make trades try harder to do more
    if (isResourceFull("gold")) state.queue.filter(bld => bld.constructor.name === "Trade" && bld.isEnabled()).forEach(bld => promote(bld.name));
    state.queue = buyPrioritiesQueue(state.queue);
    doAutoCraft();
    additionalActions.forEach(action => action());
    updateManagementButtons();
    updateSettingsMenu();
    var ticksPassed = game.ticks - state.ticks;
    if (ticksPassed !== state.ticksPerLoop) console.log(ticksPassed + " ticks passed (expected " + state.ticksPerLoop + ")")
    state.ticks = game.ticks;
}
additionalActions = [
    () => $('#observeBtn').click(),
    () => { 
        if (state.autoHunt && (isResourceFull("manpower") || getTotalDemand("manpower") === 0) && getResourceOwned("manpower") >= 100) { 
            withLeader("Manager", () => $('a:contains("Send hunters")')[0].click())
        }
    },
    () => {
        if (state.populationIncrease > 0 && getTabButtonByNumber(tabNumbers.Town).text().includes("(")) {
            var job = getJobShortName(state.defaultJob);
            //it's actually possible to cheat and click on a button that hasn't been revealed yet
            if (!isJobEnabled(job)) job = "woodcutter";
            withTab("Town", () => {
                getJobButton(job).click();
                log("Assigned new kitten to " + job);
            });
            state.populationIncrease--;
            recountKittens(job);

        }
    },
    () => state.tradeTimer++,
]

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
//TODO calculate if resource production is zero (getEffectiveProduction -- make sure all events are ok)
//TODO if res is full and its crafts are not demanded but its conversion components are, shutoff conversion to res (and disable production of more conversion?)
getTotalDemand = res => {
    //this could be optimized a lot...
    var prices = flattenArr(state.queue.map(bld => bld.getPrices()).filter(prices => haveEnoughStorage(prices, {})));
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
getSafeStorage = res => {
    var max = getResourceMax(res);
    return max === Infinity ? max : max - state.ticksPerLoop * getEffectiveResourcePerTick(res, true, {});
}
//TODO don't use this for upgrades--particularly, photolithography will be delayed
//--when all resources are close to full, allow them to become completely full
//--don't include resources that can't be crafted yet
haveEnoughStorage = (prices, reserved) => prices.every(price => getSafeStorage(price.name) >= price.val + (reserved[price.name] || 0))
canAfford = (prices, reserved) => prices.every(price => getResourceOwned(price.name) - (reserved[price.name] || 0) >= price.val);
isResourceFull = res => getResourceOwned(res) > getSafeStorage(res);
//todo factor in crafting?????
getEffectiveResourcePerTick = (res, bestCase, reserved) => {
    var resourcePerTick = game.getResourcePerTick(res, true);
    //todo: doesn't account for metaphysics upgrades
    if (res === "science" || res === "starchart" && game.science.get("astronomy").researched) {
        var astronomicalEventChance = bestCase ? 1 : Math.min((25 / 10000) + game.getEffect("starEventChance"), 1);
        var eventsPerTick = astronomicalEventChance * game.calendar.dayPerTick;
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
        var meteorChance = bestCase ? 1 : 10 / 10000;
        var eventsPerTick = meteorChance * game.calendar.dayPerTick;
        var valuePerEvent;
        if (res === "minerals") {
            valuePerEvent = 50 + 25 * game.getEffect("mineralsRatio");
        } else {
            valuePerEvent = 15 * ( 1 + game.getEffect("scienceRatio"));
        }
        resourcePerTick += eventsPerTick * valuePerEvent;
    }
    //don't bother with the other possible events; they don't have capacities
    if (res === "steel" && state.autoSteel || canCraft(res)) {
        //once we're willing to chain craft catnip this will be wrong due to seasons
        //don't worry about it for now
        var prices = getCraftPrices(res);
        /* want to just say if reserved is less than current
         * , but that wouldn't account for resources we expect to have production on
         * maybe note the amount of ticks of production reserved?
         * TODO This might be wrong in the case where you have a bunch of things limited 
         * on different rare resources, not reserving a shared common resources;
         * the common resource might be overspent
         */
        if (res === "steel" || prices.every(price => !reserved[price.name])) {
            //special case steel: we always craft it
            resourcePerTick += getCraftRatio(res) * Math.min(...prices.map(price => 
                getEffectiveResourcePerTick(price.name, bestCase, reserved) / price.val
            ))
        }
    }
    //todo production from trade???? maybe just blueprints based on gold income?? needs more consistent trading
    //todo production from hunting?
    return resourcePerTick;
}

/************** 
 * Crafting
**************/
getCraftPrices = craft => { return game.workshop.getCraft(craft).prices }
multiplyPrices = (prices, quantity) => prices.map(price => ({ name: price.name, val: price.val * quantity }))
findCraftAllButton = (name) => $('div.res-row:contains("' + getResourceTitle(name) + '") div.craft-link:contains("all")')[0]
craftFirstTime = name => {
    if (canAfford(getCraftPrices(name), {})) {
        withTab("Workshop", () => {
            var longTitle = getResourceLongTitle(name);
            log("First time crafting " + longTitle, true);
            findButton(longTitle).click();
        })
    }
}
craftAll = name => {
    var button = findCraftButtonValues(name, 1).pop(); 
    if (button) button.click(); 
}
findCraftButtons = (name) => $('div.res-row:contains("' + getResourceTitle(name) + '") div.craft-link:contains("+")');
findCraftButtonValues = (craft, craftRatio) => {
    if (!canCraft(craft)) {
        return [];
    } else if (craft === "wood" && game.bld.get("workshop").val === 0) {
        return [{click: () => withTab("Bonfire", () => findButton("Refine catnip").click()), times: 1, amount: craftRatio}]
    } else if (getResourceOwned(craft) === 0) {
        return [{click: () => craftFirstTime(craft), times: 1, amount: craftRatio}]
    } else {
        //TODO finding these buttons is significant performance (28% of total); just bypass them in api: some
        var craftAllButton = findCraftAllButton(craft);
        var craftAllTimes = Math.min(...getCraftPrices(craft).map(price => Math.floor(getResourceOwned(price.name) / price.val)));
        return findCraftButtons(craft).toArray().map((button) => {
            var craftTimes = Math.round($(button).text() / craftRatio);
            var craftAmount = craftTimes * craftRatio
            return {click: button.click.bind(button), times: craftTimes, amount: craftAmount};
        }).concat(craftAllButton ? {click: () => craftAllButton.click(), times: craftAllTimes, amount: craftAllTimes * craftRatio } : []);
    }
}
craftOne = name => { var button = findCraftButtonValues(name, getCraftRatio(name))[0]; if (button) { button.click(); return button.amount; } else { return 0; } }
haveEnoughCraft = (res, amount) => {
    return getResourceMax(res) === Infinity 
        && !state.queue.map(bld => bld.getPrices())
            .concat(game.science.techs.filter(tech => tech.unlocked && !tech.researched)
            .map(tech => tech.prices))
            .some(prices => getResourceOwned(res) - amount < getPrice(prices, res))
        //TODO use the reservations in the queue instead
        && (res !== "furs" || getResourceOwned(res) - amount > 500)
}
shouldAutoCraft = (res, amount) => isResourceFull(res) || haveEnoughCraft(res, amount)
autoCrafts = game.workshop.crafts
    //parchment is needed to spend culture and science autocrafting
    .filter(craft => craft.prices.some(price => getResourceMax(price.name) < Infinity || craft.name === "parchment"))
doAutoCraft = () => {
    autoCrafts.forEach(craft => {
        if (canCraft(craft.name)) {
            var maxCrafts = 10; //don't expect to need this many clicks, prevent something bad
            var craftRatio = getCraftRatio(craft.name);
            while (craft.prices.every(price => shouldAutoCraft(price.name, price.val)) && maxCrafts--) {
                var craftButtons = findCraftButtonValues(craft.name, craftRatio);
                var targetButton = craftButtons[0]
                if (!targetButton) {
                    //button hasn't shown up yet (we just crafted one of the requirements)
                    break;
                }
                if (craft.name === "wood") {
                    //special case: only craftable resource where the craft target has a max capacity
                    var maxBeamCrafts = 10; //also useful in case we try to autocraft catnip before we have a workshop
                    while (getResourceOwned(craft.name) + targetButton.amount > getResourceMax(craft.name) && maxBeamCrafts--) {
                        craftOne("beam");
                    }
                }
                craft.prices.filter(price => getResourceOwned(price.name) >= getResourceMax(price.name)).forEach(price => console.log("Warning: " + price.name + " full (did the bot lag?)"))
                targetButton.click();
            }
        }
    });
}
canCraft = resInternalName => {
    var craftData = game.workshop.getCraft(resInternalName);
    //construction required for first craft, though it is possible to cheat and click the buttons before they're shown 
    return craftData && craftData.unlocked && ((game.bld.get("workshop").val && game.science.get("construction").researched) || resInternalName === "wood");
}
getAdditionalNeeded = (prices, reserved) => 
    prices
        .map(price => ({ name: price.name, val: (price.val + (reserved[price.name] || 0) - getResourceOwned(price.name))}))
        .filter(price => price.val > 0);
craftAdditionalNeeded = (prices, reserved) =>
    getAdditionalNeeded(prices, reserved)
        .filter(price => canCraft(price.name))
        .filter(price => price.val < Infinity)
        .forEach(price => makeCraft(price.name, price.val, reserved));
getCraftRatio = res => game.getResCraftRatio({ name: res }) + 1;
makeCraft = (craft, amountNeeded, reserved) => {
    var craftRatio = getCraftRatio(craft);
    var prices = getCraftPrices(craft);
    var timesToCraft = Math.ceil(amountNeeded / craftRatio);
    var totalPrices = multiplyPrices(prices, timesToCraft);
    craftAdditionalNeeded(totalPrices, reserved);
    if (canAfford(totalPrices, reserved)) {
        var maxClicks = 20;
        while (maxClicks > 0 && timesToCraft > 0) {
            var craftButtons = findCraftButtonValues(craft, craftRatio);
            if (!craftButtons.length) {
                //button hasn't shown up yet (we just crafted one of the requirements)
                break;
            }
            var targetButton = craftButtons.reduce((smallerButton, biggerButton) => 
                biggerButton.times < timesToCraft ? biggerButton : smallerButton
            )
            targetButton.click();
            timesToCraft -= targetButton.times;
            maxClicks--;
        }
    } else if (prices.every(price => !reserved[price.name])) {
        craftAll(craft);
    }
}

/************** 
 * Starvation
**************/
//todo: all of this is wrong in accelerated time
//but the calendar speed is also bugged in accelerated time, wait for fix
canHaveColdSeason = () => game.calendar.year < 4;
getWinterCatnipProduction = isCold => {
    return getSeasonalCatnipProduction(isCold ? .1 : .25);
}
getSeasonalCatnipProduction = weatherMod => {
    //calcResourcePerTick always uses the current weather--adjust this away
    var currentWeather = game.calendar.getWeatherMod();
    var adjustedSeason = { modifiers: { catnip: weatherMod - currentWeather } }
    return game.calcResourcePerTick("catnip", adjustedSeason) + game.getResourcePerTickConvertion("catnip");
}
ticksPerSeason = () => 100 / game.calendar.dayPerTick;
ticksLeftInSeason = () => (100 - game.calendar.day) / game.calendar.dayPerTick;
getExpectedCatnipBeforeWinter = () => {
    if (game.calendar.season === 3) return 0;
    return game.getResourcePerTick("catnip", true) * ticksLeftInSeason()
        + (2 - game.calendar.season) * getSeasonalCatnipProduction(1) * ticksPerSeason();
}
//todo: warn when you don't have enough catnip
getWinterCatnipStockNeeded = (isCold, additionalConsumption) => {
    if (!additionalConsumption) additionalConsumption = 0;
    //we could base this off actual kitten capacity, but if the kittens have already starved we might just need to let them starve
    additionalConsumption += state.populationIncrease * -game.village.catnipPerKitten;
    if (game.calendar.season === 3) {
        return Math.max(0, -(game.getResourcePerTick("catnip", true) - additionalConsumption) * ticksLeftInSeason())
    } else {
        return Math.max(0, -(getWinterCatnipProduction(isCold) - additionalConsumption) * ticksPerSeason() - getExpectedCatnipBeforeWinter())
    }
}
getAdditionalCatnipNeeded = populationIncrease => {
    return getWinterCatnipStockNeeded(canHaveColdSeason(), populationIncrease * -game.village.catnipPerKitten) - getWinterCatnipStockNeeded(canHaveColdSeason(), 0)
}
//this might need to be slightly more in case you trade, etc
getFursStockNeeded = () => {
    var catpowerPerSec = game.getResourcePerTick("manpower", true);
    if (catpowerPerSec <= 0) {
        return game.getResourcePerTick("furs", true) >= 0 ? 0 : Infinity;
    }
    return Math.max(0, -game.getResourcePerTick("furs", true) * (getResourceMax("manpower") / catpowerPerSec))
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
    if (getResourceOwned("catnip") < getWinterCatnipStockNeeded(false) && game.science.get("agriculture").researched) {
        log("Making a farmer to prevent starvation (needed " + game.getDisplayValueExt(getWinterCatnipStockNeeded(false)) + " catnip)")
        switchToJob("farmer");
    }
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
        withTab("Town", () => {
            if (game.village.isFreeKittens() && state.populationIncrease) {
                state.populationIncrease--; //we overrode the normal new job
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


/************** 
 * Queueables
**************/
housingMap = {
    Hut: 2,
    "Log House": 1,
    Mansion: 1,
    "Space Station": 2,
}

findButton = name => $('span:contains("' + name + '")').parents("div.btn")
internalBuildingNames = flattenArr(game.bld.buildingsData.map(data => { if (data.stages) return (data.stages.map(stage => { return { name: data.name, label: stage.label }; })); return data; }))
getBuildingPrices = name => internalBuildingNames.filter(bld => bld.label === name).map(data => game.bld.getPrices(data.name))[0] || []
getPrice = (prices, res) => (prices.filter(price => price.name === res)[0] || {val: 0}).val
function Building(name, tab, panel) {
    this.name = name;
    this.tab = tab;
    this.panel = panel;
    this.internalName = internalBuildingNames.filter(bld => bld.label === name)[0].name;
}
Building.prototype.buy = function() {
    withTab("Bonfire", () => findButton(this.name).click());
    state.populationIncrease += housingMap[this.name] || 0;
}
Building.prototype.getRealPrices = function() { 
    return game.bld.getPrices(this.internalName);
}
Building.prototype.getPrices = function() { 
    var prices = this.getRealPrices();
    if (housingMap[this.name] && !game.science.get("agriculture").researched) {
        prices = prices.concat({name: "catnip", val: getAdditionalCatnipNeeded(true, housingMap[this.name])});
    }
    return prices;
}
Building.prototype.isEnabled = function() {
    return game.bld.get(this.internalName).unlocked;
}

function Craft(name, tab, panel) {
    this.name = name;
    this.tab = tab;
    this.panel = panel;
    this.resName = getCraftInternalName(name);
}
Craft.prototype.buy = function() { return craftOne(this.resName); }
Craft.prototype.getPrices = function() { return getCraftPrices(this.resName); }
Craft.prototype.isEnabled = function() { return canCraft(this.resName); }

tradeWith = race => $('div.panelContainer:contains("' + race + '") span:contains("Send caravan")').click()
getTradeButtons = race => $('div.panelContainer:contains("' + race + '") div.btnContent').children(":visible")
getTradeData = race => game.diplomacy.get(race.toLowerCase());
seasonNames = ["spring", "summer", "autumn", "winter"];
function Trade(name, tab, panel) {
    this.name = panel;
    this.tab = tab;
    this.panel = panel;
    this.quiet = true;
}
Trade.prototype.buy = function(reserved) {
    var quantityTraded = 0;
    if (state.api >= 1 || state.tradeTimer >= 10 || getResourceOwned("manpower") * 1.2 > getResourceMax("manpower")) {
        withLeader("Merchant", () => withTab("Trade", () => {
            var maxClicks = 10;
            var prices = this.getPrices();
            if (!canAfford(prices, reserved)) console.error(reserved);
            if (state.api >= 1) {
                var yieldResTotal = null;
                while (canAfford(prices, reserved) && this.needProduct(1) && quantityTraded < 1000) {
                    prices.forEach(price => game.resPool.addResEvent(price.name, -price.val));
                    yieldResTotal = game.diplomacy.tradeInternal(game.diplomacy.races.find(race => race.title === this.panel), true, yieldResTotal);
                    quantityTraded++;
                }
                game.diplomacy.gainTradeRes(yieldResTotal, quantityTraded);
            } else {
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
            }
            state.tradeTimer = 0;
        }))
    }
    return quantityTraded;
}
Trade.prototype.getPrices = function() { return [{name: "manpower", val: 50}, {name: "gold", val: 15}].concat(getTradeData(this.panel).buys); }
Trade.prototype.needProduct = function(quantity) {
    return getTradeData(this.panel).sells.every(sell => getResourceOwned(sell.name) * 1.2 + sell.value * (1 + sell.delta/2) * (1 + game.diplomacy.getTradeRatio()) * quantity < getResourceMax(sell.name));
}
Trade.prototype.bestSeason = function() {
    return getTradeData(this.panel).sells[0].seasons[seasonNames[game.calendar.season]] >= Math.max(...Object.values(getTradeData(this.panel).sells[0].seasons))
}
Trade.prototype.isEnabled = function() { 
    return this.needProduct(1) && this.bestSeason(); 
}

scienceData = {
    Science: Object.values(game.science.metaCache),
    Workshop: game.workshop.upgrades,
    Space: Object.values(game.space.metaCache),
}
function Science(name, tab, panel) {
    this.name = name;
    this.tab = tab;
    this.panel = panel;
    this.once = tab !== "Space" || this.getData().noStackable;
}
Science.prototype.buy = function() { 
    withLeader("Scientist", () => withTab(this.tab, () => findButton(this.name).click()));
    state.populationIncrease += housingMap[this.name] || 0;
} //don't actually need scientist for Space
Science.prototype.getData = function() { return scienceData[this.tab].filter(data => data.label === this.name)[0]; }
Science.prototype.getPrices = function() { 
    var data = this.getData(); 
    var prices = this.tab === "Space" ? classes.ui.space.PlanetBuildingBtnController.prototype.getPrices.call(game.space, {metadata: data}) : data.prices;
    return prices//.map(fixPriceTitle);     
}
Science.prototype.isEnabled = function() { var data = this.getData(); return data.unlocked && !data.researched; }

religionData = {
    "Order of the Sun": game.religion.religionUpgrades,
    "Ziggurats": game.religion.zigguratUpgrades,
}
getUnicornsNeeded = tears => 2500 * Math.ceil((tears - getResourceOwned("tears")) / game.bld.get("ziggurat").val);
priceTearsToUnicorns = price => (price.name === "tears" ? { name: "unicorns", val: getUnicornsNeeded(price.val) } : price)
function Religion(name, tab, panel) {
    this.name = name;
    this.tab = tab;
    this.panel = panel;
    this.once = this.getData().noStackable;
    this.priceMultiplier = panel === "Order of the Sun" ? 0.9 : 1;
}
Religion.prototype.getData = function() {
    return religionData[this.panel].filter(upgrade => upgrade.label === this.name)[0];
}
Religion.prototype.buy = function() {
    var waitForTears = false;
    var doBuy = () => withTab("Religion", () => {
        if (this.panel === "Order of the Sun") {
            //note how much faith we had before buying an upgrade
            logFaith();
        } else {
            var prices = this.getRealPrices();
            var maxClicks = 25;
            var tearsNeeded = prices.filter(price => price.name === "tears").map(price => price.val - getResourceOwned("tears"))[0] || 0;
            while (maxClicks > 0 && tearsNeeded > 0) {
                findButton("Sacrifice Unicorns").click();
                maxClicks--;
                tearsNeeded -= game.bld.get("ziggurat").val;
                waitForTears = true;
            }
        }
        if (!waitForTears) findButton(this.name).click();
    });
    if (this.panel === "Order of the Sun") {
        withLeader("Philosopher", doBuy);
    } else {
        doBuy();
    }
    if (waitForTears) return 0;
}
Religion.prototype.getRealPrices = function() { 
    var data = this.getData();
    return multiplyPrices(data.prices, this.priceMultiplier * Math.pow(data.priceRatio, data.val));
}
Religion.prototype.getPrices = function() { 
    return this.getRealPrices().map(priceTearsToUnicorns);
}
Religion.prototype.isEnabled = function() { 
    var data = this.getData();
    return data.val === 0 || !data.noStackable;
}

function PraiseSun(name, tab, panel) {
    this.name = name;
    this.tab = tab;
    this.panel = panel;
    this.buy = () => $('#fastPraiseContainer > a')[0].click();
    this.getPrices = () => ([{ name: "faith", val: Math.min(getResourceOwned("faith"), .9 * getResourceMax("faith")) }]);
    this.isEnabled = () => true;
    this.silent = true;
    this.noLog = true;
}
function Transcend(name, tab, panel) {
    this.name = name;
    this.tab = tab;
    this.panel = panel;
    this.buy = () => withTab("Religion", () => { 
        var realConfirm = window.confirm;
        try {
            window.confirm = () => true;
            findButton(this.name).click();
            $('a:contains("[Faith Reset]")')[0].click();
            $('#fastPraiseContainer > a').click();
        } finally {
            window.confirm = realConfirm;
        }
    }),
    this.getPrices = () => ([{ name: "faith", val: .95 * getResourceMax("faith") }]);
    this.isEnabled = () => true;
    this.once = true;
}
function HoldFestival(name, tab, panel) {
    this.name = name;
    this.tab = tab;
    this.panel = panel;
    this.buy = () => withTab(this.tab, () => findButton(this.name).click());
    this.getPrices = () => ([{ name: "manpower", val: 1500 }, { name: "culture", val: 5000 }, { name: "parchment", val: 2500 }]);
    this.isEnabled = () => game.calendar.festivalDays === 0;
    this.quiet = true;
}
function SendExplorers(name, tab, panel) {
    this.name = name;
    this.tab = tab;
    this.panel = panel;
    this.buy = () => withTab(this.tab, () => findButton(this.name).click());
    this.getPrices = () => ([{ name: "manpower", val: 1000 }]);
    this.isEnabled = () => true; //TODO detect when new races are available
    this.once = true;
}

/************** 
 * Queue Management
**************/
disable = name => state.queue = state.queue.filter(bld => !(bld.name === name));
findQueue = name => state.queue.filter(bld => bld.name === name)[0];
isEnabled = name => state.queue.filter(bld => bld.name === name).length
//not used yet
promote = name => { var item = findQueue(name); disable(name); if (item) state.queue.unshift(item); }
enable = (name, tab, panel) => { 
    var type;
    if (specialBuys[name]) type = specialBuys[name];
    else if (tab === "Bonfire") type = Building;
    else if (panel === "Crafting") type = Craft;
    else if (scienceData[tab]) type = Science;
    else if (tab === "Trade") type = Trade;
    else if (religionData[panel]) type = Religion;
    else console.error(tab + " tab not supported yet!");
    state.queue.push(new type(name, tab, panel));
}
toggleEnabled = (name, tab, panel) => { 
    if (isEnabled(name)) { 
        disable(name);
    } else {
        enable(name, tab, panel);
    }
}

/************** 
 * Tabs
**************/
tabNumbers = { Bonfire: 1, Town: 2 } //these have changing names, but fixed position
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
    var oldTab = $('a.tab.activeTab')[0];
    var oldScroll = $("#midColumn").scrollTop();
    if (openTab(tab)) {
        try {
            op();
        } finally {
            oldTab.click(); //possibly no-op
            $("#midColumn").scrollTop(oldScroll);
        }
    }
}
highPerformanceSetLeader = newLeader => {
    var oldLeader = game.village.leader;
    if (oldLeader) oldLeader.isLeader = false;
    newLeader.isLeader = true;
    game.village.leader = newLeader;
}
withLeader = (leaderType, op) => {
    if (!game.workshop.get("register").researched) {
        op();
    } else if (state.api >= 1) {
        var oldLeader = game.village.leader;
        var newLeader = game.village.sim.kittens.find(kitten => kitten.trait.title === leaderType);
        if (newLeader) {
            highPerformanceSetLeader(newLeader);
        } else {
            console.error("Unable to find leader type " + leaderType + ". Are you low on kittens?");
        }
        try {
            op();
        } finally {
            if (oldLeader && newLeader) highPerformanceSetLeader(oldLeader);
        }
    } else {
        withTab("Town", () => {
            var oldLeader = $('a:contains("★")');
            var newLeader = $('div.panelContainer:contains("Census") > div.container > div:contains("' + leaderType + '") a:contains("☆")').first();
            if (oldLeader.length && newLeader.length) newLeader[0].click(); else console.error("Unable to find leader type " + leaderType + ". Make sure to promote a kitten of that type so they appear on the first page.");
            try {
                op();
            } finally {
                if (oldLeader.length && newLeader.length) oldLeader[0].click();
            }
        });
    }
}
getActiveTab = () => {
    var activeTab = $("a.tab.activeTab");
    var index = $('a.tab').index(activeTab)
    if (index < 2) return Object.keys(tabNumbers).find(tab => tabNumbers[tab] === (index + 1));
    return activeTab.text();
}

/************** 
 * Speed
**************/
baseDelay = 2000;
setSpeed = spd => {
    if (spd >= 1) {
        state.speed = spd;
        state.delay = Math.max(baseDelay / spd, 200);
        updateApiLevel();
        var millisPerLoop = state.delay;
        var millisPerTick = 1000 / (game.rate * state.speed);
        state.ticksPerLoop = Math.ceil(millisPerLoop / millisPerTick);
    }
    setRunning(state.running);
}
speedUp = () => setSpeed(state.speed * 2);
slowDown = () => setSpeed(state.speed / 2);
if (!game.realUpdateModel) game.realUpdateModel = game.updateModel;
game.updateModel = () => {
    for (var i = 0; i < state.speed; i++) { 
        if (i !== 0) {
            game.calendar.tick();
            //speed must not be a multiple of 5; otherwise this will cause the tooltips to never update (ui.js uses ticks % 5)
            game.ticks++;
            //might be going so fast you would miss astro events
            if (game.calendar.observeBtn) game.calendar.observeHandler();
        }
        game.realUpdateModel(); 
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
moreApi = () => setDesiredApiLevel(state.api + 1);
lessApi = () => setDesiredApiLevel(state.api - 1);
updateApiLevel = () => {
    state.api = Math.max(state.desiredApi, state.speed > 1 ? 1 : 0);
}

/************** 
 * Running
**************/
toggleRunning = () => setRunning(!state.running);
setRunning = newRunning => {
    state.running = newRunning;
    if (state.running) {
        startLoop();
    } else {
        stopLoop();
    }
}
loopHandle = 0;
stopLoop = () => clearInterval(loopHandle);
startLoop = () => { stopLoop(); loopHandle = setInterval(mainLoop, state.delay); mainLoop(); }

/************** 
 * Interface
**************/
ignoredButtons = ["Gather catnip", "Manage Jobs", "Promote kittens", "Clear", "Reset", "Tempus Stasit", "Tempus Fugit"]
stateButtons = {
    "Send hunters": "autoHunt",
    "Steel": "autoSteel",
}
specialBuys = {
    "Hold Festival": HoldFestival,
    "Transcend": Transcend,
    "Praise the sun!": PraiseSun,
    //allow refine catnip from Bonfire
    "Refine Catnip": Craft,
    "Send explorers": SendExplorers,
}
getManagedItem = manageButton => $(manageButton).parent().find("span").first().text().replace(/(\(|\[)[^\])]*(\)|\])/g, "").trim();
getPanelTitle = elem => getOwnText($(elem).parents('.panelContainer').children('.title')).trim();
updateButton = (elem, tab) => {
    var item = getManagedItem(elem);
    if (ignoredButtons.includes(item) || tab === "Science" && getPanelTitle(elem) === "Metaphysics") {
        $(elem).text("");
    } else {
        var condition;
        if (stateButtons[item] && tab !== "Science") {
            condition = state[stateButtons[item]];
        } else if (tab === "Town" && !specialBuys[item]) {
            condition = state.defaultJob === item;
        } else if (tab === "Trade" && !specialBuys[item]) {
            condition = isEnabled(getPanelTitle(elem));
        //Bonfire page refine button has a lowercase c
        } else if (item === "Refine catnip") {
            condition = isEnabled("Refine Catnip");
        } else {
            condition = isEnabled(item);
        }
        if (condition) $(elem).text("1"); else $(elem).text("0");
    }
}
buttonEvent = elem => {
    var item = getManagedItem(elem);
    var tab = getActiveTab();
    var panel = getPanelTitle(elem);
    if (tab === "Trade" && !specialBuys[item]) item = panel;
    //Bonfire page refine button has a lowercase c
    if (item === "Refine catnip") item = "Refine Catnip";
    if (stateButtons[item] && tab !== "Science") {
        state[stateButtons[item]] = !state[stateButtons[item]];
    } else if (panel === "Jobs") {
        state.defaultJob = item;
    } else {
        toggleEnabled(item, tab, panel);
    }
    updateButton(elem, tab);
}
updateManagementButtons = () => {
    $('div.btn.nosel:not(:has(>p))').prepend($('<p class="botManage" style="position: absolute; left: -13px; top: -4px" onclick="event.stopPropagation(); buttonEvent(this)">0</p>'));
    var tabCache = getActiveTab();
    $("p.botManage").each((idx, elem) => updateButton(elem, tabCache));
}
settingsMenu = [
    {
        name: "botOn",
        leftClick: toggleRunning,
        getHtml: () => "Bot: " + (state.running ? "on" : "off")
    },
    {
        name: "gameSpeed",
        leftClick: speedUp,
        rightClick: slowDown,
        getHtml: () => "Speed: " + state.speed + "x" + (state.speed > 30 ? " <br />(right click<br />to lower)" : "")
    },
    {
        name: "apiLevel",
        leftClick: moreApi,
        rightClick: lessApi,
        getHtml: () => "API: " + (state.desiredApi ? "some" : state.api ? "(some)" : "none")
    },
    {
        name: "queueVerbosity",
        leftClick: moreVerbose,
        rightClick: lessVerbose,
        getHtml: () => "Up Next: " + (state.verboseQueue ? "verbose" : "concise")
    }
];
createSettingsMenu = () => {
    $("#botSettings").remove()
    var botSettings = $('<div id="botSettings" style="position: absolute; top: 50px; right: 10px;">');
    var eventHandler = action => event => {
        event.preventDefault();
        if (action) action();
        updateSettingsMenu();
    };
    settingsMenu.forEach(item => {
        var button = $('<div id="' + item.name + '" style="margin-bottom: 5px">');
        button.click(eventHandler(item.leftClick));
        button.contextmenu(eventHandler(item.rightClick));
        botSettings.append(button)
    })
    $('#gamePageContainer').append(botSettings);
    updateSettingsMenu();
}
updateSettingsMenu = () => {
    settingsMenu.forEach(item => $('#' + item.name).html(item.getHtml()));
}

/************** 
 * Initialize
**************/
if (window.state) {
    loadDefaults();
    //if we've updated class behavior, get the new behavior
    reloadQueue(state.queue);
    initialize();
} else {
    load();
}
log("Autokittens loaded")
/*
todo:
buy script (-> genetic algorithm)
--master plan mode
----separate state and config variables
----job assignment in queue
----goals: concrete, moon, eludium, beyond
----big queue of jobs, techs, upgrades
------techs and upgrades built from (queue slots since unlock, isBought)
----handle queued items whose resources have no production
------require effective production > 0 || enough supply already
--------might need to improve effective production calculation
----------ensure craftables have enough storage
--strategy viability
----exclude useless techs
--run scoring
----10pt per science, building type
----5pt per kitten
----2pt per upgrade
----1pt per building
----1pt per %faith bonus
----2000pt if moon +1pt/day early
trade calculations -> needsResource function
--try not to have full gold
faith reset without transcending
improve performance at high speeds
--run bot in the game update function
--lag indicator (ticks/sec)
energy calculations
improve interface
--buy quantity: 0, 1/2, 1, 2, infinity
----1/2: when none of your craft chain is reserved, become normal and go to end of queue
----2: queued twice
----infinity: automatically top of queue (queue with other infinities)
reserve ivory like furs
early game needs:
--job management
----wood/catnip efficiency
------factor in skill learning rate (give 5% leeway if kitten is already better at its current job?)
----set next job based on highest need in queue (measured in ticks)?
----unassign scholars when useless (reassign?)
--first leader
----promote leader
--first hunting (get efficiency)
--try harder to get rid of ivory??
--smelter management (handle negative production)
add help menu
organize code (but it has to be one file :/)
reservations seems still not correct (crafting too early)
*/