
// ----- Fifth row -----
addLayer("m", {
	startData() {
		return {
			unl: false,
			points: new Decimal(0),
			best: new Decimal(0),
			total: new Decimal(0),
			autoWorkerReset: false,
			autoWorkfinderReset: false,
		}
	},

	layerShown() { return hasUpg("wf", 25) || player[this.layer].unl },

	color: () => "#77FFFF",
	resource: "managers",
	row: 4,

	baseResource: "banks",
	baseAmount() { return player["b"].points },
	branches: [["w", 1], ["b", 1]],

	requires: () => new Decimal(22),

	type: "static",
	base: 1.22727,
	exponent: 1.01,
	canBuyMax: () => false,

	effect() {
		var eff = Decimal.pow(64, player.m.points).pow(2)
		return eff
	},
	effectDescription() {
		eff = tmp.layerEffs.m;
		return "which are boosting your coin and point gains by ×" + format(eff)
	},

	gainMult() {
		return new Decimal(1)
	},
	gainExp() {
		return new Decimal(1)
	},

	milestones: {
		0: {
			requirementDesc: () => "1 Manager",
			done() { return player[this.layer].best.gte(1) },
			effectDesc: () => "You can bulk hire workers, workfinders and banks, workers and workfinders unlocks immediately, kickstart with " + format(1000000) + " coins, gain 10,000% of your coins gain on coin reset every second, and coin reset no longer reset anything. Some of the previous layers' milestones and upgrades' effects are also replaced for this milestone's reward."
		},
		1: {
			requirementDesc: () => "2 Managers",
			done() { return player[this.layer].best.gte(2) },
			effectDesc: () => "Unlocks bulders, which can build structures to boost your production."
		},
		2: {
			requirementDesc: () => "3 Managers",
			done() { return player[this.layer].best.gte(3) },
			effectDesc: () => "Hiring workers no longer resets anything and you can choose to automate finding workers. Also you unlock a new structure.",
			toggles: [["m", "autoWorkerReset"]]
		},
		3: {
			requirementDesc: () => "4 Managers",
			done() { return player[this.layer].best.gte(4) },
			effectDesc: () => "You can choose to automate finding workfinders.",
			toggles: [["m", "autoWorkfinderReset"]]
		},
		4: {
			requirementDesc: () => "Not available yet",
			done() { return false },
			effectDesc: () => "To be continued...",
		},
	},

	tabFormat:
		["main-display",
			["prestige-button", function () { return "Hire " }],
			["blank", "5px"],
			["display-text",
				function () { return "You have at best " + format(player.m.best, 0) + " " + " managers." }],
			["blank", "5px"],
			"milestones", "upgrades"],

	hotkeys: [
		{ key: "m", desc: "M: Hire managers", onPress() { if (player[this.layer].unl) doReset(this.layer) } },
	],

})
addLayer("bd", {
	startData() {
		return {
			unl: false,
			points: new Decimal(0),
			best: new Decimal(0),
			total: new Decimal(0),
			allocated: new Decimal(1),
			building: 0,
			progress: new Decimal(0),
		}
	},

	layerShown() { return hasMilestone("m", 1) },

	color: () => "#FFFF77",
	resource: "builders",
	row: 4,

	baseResource: "workers",
	baseAmount() { return player["w"].points },
	branches: [["w", 1]],

	requires: () => new Decimal(24),

	effect() {
		return {
			speed: Decimal.pow(player.bd.allocated, 2).mul(player.c.points.add(1).log(100).add(1)),
			penalty: Decimal.div(player.bd.allocated, 6).add(1).recip()
		}
	},

	type: "static",
	base: 1.3,
	exponent: 1.01,
	canBuyMax: () => false,

	gainMult() {
		return new Decimal(1)
	},
	gainExp() {
		return new Decimal(1)
	},
	
	buyables: {
		rows: 1,
		cols: 3,
		11: {
			title: () => "Tavern",
			cost(x) {
				return Decimal.pow(2, x).mul(1000)
			},
			effect(x) {
				return x.div(2.5).add(1).pow(0.5)
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return data.canAfford
					? "You have " + format(player[this.layer].buyables[this.id], 0) + " taverns, which are boosting the find and finish work speed by ×" + format(data.effect) + "." + 
						(player.bd.building == 11 ? "\n\n\
						Progress: " + format(player.bd.progress, 0) + " / " + format(data.cost, 0) + " (" + format(Decimal.div(player.bd.progress, data.cost).mul(100)) + "%) \n\
						Click here to stop building and discard the building progress." : "\n\n\
						Progress needed: " + format(data.cost, 0) + "\n\
						Click here to start building.")
					: "You can not build more than one structure at once."
			},
			unl() { return player.bd.points.gte(1) },
			canAfford() { return (player.bd.building == 0 || player.bd.building == 11) },
			buy() {
				player.bd.building = (player.bd.building == 11 ? 0 : 11)
				doReset("bd", true);
			},
		},
		12: {
			title: () => "Housing Area",
			cost(x) {
				return Decimal.pow(1.5, x).mul(800)
			},
			effect(x) {
				return Decimal.pow(1.2, x)
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return data.canAfford
					? "You have " + format(player[this.layer].buyables[this.id], 0) + " housing areas, which are boosting all of the first three rows of coin upgrades by ×" + format(data.effect) + "." + 
						(player.bd.building == 12 ? "\n\n\
						Progress: " + format(player.bd.progress, 0) + " / " + format(data.cost, 0) + " (" + format(Decimal.div(player.bd.progress, data.cost).mul(100)) + "%) \n\
						Click here to stop building and discard the building progress." : "\n\n\
						Progress needed: " + format(data.cost, 0) + "\n\
						Click here to start building.")
					: "You can not build more than one structure at once."
			},
			unl() { return player.bd.points.gte(1) },
			canAfford() { return (player.bd.building == 0 || player.bd.building == 12) },
			buy() {
				player.bd.building = (player.bd.building == 12 ? 0 : 12)
				doReset("bd", true);
			},
		},
		13: {
			title: () => "Shrine",
			cost(x) {
				return Decimal.pow(15, x).mul(12000)
			},
			effect(x) {
				return Decimal.pow(1.25, x)
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return data.canAfford
					? "You have " + format(player[this.layer].buyables[this.id], 0) + " shrines." + (player[this.layer].buyables[this.id].gte(1) ? "" : " Building one will unlock another layer.") + 
						(player.bd.building == 13 ? "\n\n\
						Progress: " + format(player.bd.progress, 0) + " / " + format(data.cost, 0) + " (" + format(Decimal.div(player.bd.progress, data.cost).mul(100)) + "%) \n\
						Click here to stop building and discard the building progress." : "\n\n\
						Progress needed: " + format(data.cost, 0) + "\n\
						Click here to start building.")
					: "You can not build more than one structure at once."
			},
			unl() { return player.bd.points.gte(1) && hasMilestone("m", 2) },
			canAfford() { return (player.bd.building == 0 || player.bd.building == 13) },
			buy() {
				player.bd.building = (player.bd.building == 13 ? 0 : 13)
				doReset("bd", true);
			},
		},
	},
	
	update(diff) {
		player.bd.progress = Decimal.add(player.bd.progress, Decimal.mul(tmp.layerEffs.bd.speed, diff))
		if (player.bd.building == 0) player.bd.progress = new Decimal(0)
		else {
			if (player.bd.progress.gte(tmp.buyables.bd[player.bd.building].cost)) {
				player.bd.progress = player.bd.progress.sub(tmp.buyables.bd[player.bd.building].cost)
				player.bd.buyables[player.bd.building] = player.bd.buyables[player.bd.building].add(1)
			}
		}
	},   


	tabFormat:
		["main-display",
			["prestige-button", function () { return "Hire " }],
			["blank", "5px"],
			["display-text",
				function () { return "You have at best " + format(player.bd.best, 0) + " " + " builders." }],
			["blank", "5px"],
			["display-text",
				function () { return player.bd.points.gte(1) ? "You have " + format(player.bd.allocated, 0) + " allocated builders, which are giving you " + format(tmp.layerEffs.bd.speed) + " building speed (also based on current coin count) but will raise your coin gains and point generation to the power of ^" + format(tmp.layerEffs.bd.penalty, 5).replace(",", "") + " when you're building something." : "" }],
			["raw-html",
				function () {
					return player.bd.points.gte(2) && player.bd.building == 0 ?
						'<br/><input id="builderAllocator" type="range" min="1" max="' + player.bd.points.toNumber() + '" value="' + player.bd.allocated + '" style="width:75%" oninput="{player.bd.allocated = new Decimal(document.getElementById(' + "'builderAllocator'" + ').value)}"><br/>' +
						"You can adjust the allocated builders using the slider above."
						: ""
				}],
			["blank", "5px"],
			["display-text",
				function () { return player.bd.points.gte(1) ? "<h3>Structures</h3><br/><h5>Note: Starting/Stopping building structures will force a builder reset.</h5>" : "" }],
			"buyables",
			["blank", "5px"],
			["display-text",
				function () { return player.bd.points.gte(1) ? "You'll unlock more structures as you get more managers." : "" }],
			["blank", "5px"], 
			"upgrades"],

	hotkeys: [
		{ key: "d", desc: "D: Hire builders", onPress() { if (player[this.layer].unl) doReset(this.layer) } },
	],

})
