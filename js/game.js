var player;
var tmp = {};
var needCanvasUpdate = true;
var NaNalert = false;
var gameEnded = false;

let VERSION = {
	num: "0.4.0",
	name: "征服世界",
}

// Determines if it should show points/sec
function showPointGen() {
	return (tmp.pointGen.neq(new Decimal(0)))
}

// Calculate points/sec!
function getPointGen() {
	let gain = new Decimal(1)
	if (hasUpg("c", 12)) gain = gain.times(layers.c.upgrades[12].effect())
	if (hasUpg("c", 23)) gain = gain.times(layers.c.upgrades[21].effect())
	if (hasUpg("c", 31)) gain = gain.times(layers.c.upgrades[31].effect())
	let ab = layers.c.upgrades[21].effect().times(layers.c.upgrades[31].effect())
	if (hasUpg("c", 33)) gain = gain.times(ab)
	if (hasUpg("w", 13)) gain = gain.times(ab)
	gain = gain.mul(tmp.layerEffs.w)
	gain = gain.mul(tmp.layerEffs.m)
	gain = gain.mul(tmp.buyables.b[11].effect)
	gain = gain.mul(tmp.buyables.b[12].effect)
	gain = gain.mul(tmp.buyables.b[13].effect)
	if (tmp.layerEffs.sp) gain = gain.mul(tmp.layerEffs.sp)
	if (player.sp.buyables[21].gt(0)) gain = gain.mul(tmp.buyables.sp[21].effect)
	if (tmp.layerEffs.so) gain = gain.mul(tmp.layerEffs.so)
		
	var landMul = new Decimal(1)
	for (var a = 11; a <= 20; a++)
		if (player.m.buyables[a].gt(0)) landMul = landMul.mul(tmp.buyables.m[a].effect)
	gain = gain.mul(landMul)
	if (tmp) tmp.landMul = landMul
	
		
	if (player.b.banking & 1) gain = gain.pow(0.5)
	if (player.b.banking & 2) gain = gain.pow(0.3333333)
	if (player.b.banking & 4) gain = gain.pow(0.1)
	if (player.b.banking & 8) gain = player.c.points.pow(0.1).sub(1)
	if (player.b.banking & 16) gain = gain.pow(Decimal.pow(player.b.bankTime, 2).add(1).recip())  
	if (inChallenge("t", 11)) gain = gain.pow(0.5)
	if (player.bd.building != 0) gain = gain.pow(tmp.layerEffs.bd.penalty)
	return gain
}



// Function to determine if the player is in a challenge
function inChallenge(layer, id) {
	let chall = player[layer].active
	if (chall == toNumber(id)) return true

	if (layers[layer].challs[chall] && layers[layer].challs[chall].countsAs)
		return layers[layer].challs[chall].countsAs.includes(id)
	
	return false
}

function convertToDecimal() {
	player.points = new Decimal(player.points)
	for (layer in layers) {
		player[layer].points = new Decimal(player[layer].points)
		if (player[layer].best != undefined) player[layer].best = new Decimal(player[layer].best)
		if (player[layer].total !== undefined) player[layer].total = new Decimal(player[layer].total)
		player[layer].spentOnBuyables = new Decimal(player[layer].spentOnBuyables)

		if (player[layer].buyables != undefined) {
			for (id in player[layer].buyables)
				player[layer].buyables[id] = new Decimal(player[layer].buyables[id])
		}
		player[layer].best = new Decimal(player[layer].best)

		if (layers[layer].convertToDecimal) layers[layer].convertToDecimal();
	}
}

function getResetGain(layer, useType = null) {
	let type = useType
	if (!useType) type = layers[layer].type
	
	var base = isFunction(layers[layer].base) ? layers[layer].base() : layers[layer].base
	var exponent = isFunction(layers[layer].exponent) ? layers[layer].exponent() : layers[layer].exponent

	if (tmp.gainExp[layer].eq(0)) return new Decimal(0)
	if (type == "static") {
		if ((!layers[layer].canBuyMax()) || tmp.layerAmt[layer].lt(tmp.layerReqs[layer])) return new Decimal(1)
		let gain = tmp.layerAmt[layer].div(tmp.layerReqs[layer]).div(tmp.gainMults[layer]).max(1).log(base).times(tmp.gainExp[layer]).pow(Decimal.pow(exponent, -1))
		return gain.floor().sub(player[layer].points).add(1).max(1);
	} else if (type == "normal") {
		if (tmp.layerAmt[layer].lt(tmp.layerReqs[layer])) return new Decimal(0)
		let gain = tmp.layerAmt[layer].div(tmp.layerReqs[layer]).pow(exponent).times(tmp.gainMults[layer]).pow(tmp.gainExp[layer])
		if (gain.gte("e1e7")) gain = gain.sqrt().times("e5e6")
		return gain.floor().max(0);
	} else if (type == "custom") {
		return layers[layer].getResetGain()
	} else {
		return new Decimal(0)
	}
}

