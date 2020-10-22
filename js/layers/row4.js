
var mapFocusDesc = "Unselected"
var expansionDetails = [
	["display-text", () => "<h5>Click on a tile in the map to see its details. Drag the tiles on the map to see more of it.</h5>"]
]

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
			effectDesc: () => "Unlocks builders, which can build structures to boost your production."
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
			effectDesc: () => "You can choose to automate finding workfinders. Also you unlock an another new structure. This one might be hard.",
			toggles: [["m", "autoWorkfinderReset"]]
		},
		4: {
			requirementDesc: () => "5 Managers",
			done() { return player[this.layer].best.gte(5) },
			effectDesc: () => "Unlocks an another new structure. This one is probably easier.",
		},
		5: {
			requirementDesc: () => "6 Managers",
			done() { return player[this.layer].best.gte(6) },
			effectDesc: () => "Each banking produces the banking before it. This will boost your builders' speed by a lot.",
		},
		6: {
			requirementDesc: () => "7 Managers",
			done() { return player[this.layer].best.gte(7) },
			effectDesc: () => "Unlocks an another new structure. This one is very important.",
		},
		7: {
			requirementDesc: () => "8 Managers",
			done() { return player[this.layer].best.gte(8) },
			effectDesc: () => "Unlocks an another new structure. This one is also important.",
		},
		8: {
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
		{ key: "m", desc: "M: Hire managers", onPress() { doReset(this.layer) } },
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
		var eff = {}
		eff.speed = Decimal.pow(player.bd.allocated, 2).mul(player.c.points.add(1).log(100).add(1))
		if (hasChall("t", 11)) eff.speed = eff.speed.mul(tmp.challs.t[11].effect)
		if (tmp.buyables.bd[22].effect) eff.speed = eff.speed.mul(tmp.buyables.bd[22].effect)
		eff.penalty = Decimal.div(player.bd.allocated, 6).add(1).recip()
		return eff;
	},

	type: "static",
	base: 1.25,
	exponent: 1.01,
	canBuyMax: () => false,

	gainMult() {
		return new Decimal(1)
	},
	gainExp() {
		return new Decimal(1)
	},
	
	buyables: {
		rows: 3,
		cols: 3,
		11: {
			title: () => "Tavern",
			cost(x) {
				if (x.gte(25)) x = x.pow(2).div(25)
				if (x.gte(15)) x = x.pow(2).div(15)
				return Decimal.pow(2, x).mul(1000)
			},
			effect(x) {
				return Decimal.pow(1.2, x)
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return data.canAfford
					? "You have " + format(player[this.layer].buyables[this.id], 0) + " taverns, which are boosting the find and finish work speed by ×" + format(data.effect) + "." + 
						(player.bd.building == 11 ? "\n\n\
						Progress: " + format(player.bd.progress, 0) + " / " + format(data.cost, 0) + " (" + format(Decimal.div(player.bd.progress, data.cost).mul(100)) + "%) \n\
						ETA: " + (Decimal.lte(tmp.layerEffs.bd.speed, 0) ? "never" : formatTime(data.cost.sub(player.bd.progress).div(tmp.layerEffs.bd.speed))) + "\n\
						Click here to stop building and discard the building progress." : "\n\n\
						Progress needed: " + format(data.cost, 0) + "\n\
						Click here to start building.")
					: "You can not build more than one structure at once."
			},
			unl() { return player.bd.points.gte(1) },
			canAfford() { return (player.bd.building == 0 || player.bd.building == 11) },
			buy() {
				player.bd.building = (player.bd.building == 11 ? 0 : 11)
				if (player.bd.building != 0) doReset("bd", true)
			},
		},
		12: {
			title: () => "Housing Area",
			cost(x) {
				if (x.gte(25)) x = x.pow(2).div(25)
				if (x.gte(15)) x = x.pow(2).div(15)
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
						ETA: " + (Decimal.lte(tmp.layerEffs.bd.speed, 0) ? "never" : formatTime(data.cost.sub(player.bd.progress).div(tmp.layerEffs.bd.speed))) + "\n\
						Click here to stop building and discard the building progress." : "\n\n\
						Progress needed: " + format(data.cost, 0) + "\n\
						Click here to start building.")
					: "You can not build more than one structure at once."
			},
			unl() { return player.bd.points.gte(1) },
			canAfford() { return (player.bd.building == 0 || player.bd.building == 12) },
			buy() {
				player.bd.building = (player.bd.building == 12 ? 0 : 12)
				if (player.bd.building != 0) doReset("bd", true)
			},
		},
		13: {
			title: () => "Shrine",
			cost(x) {
				if (x.gte(8)) x = x.pow(2).div(8)
				if (x.gte(5)) x = x.pow(2).div(5)
				return Decimal.pow(3.5, x).mul(8000)
			},
			effect(x) {
				return Decimal.pow(1.25, x)
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return data.canAfford
					? "You have " + format(player[this.layer].buyables[this.id], 0) + " shrines." + (player[this.layer].buyables[this.id].gte(1) ? (player[this.layer].buyables[this.id].gte(7) ? " Building more will make your spells stronger." : " Building more will give you an another spell to cast.") : " Building one will unlock another layer.") + 
						(player.bd.building == 13 ? "\n\n\
						Progress: " + format(player.bd.progress, 0) + " / " + format(data.cost, 0) + " (" + format(Decimal.div(player.bd.progress, data.cost).mul(100)) + "%) \n\
						ETA: " + (Decimal.lte(tmp.layerEffs.bd.speed, 0) ? "never" : formatTime(data.cost.sub(player.bd.progress).div(tmp.layerEffs.bd.speed))) + "\n\
						Click here to stop building and discard the building progress." : "\n\n\
						Progress needed: " + format(data.cost, 0) + "\n\
						Click here to start building.")
					: "You can not build more than one structure at once."
			},
			unl() { return player.bd.points.gte(1) && hasMilestone("m", 2) },
			canAfford() { return (player.bd.building == 0 || player.bd.building == 13) },
			buy() {
				player.bd.building = (player.bd.building == 13 ? 0 : 13)
				if (player.bd.building != 0) doReset("bd", true)
			},
		},
		21: {
			title: () => "Road",
			cost(x) {
				if (x.gte(8)) x = x.pow(2).div(8)
				if (x.gte(5)) x = x.pow(2).div(5)
				return Decimal.pow(3.5, x).mul(60000)
			},
			effect(x) {
				return Decimal.pow(1.25, x)
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return data.canAfford
					? "You have " + format(player[this.layer].buyables[this.id], 0) + " roads." + (player[this.layer].buyables[this.id].gte(1) ? (player[this.layer].buyables[this.id].gte(6) ? " Building more will make your obstacle rewards stronger." : " Building more will give you an another obstacle to be completed.") : " Building one will unlock another prestige layer.") + 
						(player.bd.building == 21 ? "\n\n\
						Progress: " + format(player.bd.progress, 0) + " / " + format(data.cost, 0) + " (" + format(Decimal.div(player.bd.progress, data.cost).mul(100)) + "%) \n\
						ETA: " + (Decimal.lte(tmp.layerEffs.bd.speed, 0) ? "never" : formatTime(data.cost.sub(player.bd.progress).div(tmp.layerEffs.bd.speed))) + "\n\
						Click here to stop building and discard the building progress." : "\n\n\
						Progress needed: " + format(data.cost, 0) + "\n\
						Click here to start building.")
					: "You can not build more than one structure at once."
			},
			unl() { return player.bd.points.gte(1) && hasMilestone("m", 3) },
			canAfford() { return (player.bd.building == 0 || player.bd.building == 21) },
			buy() {
				player.bd.building = (player.bd.building == 21 ? 0 : 21)
				if (player.bd.building != 0) doReset("bd", true)
			},
		},
		22: {
			title: () => "Construction Site",
			cost(x) {
				if (x.gte(25)) x = x.pow(2).div(25)
				if (x.gte(15)) x = x.pow(2).div(15)
				return Decimal.pow(1.6, x).mul(120000)
			},
			effect(x) {
				return Decimal.pow(1.2, x)
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return data.canAfford
					? "You have " + format(player[this.layer].buyables[this.id], 0) + " construction sites, which are making your builders build " + format(data.effect) + "× faster." + 
						(player.bd.building == 22 ? "\n\n\
						Progress: " + format(player.bd.progress, 0) + " / " + format(data.cost, 0) + " (" + format(Decimal.div(player.bd.progress, data.cost).mul(100)) + "%) \n\
						ETA: " + (Decimal.lte(tmp.layerEffs.bd.speed, 0) ? "never" : formatTime(data.cost.sub(player.bd.progress).div(tmp.layerEffs.bd.speed))) + "\n\
						Click here to stop building and discard the building progress." : "\n\n\
						Progress needed: " + format(data.cost, 0) + "\n\
						Click here to start building.")
					: "You can not build more than one structure at once."
			},
			unl() { return player.bd.points.gte(1) && hasMilestone("m", 4) },
			canAfford() { return (player.bd.building == 0 || player.bd.building == 22) },
			buy() {
				player.bd.building = (player.bd.building == 22 ? 0 : 22)
				if (player.bd.building != 0) doReset("bd", true)
			},
		},
		23: {
			title: () => "Military Base",
			cost(x) {
				if (x.gte(25)) x = x.pow(2).div(25)
				if (x.gte(15)) x = x.pow(2).div(15)
				return Decimal.pow(2, x).mul(250000000)
			},
			effect(x) {
				return Decimal.pow(1.2, x)
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return data.canAfford
					? "You have " + format(player[this.layer].buyables[this.id], 0) + " military bases." + (player[this.layer].buyables[this.id].gte(1) ? "" : " Building one will unlock another prestige layer.") + 
						(player.bd.building == 23 ? "\n\n\
						Progress: " + format(player.bd.progress, 0) + " / " + format(data.cost, 0) + " (" + format(Decimal.div(player.bd.progress, data.cost).mul(100)) + "%) \n\
						ETA: " + (Decimal.lte(tmp.layerEffs.bd.speed, 0) ? "never" : formatTime(data.cost.sub(player.bd.progress).div(tmp.layerEffs.bd.speed))) + "\n\
						Click here to stop building and discard the building progress." : "\n\n\
						Progress needed: " + format(data.cost, 0) + "\n\
						Click here to start building.")
					: "You can not build more than one structure at once."
			},
			unl() { return player.bd.points.gte(1) && hasMilestone("m", 6) },
			canAfford() { return (player.bd.building == 0 || player.bd.building == 23) },
			buy() {
				player.bd.building = (player.bd.building == 23 ? 0 : 23)
				if (player.bd.building != 0) doReset("bd", true)
			},
		},
		31: {
			title: () => "School",
			cost(x) {
				if (x.gte(25)) x = x.pow(2).div(25)
				if (x.gte(15)) x = x.pow(2).div(15)
				return Decimal.pow(2, x).mul(1e9)
			},
			effect(x) {
				return Decimal.pow(1.2, x)
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return data.canAfford
					? "You have " + format(player[this.layer].buyables[this.id], 0) + " schools." + (player[this.layer].buyables[this.id].gte(1) ? "" : " Building one will unlock another prestige layer.") + 
						(player.bd.building == 31 ? "\n\n\
						Progress: " + format(player.bd.progress, 0) + " / " + format(data.cost, 0) + " (" + format(Decimal.div(player.bd.progress, data.cost).mul(100)) + "%) \n\
						ETA: " + (Decimal.lte(tmp.layerEffs.bd.speed, 0) ? "never" : formatTime(data.cost.sub(player.bd.progress).div(tmp.layerEffs.bd.speed))) + "\n\
						Click here to stop building and discard the building progress." : "\n\n\
						Progress needed: " + format(data.cost, 0) + "\n\
						Click here to start building.")
					: "You can not build more than one structure at once."
			},
			unl() { return player.bd.points.gte(1) && hasMilestone("m", 7) },
			canAfford() { return (player.bd.building == 0 || player.bd.building == 31) },
			buy() {
				player.bd.building = (player.bd.building == 31 ? 0 : 31)
				if (player.bd.building != 0) doReset("bd", true)
			},
		},
		32: {
			title: () => "Placeholder.",
			cost(x) { return new Decimal("1ee308") },
			effect(x) { return new Decimal("1") },
			display() { return "" },
			unl() { return false },
			canAfford() { return false },
			buy() { },
		},
		33: {
			title: () => "Placeholder.",
			cost(x) { return new Decimal("1ee308") },
			effect(x) { return new Decimal("1") },
			display() { return "" },
			unl() { return false },
			canAfford() { return false },
			buy() { },
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
				function () { return player.bd.points.gte(1) ? "<h3>Structures</h3><br/><h5>Note: Starting building structures will force a builder reset.</h5>" : "" }],
			"buyables",
			["blank", "5px"],
			["display-text",
				function () { return player.bd.points.gte(1) && !hasMilestone("m", 6) ? "You'll unlock more structures as you get more managers." : "" }],
			["blank", "5px"], 
			"upgrades"],

	hotkeys: [
		{ key: "d", desc: "D: Hire builders", onPress() { doReset(this.layer) } },
	],

})