function getNextAt(layer, canMax = false, useType = null) {
	let type = useType
	if (!useType) type = layers[layer].type
	
	var base = isFunction(layers[layer].base) ? layers[layer].base() : layers[layer].base
	var exponent = isFunction(layers[layer].exponent) ? layers[layer].exponent() : layers[layer].exponent

	if (tmp.gainExp[layer].eq(0)) return new Decimal(1 / 0)
	if (type == "static") {
		if (!layers[layer].canBuyMax()) canMax = false
		let amt = player[layer].points.plus((canMax && tmp.layerAmt[layer].gte(tmp.nextAt[layer])) ? tmp.resetGain[layer] : 0)
		let extraCost = Decimal.pow(base, amt.pow(exponent).div(tmp.gainExp[layer])).times(tmp.gainMults[layer])
		let cost = extraCost.times(tmp.layerReqs[layer]).max(tmp.layerReqs[layer])
		if (layers[layer].resCeil) cost = cost.ceil()
		return cost;
	} else if (type == "normal") {
		let next = tmp.resetGain[layer].add(1)
		if (next.gte("e1e7")) next = next.div("e5e6").pow(2)
		next = next.root(tmp.gainExp[layer]).div(tmp.gainMults[layer]).root(exponent).times(tmp.layerReqs[layer]).max(tmp.layerReqs[layer])
		if (layers[layer].resCeil) next = next.ceil()
		return next;
	} else if (type == "custom") {
		return layers[layer].getNextAt(canMax)
	} else {
		return new Decimal(0)
	}
}

// Return true if the layer should be highlighted. By default checks for upgrades only.
function shouldNotify(layer) {
	for (id in layers[layer].upgrades) {
		if (!isNaN(id)) {
			if (canAffordUpg(layer, id) && !hasUpg(layer, id) && tmp.upgrades[layer][id].unl) {
				return true
			}
		}
	}

	if (layers[layer].shouldNotify) {
		return layers[layer].shouldNotify()
	}
	else
		return false
}

function rowReset(row, layer) {
	for (lr in ROW_LAYERS[row]) {
		if (layers[lr].doReset) {
			player[lr].active = null // Exit challenges on any row reset on an equal or higher row
			layers[lr].doReset(layer)
		}
		else
			if (layers[layer].row > layers[lr].row) fullLayerReset(lr)
	}
}

function fullLayerReset(layer) {
	player[layer] = layers[layer].startData();
	player[layer].upgrades = []
	player[layer].milestones = []
	player[layer].challs = []
	if (layers[layer].tabFormat && !Array.isArray(layers[layer].tabFormat)) {
		if (player.subtabs[layer] == undefined) player.subtabs[layer] = {}
		if (player.subtabs[layer].mainTabs == undefined) player.subtabs[layer].mainTabs = Object.keys(layers[layer].tabFormat)[0]
	}

	if (layers[layer].microtabs) {
		if (player.subtabs[layer] == undefined) player.subtabs[layer] = {}
		for (item in layers[layer].microtabs)
			if (player.subtabs[layer][item] == undefined) player.subtabs[layer][item] = Object.keys(layers[layer].microtabs[item])[0]
	}
	resetBuyables(layer)
}

function resetBuyables(layer) {
	if (layers[layer].buyables)
		player[layer].buyables = getStartBuyables(layer)
	player[layer].spentOnBuyables = new Decimal(0)
}

function getStartBuyables(layer) {
	let data = {}
	if (layers[layer].buyables) {
		for (id in layers[layer].buyables)
			if (!isNaN(id))
				data[id] = new Decimal(0)
	}
	return data
}

function addPoints(layer, gain) {
	player[layer].points = player[layer].points.add(gain).max(0)
	if (player[layer].best) player[layer].best = player[layer].best.max(player[layer].points)
	if (player[layer].total) player[layer].total = player[layer].total.add(gain)
}

function generatePoints(layer, diff) {
	addPoints(layer, tmp.resetGain[layer].times(diff))
}

var prevOnReset