addLayer("t", {
	startData() {
		return {
			unl: false,
			points: new Decimal(0),
			best: new Decimal(0),
			total: new Decimal(0),
			autoAutoToggles: false,
			autoWorkerUpgrade: false,
			autoFinderUpgrade: false,
		}
	},

	layerShown() { return player.bd.buyables[21].gte(1) || player[this.layer].unl },

	color: () => "#77FFAA",
	resource: "territories",
	row: 4,

	baseResource: "coins",
	baseAmount() { return player.c.points },
	branches: [["w", 2], ["c", 2]],

	requires: () => new Decimal("e520").div(tmp.layerEffs ? tmp.layerEffs.t.territoryRed : 1),
	
	effect() {
		return {
			territoryRed: Decimal.pow(100, Decimal.pow(player.t.lands, 0.9)),
			soldierRed: Decimal.pow(10, Decimal.pow(player.t.lands, 0.6)),
		}
	},

	type: "static",
	base: "1e30",
	exponent: 1.5,
	canBuyMax: () => hasMilestone("t", 3),

	gainMult() {
		return new Decimal(1)
	},
	gainExp() {
		return new Decimal(1)
	},
	
	challs: {
        rows: 3,
        cols: 2,
        11: {
            name:() => "The First Obstacle",
			desc:() => "Coin gain and point generation is square rooted.",
			reward:() => "Builders build faster based on points.",
			effect() {
				var eff = player.points.add(1).log(1e25).add(1)
				if (hasChall("t", 22)) eff = eff.mul(tmp.challs.t[22].effect)
				if (hasChall("t", 32)) eff = eff.mul(tmp.challs.t[32].effect)
				return eff
			},
			effectDisplay:(eff) => "×" + format(eff),
			goal:() => new Decimal("e75"),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			unl:() => player.t.best.gte(1),
        },
        12: {
            name:() => "Unemployed Workfinders",
			desc:() => "You can not access the workfinder layer.",
			reward:() => "Find and finish work faster based on points.",
			effect() {
				var eff = player.points.add(1).log(1e50).add(1)
				if (hasChall("t", 22)) eff = eff.mul(tmp.challs.t[22].effect)
				if (hasChall("t", 32)) eff = eff.mul(tmp.challs.t[32].effect)
				return eff
			},
			effectDisplay:(eff) => "×" + format(eff),
			goal:() => new Decimal("e150"),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			unl:() => player.bd.buyables[21].gte(2),
        },
        21: {
            name:() => "Market Crash",
			desc:() => "You can not access the bank layer <i>and</i> the workfinder layer.",
			reward:() => "You can access more banking options.",
			countsAs: [12],
			goal:() => new Decimal("e206"),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			unl:() => player.bd.buyables[21].gte(3),
        },
        22: {
            name:() => "From Square One",
			desc:() => "You can not access <i>any</i> layer below this one (well, except for the coin layer, of course).",
			reward:() => "Boost the first two obstacles' buffs based on your total territory count.",
			effect:() => player.t.best.add(1).sqrt(),
			effectDisplay:(eff) => "×" + format(eff),
			countsAs: [12, 21],
			goal:() => new Decimal("e50"),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			unl:() => player.bd.buyables[21].gte(4),
        },
		31: {
            name:() => "Unspendable Coins",
			desc:() => "“From Square One” and “Time Banking”'s debuff are applied at once.",
			reward:() => "You unlock more spiritual power rebuyable upgrades.",
			countsAs: [12, 21, 22],
			goal:() => new Decimal(1500000),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			unl:() => player.bd.buyables[21].gte(5),
        },
		32: {
            name:() => "Unpowered by Meta",
			desc:() => "“From Square One” and “Metacoin Banking”'s debuff are applied at once.",
			reward:() => "Boost the first two obstacles' buffs based on your number of roads.",
			effect:() => player.bd.buyables[21].add(1).sqrt(),
			effectDisplay:(eff) => "×" + format(eff),
			countsAs: [12, 21, 22],
			goal:() => new Decimal(5000000),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			unl:() => player.bd.buyables[21].gte(6),
        },
    },
	
	milestones: {
		0: {
			requirementDesc: () => "2 Territories",
			done() { return player[this.layer].best.gte(2) },
			effectDesc: () => "You can automate previous automation toggles, automatically toggle autobuying coin upgrades and autobuying workfinder rebuyable upgrades on when you unlock them and keep auto hiring workfinder off until you have 7 workers and it will also automatically be turned on.",
			toggles: [["t", "autoAutoToggles"]],
		},
		1: {
			requirementDesc: () => "3 Territories",
			done() { return player[this.layer].best.gte(3) },
			effectDesc: () => "You can automate buying worker upgrades.",
			toggles: [["t", "autoWorkerUpgrade"]],
		},
		2: {
			requirementDesc: () => "4 Territories",
			done() { return player[this.layer].best.gte(4) },
			effectDesc: () => "You can automate buying workfinder upgrades.",
			toggles: [["t", "autoFinderUpgrade"]],
		},
		3: {
			requirementDesc: () => "6 Territories",
			done() { return player[this.layer].best.gte(6) },
			effectDesc: () => "You can bulk explore territories.",
		},
	},
	
	automate() {
		if (player.t.autoAutoToggles) {
			if (hasMilestone("w", 4)) player.w.autoCoinUpgrade = true
			if (hasMilestone("w", 7)) player.w.autoFinderUpgrade = true
			player.m.autoWorkfinderReset = hasMilestone("w", 6)
		}
		
		if (player.tab == "t" && player.subtabs.t.stuff == "map") {
			updateMapCanvas()
		}
	},
	
	microtabs: {
        stuff: {
            challenges: { title: () => "Obstacles", content: [
				["display-text", "<h5>Note: Entering/Exiting obstacles will force a territory reset.</h5>"], 
				["blank", "5px"],
				"challs"] 
			},
            milestones: { title: () => "Milestones", content: [
				"milestones"] 
			},
            map: { title: () => "World Map", unl: () => player.so.buyables[13].gte(1), content: [
				["blank", "5px"],
				["display-text", function () { return "You have " + formatWhole(player.t.lands) + " conquered land, which are decreasing the territories' requirements by ÷" + format(tmp.layerEffs.t.territoryRed) + " and soldiers' requirements by ÷" + format(tmp.layerEffs.t.soldierRed) + "." }], 
				["blank", "0px"], "map-box", ["blank", "0px"],
				["info-box", [
					["display-text", function () { return "Selected Tile: " + mapFocusDesc + "<br/><p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>"}],
					["display-text", function () { return (
						mapFocusDesc === "Unselected" ? "<h5>Click on a tile on the map to view its details.<br/>Drag the tiles to move the map around.</h5>" :
						isConquered(mapFocusX, mapFocusY) ? "<h5>This land has already been conquered.<br/>You can not reconquer the land that you already conquered, duh!</h5>" : 
						!isConquerable(mapFocusX, mapFocusY) ? "<h5>You can not initialize conquering on this tile yet.<br/>Please select the tile that is closer to your land.</h5>" : 
						"<h5>Difficulty: " + format(getMapDifficulty(mapFocusX, mapFocusY)) + " -> Best Conquer Time: " + formatTime(Decimal.div(getMapDifficulty(mapFocusX, mapFocusY), soldierStats.spd)) + (player.world.conquering && player.world.conquerX == mapFocusX && player.world.conquerY == mapFocusY ? "<br/>You are conquering this tile. Click it again to abort conquering." : "<br/>Click on the tile again to initialize conquering on that tile.")
					) + "<p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }]
					], {"width": "480px"}
				], 
				["row", [
					["info-box", [
						["display-text", function () { return "Your Soldiers<h5 style='font-size:6px'><br/>" }],
						["mini-bar", function () { return format(Decimal.div(player.world.health, soldierStats.mhp)) }, {"background-color": "#300"}],
						["display-text", function () { return "<h5>Health: " + formatWhole(player.world.health) + " / " + formatWhole(soldierStats.mhp) + "</h5>" }],
						["display-text", function () { return "<h5>Power: " + formatWhole(Decimal.div(player.world.health, soldierStats.mhp).mul(soldierStats.atk)) + " / " + formatWhole(soldierStats.atk) + "</h5>" }],
						], {"width": "228px"}
					], 
					["info-box", [
						["display-text", function () { return "Your Encounters<h5 style='font-size:6px'><br/>" }],
						["mini-bar", function () { return format(Decimal.div(player.world.health, soldierStats.mhp)) }, {"background-color": "#300"}],
						["display-text", function () { return "<h5>Health: " + formatWhole(player.world.health) + " / " + formatWhole(soldierStats.mhp) + "</h5>" }],
						["display-text", function () { return "<h5>Power: " + formatWhole(Decimal.div(player.world.health, soldierStats.mhp).mul(soldierStats.atk)) + " / " + formatWhole(soldierStats.atk) + "</h5>" }],
						], {"width": "228px"}
					], 
				]],
				["info-box", [
					["display-text", function () { return (
						player.world.conquering ? "Conquering " + player.world.conquerTarget + "..." : "Solider Idle."
						) + "<p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>"
					}],
					["display-text", function () { return (
						player.world.conquering ? "<h5>Progress: " + formatWhole(player.world.conquerProgress) + " / " + formatWhole(player.world.conquerGoal) + "</h5>" : "<h5>Please select a land to be conquered</h5>"
						) + "<p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p><h5 style='font-size:6px'><br/>"
					}],
					["mini-bar", function () { return format(player.world.conquering ? Decimal.div(player.world.conquerProgress, player.world.conquerGoal) : 0) }, {"background-color": "#333"}],
					], {"width": "480px"}
				], 
				["blank", "5px"],
				] 
			},
        },
	},
	
	update(diff) {
		if (player.world === undefined) player.world = {}
		if (player.world.conquering) {
			player.world.conquerProgress = Decimal.add(player.world.conquerProgress, Decimal.mul(soldierStats ? soldierStats.spd : 0, diff))
			if (player.world.conquerProgress.gte(player.world.conquerGoal)) {
				player.world.conquerProgress = new Decimal(0)
				doneConquering()
			}
		}
	},
	

	tabFormat:
		["main-display",
			["prestige-button", function () { return "Explore " }],
			["blank", "5px"],
			["display-text",
				function () { return "You have at best " + format(player.t.best, 0) + " " + " territories." }],
			["blank", "5px"],
			["microtabs", "stuff"],
		],

	hotkeys: [
		{ key: "t", desc: "T: Explore territories", onPress() { doReset(this.layer) } },
	],

})

addLayer("so", {
	startData() {
		return {
			unl: false,
			points: new Decimal(0),
			best: new Decimal(0),
			total: new Decimal(0),
			rating: new Decimal(0),
		}
	},

	layerShown() { return player.bd.buyables[23].gte(1) || player[this.layer].unl },

	color: () => "#009900",
	resource: "soldiers",
	row: 4,

	baseResource: "coins",
	baseAmount() { return player.c.points },
	branches: [["w", 1], ["c", 2]],

	requires: () => new Decimal("e800").div(tmp.layerEffs ? tmp.layerEffs.t.soldierRed : 1),

	type: "static",
	base: "1e30",
	exponent: 0.9,
	canBuyMax: () => true,
	
	effect() {
		var actualRat = Decimal.add(player.so.rating, 1)
		var eff = actualRat.pow(15).mul(actualRat.log(10).add(1).pow(5))
		return eff
	},

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
			title: () => "Strength",
			cost(x) {
				if (x.gte(100)) x = x.pow(2).div(100)
				if (x.gte(50)) x = x.pow(2).div(50)
				if (x.gte(20)) x = x.pow(2).div(20)
				if (x.gte(10)) x = x.pow(2).div(10)
				let cost = Decimal.mul("e810", Decimal.pow(1e30, x))
				return cost.floor()
			},
			effect(x) { 
				return x.add(5)
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "Base stat: " + format(data.effect) + "\n\
				Cost: " + format(data.cost) + " coins\n\
				Increase your soldiers' attack power."
			},
			unl() { return player.so.unl },
			canAfford() {
				return player.c.points.gte(tmp.buyables[this.layer][this.id].cost)
			},
			buy() {
				cost = tmp.buyables[this.layer][this.id].cost
				player.c.points = player.c.points.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
			style() {
				return {
					"height": "200px"
				}
			}
		},
		12: {
			title: () => "Endurance",
			cost(x) {
				if (x.gte(100)) x = x.pow(2).div(100)
				if (x.gte(50)) x = x.pow(2).div(50)
				if (x.gte(20)) x = x.pow(2).div(20)
				if (x.gte(10)) x = x.pow(2).div(10)
				let cost = Decimal.mul("e850", Decimal.pow(1e50, x))
				return cost.floor()
			},
			effect(x) { 
				return x.add(5)
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "Base stat: " + format(data.effect) + "\n\
				Cost: " + format(data.cost) + " coins\n\
				Increase your soldiers' max hit points."
			},
			unl() { return player.so.unl },
			canAfford() {
				return player.c.points.gte(tmp.buyables[this.layer][this.id].cost)
			},
			buy() {
				cost = tmp.buyables[this.layer][this.id].cost
				player.c.points = player.c.points.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
			style() {
				return {
					"height": "200px"
				}
			}
		},
		13: {
			title: () => "Dexterity",
			cost(x) {
				if (x.gte(100)) x = x.pow(2).div(100)
				if (x.gte(50)) x = x.pow(2).div(50)
				if (x.gte(20)) x = x.pow(2).div(20)
				if (x.gte(10)) x = x.pow(2).div(10)
				let cost = Decimal.mul("e1000", Decimal.pow(1e80, x))
				return cost.floor()
			},
			effect(x) { 
				return x.add(5)
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "Base stat: " + format(data.effect) + "\n\
				Cost: " + format(data.cost) + " coins\n\
				Increase your soldiers' speeds." + (data.effect.gte(6) ? "" : " Increasing this number to 6 will unlock a new tab for the territory layer.")
			},
			unl() { return player.so.unl },
			canAfford() {
				return player.c.points.gte(tmp.buyables[this.layer][this.id].cost)
			},
			buy() {
				cost = tmp.buyables[this.layer][this.id].cost
				player.c.points = player.c.points.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
			style() {
				return {
					"height": "200px"
				}
			}
		},
	},
	
	update(diff) {
		var rat = player.so.points
			for (let x = 10; x <= 10; x += 10) for (let y = x + 1; y <= x + 3; y++) {
				rat = rat.mul(tmp.buyables.so[y].effect).div(5)
			}
		player.so.rating = rat
		
		soldierStats = {
			atk: player.so.points.mul(tmp.buyables.so[11].effect),
			mhp: player.so.points.mul(tmp.buyables.so[12].effect).mul(5),
			spd: player.so.points.mul(tmp.buyables.so[13].effect).div(5),
			gen: player.so.points.mul(tmp.buyables.so[13].effect.cbrt()).div(2),
		}
		
		if (player.world === undefined) player.world = {}
		player.world.health = Decimal.add(player.world.health, Decimal.mul(soldierStats.gen, diff)).min(soldierStats.mhp)
	},

	tabFormat:
		["main-display",
			["prestige-button", function () { return "Recruit " }],
			["blank", "5px"],
			["display-text",
				function () { return "You have at best " + format(player.so.best, 0) + " soldiers." }],
			["display-text",
				function () { return "Your current military rating is " + format(player.so.rating) + ", which is boosting your point generation speed by ×" + format(tmp.layerEffs.so) + "." }],
			["blank", "5px"],
			["display-text",
				function () { return player.so.unl ? "<h3>Soldier Statistics</h3><br/><h5>Accounts for all soldiers</h5>" : "" }],
			["blank", "5px"],
			["row", [
				["display-text",
					function () { return (player.so.unl ? "<h5/>" + 
						"Base Power: " + formatWhole(soldierStats.atk).padEnd(15, '\u00A0') + "<br/>" +
						"Regen SPD : " + (format(soldierStats.gen) + "/s").padEnd(15, '\u00A0') 
						: "") + "<br/><p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
				["display-text",
					function () { return (player.so.unl ? "<h5/>" + 
						"Max Health: " + formatWhole(soldierStats.mhp).padEnd(15, '\u00A0')
						: "") + "<br/><p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
				["display-text",
					function () { return (player.so.unl ? "<h5/>" + 
						"Move Speed: " + formatWhole(soldierStats.spd).padEnd(15, '\u00A0')
						: "") + "<br/><p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
						
			]],
			["blank", "5px"],
			["display-text",
				function () { return player.so.unl ? "<h3>Soldier Attributes</h3>" : "" }],
			"buyables"],

	hotkeys: [
		{ key: "o", desc: "O: Recruit soldiers", onPress() { doReset(this.layer) } },
	],

})
addLayer("wi", {
	startData() {
		return {
			unl: false,
			points: new Decimal(0),
			best: new Decimal(0),
			total: new Decimal(0),
			knowledge: new Decimal(0),
			bought: new Decimal(0),
			spent: new Decimal(0),
		}
	},

	layerShown() { return player.bd.buyables[31].gte(1) || player[this.layer].unl },

	color: () => "#0077ff",
	name: "wisdom",
	resource: "wisdom",
	row: 4,

	baseResource: "spiritual power",
	baseAmount() { return player.sp.points },
	branches: [["w", 3], ["sp", 3]],

	requires: () => new Decimal("e18"),

	type: "static",
	base: "2",
	exponent: 2.65,
	canBuyMax: () => true,
	
	effect() {
		return Decimal.pow(2, Decimal.pow(player.wi.best, 1.05)).sub(1)
	},
	
	effectDescription() {
		return "which are generating " + format(tmp.layerEffs.wi) + " knowledge per second"
	},
	
	
	upgrades: {
		rows: 3,
		cols: 5,
		11: {
			desc: () => "Knowledge boosts your first row of coin boost upgrades.",
			cost: () => new Decimal(1),
			currencyLayer: "wi",
			currencyInternalName: "knowledge",
			currencyDisplayName: "knowledge",
			unl() { return player[this.layer].unl },
			extraReq() { return player.wi.points.gt(player.wi.bought) },
			effect() {
				let ret = Decimal.pow(player.wi.knowledge, 2.25).add(1)
				return ret;
			},
			effectDisplay(fx) { return "×" + format(fx) },
			onPurchase() { player.wi.spent = Decimal.add(player.wi.spent, tmp.upgrades.wi[11].cost); player.wi.bought = Decimal.add(player.wi.bought, 1) }
		},
		12: {
			desc: () => "Knowledge boosts finished work's effect.",
			cost: () => new Decimal(100),
			currencyLayer: "wi",
			currencyInternalName: "knowledge",
			currencyDisplayName: "knowledge",
			unl() { return player[this.layer].unl },
			extraReq() { return hasUpg("wi", 11) && player.wi.points.gt(player.wi.bought) },
			effect() {
				let ret = Decimal.pow(player.wi.knowledge, 0.25).add(1)
				return ret;
			},
			effectDisplay(fx) { return "×" + format(fx) },
			onPurchase() { player.wi.spent = Decimal.add(player.wi.spent, tmp.upgrades.wi[12].cost); player.wi.bought = Decimal.add(player.wi.bought, 1) }
		},
		13: {
			desc: () => "Brick. It's fun.",
			cost: () => Decimal.dInf,
			unl() { return player[this.layer].unl },
			extraReq() { return false },
			effect() {},
			style() { return {"background-color": "var(--background)", "color": "#fff2"} },
		},
		14: {
			desc: () => "Not yet implemented.",
			cost: () => new Decimal(0),
			unl() { return player[this.layer].unl },
			extraReq() { return false },
			effect() {},
		},
		15: {
			desc: () => "Not yet implemented.",
			cost: () => new Decimal(0),
			unl() { return player[this.layer].unl },
			extraReq() { return false },
			effect() {},
		},
		21: {
			desc: () => "Knowledge boosts your second row of coin boost upgrades.",
			cost: () => new Decimal(100),
			currencyLayer: "wi",
			currencyInternalName: "knowledge",
			currencyDisplayName: "knowledge",
			unl() { return player[this.layer].unl },
			extraReq() { return hasUpg("wi", 11) && player.wi.points.gt(player.wi.bought) },
			effect() {
				let ret = Decimal.pow(player.wi.knowledge, 0.5).add(1)
				return ret;
			},
			effectDisplay(fx) { return "×" + format(fx) },
			onPurchase() { player.wi.spent = Decimal.add(player.wi.spent, tmp.upgrades.wi[21].cost); player.wi.bought = Decimal.add(player.wi.bought, 1) }
		},
		22: {
			desc: () => "Knowledge boosts your first three banking buffs.",
			cost: () => new Decimal(3000),
			currencyLayer: "wi",
			currencyInternalName: "knowledge",
			currencyDisplayName: "knowledge",
			unl() { return player[this.layer].unl },
			extraReq() { return (hasUpg("wi", 12) || hasUpg("wi", 21)) && player.wi.points.gt(player.wi.bought) },
			effect() {
				let ret = Decimal.pow(player.wi.knowledge, 0.9).add(1)
				return ret;
			},
			effectDisplay(fx) { return "×" + format(fx) },
			onPurchase() { player.wi.spent = Decimal.add(player.wi.spent, tmp.upgrades.wi[22].cost); player.wi.bought = Decimal.add(player.wi.bought, 1) }
		},
		23: {
			desc: () => "Unlocks a new banking option.",
			cost: () => new Decimal(7500),
			currencyLayer: "wi",
			currencyInternalName: "knowledge",
			currencyDisplayName: "knowledge",
			unl() { return player[this.layer].unl },
			extraReq() { return hasUpg("wi", 22) && player.wi.points.gt(player.wi.bought) },
			onPurchase() { player.wi.spent = Decimal.add(player.wi.spent, tmp.upgrades.wi[22].cost); player.wi.bought = Decimal.add(player.wi.bought, 1) }
		},
		24: {
			desc: () => "Not yet implemented.",
			cost: () => new Decimal(0),
			unl() { return player[this.layer].unl },
			extraReq() { return false },
		},
		25: {
			desc: () => "Not yet implemented.",
			cost: () => new Decimal(0),
			unl() { return player[this.layer].unl },
			extraReq() { return false },
		},
		31: {
			desc: () => "You thought it was a discovery, but it was me, A Brick!",
			cost: () => Decimal.dInf,
			unl() { return player[this.layer].unl },
			extraReq() { return false },
			effect() {},
			style() { return {"background-color": "var(--background)", "color": "#fff2"} },
		},
		32: {
			desc: () => "Wait, it's all bricks? Always has been.",
			cost: () => Decimal.dInf,
			unl() { return player[this.layer].unl },
			extraReq() { return false },
			effect() {},
			style() { return {"background-color": "var(--background)", "color": "#fff2"} },
		},
		33: {
			desc: () => "One does not simply discover a brick.",
			cost: () => Decimal.dInf,
			unl() { return player[this.layer].unl },
			extraReq() { return false },
			effect() {},
			style() { return {"background-color": "var(--background)", "color": "#fff2"} },
		},
		34: {
			desc: () => "I'm sorry, but the brick is in this castle.",
			cost: () => Decimal.dInf,
			unl() { return player[this.layer].unl },
			extraReq() { return false },
			effect() {},
			style() { return {"background-color": "var(--background)", "color": "#fff2"} },
		},
		35: {
			desc: () => "Not yet implemented.",
			cost: () => new Decimal(0),
			unl() { return player[this.layer].unl },
			extraReq() { return false },
		},
	},
	
	buyables: {
	
		respec() { 
			player.wi.upgrades = []
			player.wi.bought = new Decimal(0)
			player.wi.knowledge = Decimal.add(player.wi.knowledge, player.wi.spent)
			player.wi.spent = new Decimal(0)
			doReset(this.layer, true)
		},
		respecText:() => "Respec Wisdom Discovers",
	},

	gainMult() {
		return new Decimal(1)
	},
	gainExp() {
		return new Decimal(1)
	},
	
	update(diff) {
		player.wi.knowledge = Decimal.add(player.wi.knowledge, tmp.layerEffs.wi.mul(diff))
	},

	tabFormat:
		["main-display",
			["prestige-button", function () { return "Gain " }],
			["blank", "5px"],
			["display-text",
				function () { return "You have at best " + format(player.wi.best, 0) + " wisdom." }],
			["blank", "5px"],
			["display-text",
				function () { return "You have " + format(player.wi.knowledge, 0) + " knowledge." }],
			["blank", "5px"],
			["display-text",
				function () { return "You have " + format(player.wi.points.sub(player.wi.bought), 0) + " undiscovered wisdom.<h5>You have " + formatWhole(player.wi.spent) + " spent knowledge.</h5>" }],
			"buyables", 
			"upgrades"
		],

	hotkeys: [
		{ key: "i", desc: "I: Gain wisdom", onPress() { doReset(this.layer) } },
	],

})