function doReset(layer, force = false) {
	let row = layers[layer].row
	if (!force) {
		if (tmp.layerAmt[layer].lt(tmp.layerReqs[layer])) return;
		let gain = tmp.resetGain[layer]
		if (layers[layer].type == "static") {
			if (tmp.layerAmt[layer].lt(tmp.nextAt[layer])) return;
			gain = (layers[layer].canBuyMax() ? gain : 1)
		}
		if (layers[layer].type == "custom") {
			if (!tmp.canReset[layer]) return;
		}

		if (layers[layer].onPrestige)
			layers[layer].onPrestige(gain)

		addPoints(layer, gain)
		updateMilestones(layer)

		if (!player[layer].unl) {
			player[layer].unl = true;
			needCanvasUpdate = true;

			if (layers[layer].incr_order) {
				lrs = layers[layer].incr_order
				for (lr in lrs)
					if (!player[lrs[lr]].unl) player[lrs[lr]].order++
			}
		}

		tmp.layerAmt[layer] = new Decimal(0) // quick fix
	}

	if (layers[layer].resetsNothing && layers[layer].resetsNothing()) return


	for (layerResetting in layers) {
		if (row >= layers[layerResetting].row && (!force || layerResetting != layer)) completeChall(layerResetting)
	}

	prevOnReset = { ...player } //Deep Copy
	player.points = (row == 0 ? new Decimal(0) : new Decimal(10))

	for (let x = row; x >= 0; x--) rowReset(x, layer)
	prevOnReset = undefined

	setupTemp();
	updateTemp()
	updateTemp()
}

function respecBuyables(layer) {
	if (!layers[layer].buyables) return
	if (!layers[layer].buyables.respec) return
	
	modal.title = "您确定要洗点吗？"
	modal.content = `这将同时强制进行一次 "${(layers[layer].name ? layers[layer].name : layer)}" 重置！<br/><button class="tabButton" style="background-color: var(--color); padding: 5px 20px 5px 20px" onclick="{layers['${layer}'].buyables.respec(); updateBuyableTemp('${layer}'); modal.showing = false}"><p>我确定！</p></button>`
	modal.showing = true
}

function canAffordUpg(layer, id) {
	let upg = layers[layer].upgrades[id]
	let cost = tmp.upgrades[layer][id].cost
	if (upg.extraReq && !upg.extraReq()) return false
	return canAffordPurchase(layer, upg, cost)
}

function hasUpg(layer, id) {
	return (player[layer].upgrades.includes(toNumber(id)) || player[layer].upgrades.includes(id.toString()))
}

function hasMilestone(layer, id) {
	return (player[layer].milestones.includes(toNumber(id)) || player[layer].milestones.includes(id.toString()))
}

function hasChall(layer, id) {
	return (player[layer].challs.includes(toNumber(id)) || player[layer].challs.includes(id.toString()))
}

function upgEffect(layer, id) {
	return (tmp.upgrades[layer][id].effect)
}

function challEffect(layer, id) {
	return (tmp.challs[layer][id].effect)
}

function buyableEffect(layer, id) {
	return (tmp.buyables[layer][id].effect)
}

function canAffordPurchase(layer, thing, cost) {
	if (thing.currencyInternalName) {
		let name = thing.currencyInternalName
		if (thing.currencyLayer) {
			let lr = thing.currencyLayer
			return !Decimal.lt(player[lr][name], cost)
		}
		else {
			return !Decimal.lt(player[name], cost)
		}
	}
	else {
		return !(player[layer].points.lt(cost))
	}
}

function buyUpg(layer, id) {
	if (!player[layer].unl) return
	if (!layers[layer].upgrades[id].unl()) return
	if (player[layer].upgrades.includes(id)) return
	let upg = layers[layer].upgrades[id]
	let cost = tmp.upgrades[layer][id].cost
	if (upg.extraReq && !upg.extraReq()) return

	if (upg.currencyInternalName) {
		let name = upg.currencyInternalName
		if (upg.currencyLayer) {
			let lr = upg.currencyLayer
			if (player[lr][name].lt(cost)) return
			player[lr][name] = player[lr][name].sub(cost)
		}
		else {
			if (player[name].lt(cost)) return
			player[name] = player[name].sub(cost)
		}
	}
	else {
		if (player[layer].points.lt(cost)) return
		player[layer].points = player[layer].points.sub(cost)
	}
	player[layer].upgrades.push(id);
	if (upg.onPurchase != undefined)
		upg.onPurchase()
}

function buyMaxBuyable(layer, id) {
	if (!player[layer].unl) return
	if (!tmp.buyables[layer][id].unl) return
	if (!tmp.buyables[layer][id].canAfford) return
	if (!layers[layer].buyables[id].buyMax) return

	layers[layer].buyables[id].buyMax()
	updateBuyableTemp(layer)
}

function buyBuyable(layer, id) {
	if (!player[layer].unl) return
	if (!tmp.buyables[layer][id].unl) return
	if (!tmp.buyables[layer][id].canAfford) return

	layers[layer].buyables[id].buy()
	updateBuyableTemp(layer)
}

function resetRow(row) {
	if (prompt('您确定要重置这一行吗？建议您只在到达该阶段末尾时才这么做！输入 "I WANT TO RESET THIS" 以进行确认') != "I WANT TO RESET THIS") return
	let pre_layers = ROW_LAYERS[row - 1]
	let layers = ROW_LAYERS[row]
	let post_layers = ROW_LAYERS[row + 1]
	rowReset(row + 1, post_layers[0])
	doReset(pre_layers[0], true)
	for (let layer in layers) {
		player[layers[layer]].unl = false
		if (player[layers[layer]].order) player[layers[layer]].order = 0
	}
	player.points = new Decimal(10)
	updateTemp();
	resizeCanvas();
}

function startChall(layer, x) {
	let enter = false
	if (!player[layer].unl) return
	if (player[layer].active == x) {
		completeChall(layer, x)
		delete player[layer].active
	} else {
		enter = true
	}
	doReset(layer, true)
	if (enter) player[layer].active = x

	updateChallTemp(layer)
}

function canCompleteChall(layer, x) {
	if (x != player[layer].active) return

	let chall = layers[layer].challs[x]

	if (chall.currencyInternalName) {
		let name = chall.currencyInternalName
		if (chall.currencyLayer) {
			let lr = chall.currencyLayer
			return player[lr][name].gte(readData(chall.goal()))
		}
		else {
			return player[name].gte(chall.goal())
		}
	}
	else {
		return player[layer].points.gte(chall.goal())
	}

}

function completeChall(layer, x) {
	var x = player[layer].active
	if (!x) return
	if (!canCompleteChall(layer, x)) return
	if (!player[layer].challs.includes(x)) {
		needCanvasUpdate = true
		player[layer].challs.push(x);
		if (layers[layer].challs[x].onComplete) layers[layer].challs[x].onComplete()
	}
	delete player[layer].active
	updateChallTemp(layer)
}

VERSION.withoutName = "v" + VERSION.num + (VERSION.pre ? " Pre-Release " + VERSION.pre : VERSION.beta ? "β" + VERSION.beta : "")
VERSION.withName = VERSION.withoutName + (VERSION.name ? ": " + VERSION.name : "")


const ENDGAME = Decimal.pow(2, 262144);

function gameLoop(diff) {
	if (player.points.gte(ENDGAME) || gameEnded) gameEnded = 1

	if (isNaN(diff)) diff = 0
	if (gameEnded && !player.keepGoing) {
		diff = 0
		player.tab = "gameEnded"
	}
	if (player.devSpeed) diff *= player.devSpeed
	if (player.b.banking & 16) diff = Math.min(diff, 0.05)

	addTime(diff)

	for (layer in layers) {
		if (layers[layer].update) layers[layer].update(diff);
	}

	for (layer in layers) {
		if (layers[layer].automate) layers[layer].automate();
	}

	for (layer in layers) {
		if (layers[layer].milestones) updateMilestones(layer);
	}

	if (player.hasNaN && !NaNalert) {
		clearInterval(interval);
		player.autosave = false;
		NaNalert = true;

		modal.title = "出错了。"
		modal.content = `<br/>错误细节：<h5><pre>` + NaNerror.stack + `</pre></h5><br/>如果您看到了这条消息，请加入 https://discord.gg/wwQfgPa 以获取帮助。<br/><button class="tabButton" style="background-color: var(--color); padding: 5px 20px 5px 20px" onclick="exportSave()"><p>导出存档到剪贴板</p></button>`
		modal.showing = true
	}
}

function hardReset() {
	modal.title = "您确定要进行硬重置吗？"
	modal.content = `请再次确认，您真的想要抹除目前所有的游戏进度，再这么做！<br/><button class="tabButton" style="background-color: var(--color); padding: 5px 20px 5px 20px" onclick="{player = getStartPlayer(); save(); window.location.reload()}"><p>我知道后果，继续吧！</p></button>`
	modal.showing = true
}

var ticking = false

var interval = setInterval(function () {
	if (player === undefined || tmp === undefined) return;
	if (ticking) return;
	if (gameEnded) return;
	ticking = true
	let now = Date.now()
	let diff = (now - player.time) / 1e3
	if (player.offTime !== undefined) {
		if (player.offTime.remain > modInfo.offlineLimit * 3600000) player.offlineTime.remain = modInfo.offlineLimit * 3600000
		if (player.offTime.remain > 0) {
			let offlineDiff = Math.max(player.offTime.remain / 10, diff)
			player.offTime.remain -= offlineDiff
			diff += offlineDiff
		}
		if (!player.offlineProd || player.offTime.remain <= 0) delete player.offTime
	}
	if (player.devSpeed) diff *= player.devSpeed
	player.time = now
	if (needCanvasUpdate) resizeCanvas();
	updateTemp();
	gameLoop(diff)
	ticking = false
}, 50)