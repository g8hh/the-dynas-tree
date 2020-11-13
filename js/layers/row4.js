
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
			allocated: 0,
			landsAvailable: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			landsAllocated: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		}
	},

	layerShown() { return hasUpg("wf", 25) || player[this.layer].unl },

	name: "manager",
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
		eff = eff.pow(tmp.buyables.wi[14].effect.second)
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
			effectDesc: () => "Each banking produces the banking before it. This will boost your builders' speed by a lot. You'll still need to manually do bankings sometimes though.",
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
			requirementDesc: () => "10 Managers",
			done() { return player[this.layer].best.gte(10) },
			effectDesc: () => "Managers now have the ability to manage jobs and lands.",
		},
		9: {
			requirementDesc: () => "Not available yet",
			done() { return false },
			effectDesc: () => "To be continued...",
		},
	},
	
	buyables: {
		respec() { 
			player.m.allocated = 0
			player.m.landsAllocated = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			resetBuyables(this.layer)
			doReset(this.layer, true)
		},
		respecText:() => "Respec Land & Jobs Allocation",
		rows: 1,
		cols: 10,
		11: {
			title: () => "Farmlands",
			cost(x) {
				return Decimal.add(8, Decimal.pow(1.2, x)).ceil()
			},
			effect(x) {
				return Decimal.pow(x.add(1), 12 * Math.E)
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "You have " + format(player[this.layer].buyables[this.id], 0) + " farmlands, which are boosting point generation by ×" + format(data.effect) + "." + "\nAllocation cost: " + formatWhole(data.cost) + " grasslands tiles and 1 managing power"
			},
			unl() { return true },
			canAfford() { return (!player.m.landsUndoMode && Decimal.gte(player.m.landsAvailable[1] - player.m.landsAllocated[1], tmp.buyables.m[11].cost) && player.m.points.mul(2).sub(player.m.allocated).gte(1)) || (player.m.landsUndoMode && player.m.buyables[11].gte(1)) },
			buy() {
				cost = tmp.buyables[this.layer][this.id].cost.toNumber()
				player.m.landsAllocated[1] += cost;
				player.m.allocated++;
				player.m.buyables[11] = player.m.buyables[11].add(1)
			},
			style() {
				return {
					"height": "200px",
				}
			}
		},
		12: {
			title: () => "Sheep Farm",
			cost(x) {
				return Decimal.add(5, Decimal.pow(1.2, x)).ceil()
			},
			effect(x) {
				return Decimal.pow(x.add(1), 15 * Math.E)
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "You have " + format(player[this.layer].buyables[this.id], 0) + " sheep farms, which are boosting point generation by ×" + format(data.effect) + "." + "\nAllocation cost: " + formatWhole(data.cost) + " tundra tiles and 1 managing power"
			},
			unl() { return true },
			canAfford() { return (!player.m.landsUndoMode && Decimal.gte(player.m.landsAvailable[5] - player.m.landsAllocated[5], tmp.buyables.m[12].cost) && player.m.points.mul(2).sub(player.m.allocated).gte(1)) || (player.m.landsUndoMode && player.m.buyables[12].gte(1)) },
			buy() {
				cost = tmp.buyables[this.layer][this.id].cost.toNumber()
				player.m.landsAllocated[5] += cost;
				player.m.allocated++;
				player.m.buyables[12] = player.m.buyables[12].add(1)
			},
			style() {
				return {
					"height": "200px",
				}
			}
		},
		13: {
			title: () => "Mine",
			cost(x) {
				return Decimal.add(3, Decimal.pow(1.2, x)).ceil()
			},
			effect(x) {
				return Decimal.pow(x.add(1), 20 * Math.E)
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "You have " + format(player[this.layer].buyables[this.id], 0) + " mines, which are boosting point generation by ×" + format(data.effect) + "." + "\nAllocation cost: " + formatWhole(data.cost) + " mountain tiles and 1 managing power"
			},
			unl() { return true },
			canAfford() { return (!player.m.landsUndoMode && Decimal.gte(player.m.landsAvailable[2] - player.m.landsAllocated[2], tmp.buyables.m[13].cost) && player.m.points.mul(2).sub(player.m.allocated).gte(1)) || (player.m.landsUndoMode && player.m.buyables[13].gte(1)) },
			buy() {
				cost = tmp.buyables[this.layer][this.id].cost.toNumber()
				player.m.landsAllocated[2] += cost;
				player.m.allocated++;
				player.m.buyables[13] = player.m.buyables[13].add(1)
			},
			style() {
				return {
					"height": "200px",
				}
			}
		},
		14: {
			title: () => "Large Mine",
			cost(x) {
				return Decimal.add(1, Decimal.pow(1.2, x)).ceil()
			},
			effect(x) {
				return Decimal.pow(x.add(1), 30 * Math.E)
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "You have " + format(player[this.layer].buyables[this.id], 0) + " large mines, which are boosting point generation by ×" + format(data.effect) + "." + "\nAllocation cost: " + formatWhole(data.cost) + " tall mountain tiles and 1 managing power"
			},
			unl() { return true },
			canAfford() { return (!player.m.landsUndoMode && Decimal.gte(player.m.landsAvailable[3] - player.m.landsAllocated[3], tmp.buyables.m[14].cost) && player.m.points.mul(2).sub(player.m.allocated).gte(1)) || (player.m.landsUndoMode && player.m.buyables[14].gte(1)) },
			buy() {
				cost = tmp.buyables[this.layer][this.id].cost.toNumber()
				player.m.landsAllocated[3] += cost;
				player.m.allocated++;
				player.m.buyables[14] = player.m.buyables[14].add(1)
			},
			style() {
				return {
					"height": "200px",
				}
			}
		},
		15: {
			title: () => "Wood Workshop",
			cost(x) {
				return Decimal.add(5, Decimal.pow(1.2, x)).ceil()
			},
			effect(x) {
				return Decimal.pow(x.add(1), 16 * Math.E)
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "You have " + format(player[this.layer].buyables[this.id], 0) + " wood workshops, which are boosting point generation by ×" + format(data.effect) + "." + "\nAllocation cost: " + formatWhole(data.cost) + " forest tiles and 1 managing power"
			},
			unl() { return true },
			canAfford() { return (!player.m.landsUndoMode && Decimal.gte(player.m.landsAvailable[6] - player.m.landsAllocated[6], tmp.buyables.m[15].cost) && player.m.points.mul(2).sub(player.m.allocated).gte(1)) || (player.m.landsUndoMode && player.m.buyables[15].gte(1)) },
			buy() {
				cost = tmp.buyables[this.layer][this.id].cost.toNumber()
				player.m.landsAllocated[6] += cost;
				player.m.allocated++;
				player.m.buyables[15] = player.m.buyables[15].add(1)
			},
			style() {
				return {
					"height": "200px",
				}
			}
		},
		16: {
			title: () => "Large Wood Workshop",
			cost(x) {
				return Decimal.add(5, Decimal.pow(1.2, x)).ceil()
			},
			effect(x) {
				return Decimal.pow(x.add(1), 18 * Math.E)
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "You have " + format(player[this.layer].buyables[this.id], 0) + " large wood workshops, which are boosting point generation by ×" + format(data.effect) + "." + "\nAllocation cost: " + formatWhole(data.cost) + " rainforest tiles and 1 managing power"
			},
			unl() { return true },
			canAfford() { return (!player.m.landsUndoMode && Decimal.gte(player.m.landsAvailable[8] - player.m.landsAllocated[8], tmp.buyables.m[16].cost) && player.m.points.mul(2).sub(player.m.allocated).gte(1)) || (player.m.landsUndoMode && player.m.buyables[16].gte(1)) },
			buy() {
				cost = tmp.buyables[this.layer][this.id].cost.toNumber()
				player.m.landsAllocated[8] += cost;
				player.m.allocated++;
				player.m.buyables[16] = player.m.buyables[16].add(1)
			},
			style() {
				return {
					"height": "200px",
				}
			}
		},
		17: {
			title: () => "Savanna Transportation",
			cost(x) {
				return Decimal.add(5, Decimal.pow(1.2, x)).ceil()
			},
			effect(x) {
				return Decimal.pow(x.add(1), 15 * Math.E)
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "You have " + format(player[this.layer].buyables[this.id], 0) + " savanna transportations, which are boosting point generation by ×" + format(data.effect) + "." + "\nAllocation cost: " + formatWhole(data.cost) + " savanna tiles and 1 managing power"
			},
			unl() { return true },
			canAfford() { return (!player.m.landsUndoMode && Decimal.gte(player.m.landsAvailable[7] - player.m.landsAllocated[7], tmp.buyables.m[17].cost) && player.m.points.mul(2).sub(player.m.allocated).gte(1)) || (player.m.landsUndoMode && player.m.buyables[17].gte(1)) },
			buy() {
				cost = tmp.buyables[this.layer][this.id].cost.toNumber()
				player.m.landsAllocated[7] += cost;
				player.m.allocated++;
				player.m.buyables[17] = player.m.buyables[17].add(1)
			},
			style() {
				return {
					"height": "200px",
				}
			}
		},
		18: {
			title: () => "Desert Transportation",
			cost(x) {
				return Decimal.add(5, Decimal.pow(1.2, x)).ceil()
			},
			effect(x) {
				return Decimal.pow(x.add(1), 18 * Math.E)
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "You have " + format(player[this.layer].buyables[this.id], 0) + " desert transportations, which are boosting point generation by ×" + format(data.effect) + "." + "\nAllocation cost: " + formatWhole(data.cost) + " desert tiles and 1 managing power"
			},
			unl() { return true },
			canAfford() { return (!player.m.landsUndoMode && Decimal.gte(player.m.landsAvailable[4] - player.m.landsAllocated[4], tmp.buyables.m[18].cost) && player.m.points.mul(2).sub(player.m.allocated).gte(1)) || (player.m.landsUndoMode && player.m.buyables[18].gte(1)) },
			buy() {
				cost = tmp.buyables[this.layer][this.id].cost.toNumber()
				player.m.landsAllocated[4] += cost;
				player.m.allocated++;
				player.m.buyables[18] = player.m.buyables[18].add(1)
			},
			style() {
				return {
					"height": "200px",
				}
			}
		},
		19: {
			title: () => "Fish Farm",
			cost(x) {
				return Decimal.add(1, Decimal.pow(1.2, x)).ceil()
			},
			effect(x) {
				return Decimal.pow(x.add(1), 100 * Math.E)
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "You have " + format(player[this.layer].buyables[this.id], 0) + " fish farms, which are boosting point generation by ×" + format(data.effect) + "." + "\nAllocation cost: " + formatWhole(data.cost) + " waters tiles and 1 managing power"
			},
			unl() { return true },
			canAfford() { return (!player.m.landsUndoMode && Decimal.gte(player.m.landsAvailable[0] - player.m.landsAllocated[0], tmp.buyables.m[19].cost) && player.m.points.mul(2).sub(player.m.allocated).gte(1)) || (player.m.landsUndoMode && player.m.buyables[19].gte(1)) },
			buy() {
				cost = tmp.buyables[this.layer][this.id].cost.toNumber()
				player.m.landsAllocated[0] += cost;
				player.m.allocated++;
				player.m.buyables[19] = player.m.buyables[19].add(1)
			},
			style() {
				return {
					"height": "200px",
				}
			}
		},
		20: {
			title: () => "Ice Farm",
			cost(x) {
				return Decimal.add(1, Decimal.pow(1.2, x)).ceil()
			},
			effect(x) {
				return Decimal.pow(x.add(1), 250 * Math.E)
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "You have " + format(player[this.layer].buyables[this.id], 0) + " ice farms, which are boosting point generation by ×" + format(data.effect) + "." + "\nAllocation cost: " + formatWhole(data.cost) + " iced waters tiles and 1 managing power"
			},
			unl() { return true },
			canAfford() { return (!player.m.landsUndoMode && Decimal.gte(player.m.landsAvailable[9] - player.m.landsAllocated[9], tmp.buyables.m[20].cost) && player.m.points.mul(2).sub(player.m.allocated).gte(1)) || (player.m.landsUndoMode && player.m.buyables[20].gte(1)) },
			buy() {
				cost = tmp.buyables[this.layer][this.id].cost.toNumber()
				player.m.landsAllocated[9] += cost;
				player.m.allocated++;
				player.m.buyables[20] = player.m.buyables[20].add(1)
			},
			style() {
				return {
					"height": "200px",
				}
			}
		},
	},
	
	microtabs: {
		stuff: {
			milestones: { title: () => "Milestones", unl: () => hasMilestone("m", 8), content: [
				"milestones"
			]},
			lands: { title: () => "Land & Jobs Management", unl: () => hasMilestone("m", 8), content: [
				["display-text",
					function () { return "You have allocated " + format(player.m.allocated, 0) + " / " + format(player.m.points.mul(2), 0) + ` managing power.<h5>Each manager gives 2 managing power.<br/>Total land multiplier to point generation: ×` + format(tmp.landMul) }],
				["blank", "5px"],
				"respec-button",
				["blank", "5px"],
				["display-text",
					function () { return "<h3>[<span style='color:#7FFF00'>;;;</span>] Grasslands</h3><h5>" + formatWhole(player.m.landsAllocated[1]) + " / " + formatWhole(player.m.landsAvailable[1]) + " allocated</h5>" + "<br/><p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
				["row", [["buyable", 11]]],
				["blank", "5px"],
				["display-text",
					function () { return "<h3>[<span style='color:#FFFFFF'>:::</span>] Tundra</h3><h5>" + formatWhole(player.m.landsAllocated[5]) + " / " + formatWhole(player.m.landsAvailable[5]) + " allocated</h5>" + "<br/><p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
				["row", [["buyable", 12]]],
				["blank", "5px"],
				["display-text",
					function () { return "<h3>[<span style='color:#7FFF00'>^^^</span>] Mountains</h3><h5>" + formatWhole(player.m.landsAllocated[2]) + " / " + formatWhole(player.m.landsAvailable[2]) + " allocated</h5>" + "<br/><p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
				["row", [["buyable", 13]]],
				["blank", "5px"],
				["display-text",
					function () { return "<h3>[<span style='color:#FFFFFF'>AAA</span>] Tall Mountains</h3><h5>" + formatWhole(player.m.landsAllocated[3]) + " / " + formatWhole(player.m.landsAvailable[3]) + " allocated</h5>" + "<br/><p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
				["row", [["buyable", 14]]],
				["blank", "5px"],
				["display-text",
					function () { return "<h3>[<span style='color:#00FF00'>TTT</span>] Forest</h3><h5>" + formatWhole(player.m.landsAllocated[6]) + " / " + formatWhole(player.m.landsAvailable[6]) + " allocated</h5>" + "<br/><p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
				["row", [["buyable", 15]]],
				["blank", "5px"],
				["display-text",
					function () { return "<h3>[<span style='color:#007F00'>♠♠♠</span>] Rainforest</h3><h5>" + formatWhole(player.m.landsAllocated[8]) + " / " + formatWhole(player.m.landsAvailable[8]) + " allocated</h5>" + "<br/><p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
				["row", [["buyable", 16]]],
				["blank", "5px"],
				["display-text",
					function () { return "<h3>[<span style='color:#FFFF7F'>,,,</span>] Savanna</h3><h5>" + formatWhole(player.m.landsAllocated[7]) + " / " + formatWhole(player.m.landsAvailable[7]) + " allocated</h5>" + "<br/><p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
				["row", [["buyable", 17]]],
				["blank", "5px"],
				["display-text",
					function () { return "<h3>[<span style='color:#FFFF7F'>...</span>] Desert</h3><h5>" + formatWhole(player.m.landsAllocated[4]) + " / " + formatWhole(player.m.landsAvailable[4]) + " allocated</h5>" + "<br/><p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
				["row", [["buyable", 18]]],
				["blank", "5px"],
				["display-text",
					function () { return "<h3>[<span style='color:#0000FF'>~~~</span>] Waters</h3><h5>" + formatWhole(player.m.landsAllocated[0]) + " / " + formatWhole(player.m.landsAvailable[0]) + " allocated</h5>" + "<br/><p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
				["row", [["buyable", 19]]],
				["blank", "5px"],
				["display-text",
					function () { return "<h3>[<span style='color:#7F7FFF'>~~~</span>] Iced Waters</h3><h5>" + formatWhole(player.m.landsAllocated[9]) + " / " + formatWhole(player.m.landsAvailable[9]) + " allocated</h5>" + "<br/><p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
				["row", [["buyable", 20]]],
				["blank", "5px"],
			]},
		}
	},

	tabFormat:
		["main-display",
			["prestige-button", function () { return "Hire " }],
			["blank", "5px"],
			["display-text",
				function () { return "You have at best " + format(player.m.best, 0) + " " + " managers." }],
			["blank", "5px"], ["microtabs", "stuff"],
		],

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
		var speedPow = new Decimal(2)
		
		eff.speed = Decimal.pow(player.bd.allocated, speedPow).mul(player.c.points.add(1).log(100).add(1))
		if (hasChall("t", 11)) eff.speed = eff.speed.mul(tmp.challs.t[11].effect)
		if (tmp.buyables.bd[22].effect) eff.speed = eff.speed.mul(tmp.buyables.bd[22].effect)
		eff.speed = eff.speed.mul(tmp.buyables.wi[14].effect.first)
		
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
						'<br/><input id="builderAllocator" type="range" min="1" max="' + player.bd.points.toNumber() + '" value="' + player.bd.allocated + '" style="width:75%;background-color:white" list="tickmarks" oninput="{player.bd.allocated = new Decimal(document.getElementById(' + "'builderAllocator'" + ').value)}"><br/>' +
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
			elo: new Decimal(1000),
			autoAutoToggles: false,
			autoWorkerUpgrade: false,
			autoFinderUpgrade: false,
			autoSpells: false,
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
		4: {
			requirementDesc: () => "15 Territories",
			done() { return player[this.layer].best.gte(15) },
			effectDesc: () => "You can automate casting spells.",
			toggles: [["t", "autoSpells"]],
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
				["display-text", function () { return "Your current honor is " + formatWhole(player.t.elo) + "." }], 
				["blank", "0px"], "map-box", ["blank", "0px"],
				["info-box", [
					["display-text", function () { return "Selected Tile: " + mapFocusDesc + "<br/><p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>"}],
					["display-text", function () { 
						let entCha = mapFocusDesc === "Unselected" ? 0 : getMapEncounterChance(mapFocusX, mapFocusY)
					return (
						mapFocusDesc === "Unselected" ? "<h5>Click on a tile on the map to view its details.<br/><br/>Drag the tiles to move the map around.</h5>" :
						isConquered(mapFocusX, mapFocusY) ? "<h5>This land has already been conquered.<br/><br/>You can not reconquer the land that you already conquered, duh!</h5>" : 
						"<h5>Difficulty: " + format(getMapDifficulty(mapFocusX, mapFocusY)) + " -> Best Conquer Time: " + formatTime(Decimal.div(getMapDifficulty(mapFocusX, mapFocusY), soldierStats.spd)) + "<br/>Encounter Chance: " + (entCha.eq(0) ? "not present" : "about " + (entCha.lt(1) ? "once every " + formatTime(Decimal.div(1, entCha)) : format(entCha, 3) + " every second")) + (isConquerable(mapFocusX, mapFocusY) ? (player.world.conquering && player.world.conquerX == mapFocusX && player.world.conquerY == mapFocusY ? "<br/>You are conquering this tile. Click it again to abort conquering." : "<br/>Click on the tile again to initialize conquering on that tile.") : "<br/>This tile is too far for you to initialize conquering.")
					) + "<p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }]
					], {"width": "480px"}
				], 
				["row", [
					["info-box", [
						["display-text", function () { return "Your Soldiers<h5 style='font-size:6px'><br/>" }],
						["mini-bar", function () { return format(Decimal.div(player.world.health, soldierStats.mhp)) }, {"background-color": "#300"}],
						["display-text", function () { return "<h5>Health: " + formatWhole(player.world.health) + " / " + formatWhole(soldierStats.mhp) + "</h5>" }],
						["display-text", function () { return "<h5>Power: " + formatWhole(Decimal.div(player.world.health, soldierStats.mhp).mul(soldierStats.atk)) + " / " + formatWhole(soldierStats.atk) + "</h5>" }],
						["display-text", function () { return "<h5>Honor: " + format(player.t.elo) + "</h5>" }],
						], {"width": "228px"}
					], 
					["info-box", [
						["display-text", function () { return (player.world.encounter ? player.world.encounter.name : "No Encounters") + "<h5 style='font-size:6px'><br/>" + "<p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
						["mini-bar", function () { return format(player.world.encounter ? Decimal.div(player.world.encounter.health, player.world.encounter.maxhealth) : 0) + (player.time * 10 % 1 ? "0" : "") }, {"background-color": "#300"}],
						["display-text", function () { return "<h5>Health: " + (player.world.encounter ? formatWhole(player.world.encounter.health) + " / " + formatWhole(player.world.encounter.maxhealth) : "----- / -----") + "</h5>" + "<p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
						["display-text", function () { return "<h5>Power: " + (player.world.encounter ? formatWhole(Decimal.div(player.world.encounter.health, player.world.encounter.maxhealth).mul(player.world.encounter.power)) + " / " + formatWhole(player.world.encounter.power) : "----- / -----") + "</h5>" + "<p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
						["display-text", function () { return "<h5>Honor: " + (player.world.encounter ? format(player.world.encounter.elo) : "-----") + "</h5>" + "<p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
						], {"width": "228px"}
					], 
				]],
				["info-box", [
					["display-text", function () { return (
						player.world.conquering ? "Conquering " + player.world.conquerTarget + "..." : "Soldiers are Idling."
						) + "<p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>"
					}],
					["display-text", function () { return (
						player.world.conquering ? "<h5>Progress: " + formatWhole(player.world.conquerProgress) + " / " + formatWhole(player.world.conquerGoal) + "<br/>" + (player.world.encounter ? "Conquering is paused because soldiers are battling the encounters." : "ETA: " + formatTime(new Decimal(player.world.conquerGoal).sub(player.world.conquerProgress).div(Decimal.div(player.world.health, soldierStats.mhp).mul(soldierStats.spd))) + "</h5>") : "<h5>Please select a land to be conquered.<br/></h5>"
						) + "<p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>"
					}],
					], {"width": "480px"}
				], 
				["bar", function () { return format(player.world.conquering ? Decimal.div(player.world.conquerProgress, player.world.conquerGoal) : 0) }, {"background-color": "#333"}],
				["blank", "5px"],
				] 
			},
        },
	},
	
	update(diff) {
		if (player.world === undefined) player.world = {}
		if (player.world.conquering) {
			if (!soldierStats) {
			}
			else if (player.world.encounter) {
				let ppow = Decimal.div(player.world.health, soldierStats.mhp).mul(soldierStats.atk)
				let epow = Decimal.div(player.world.encounter.health, player.world.encounter.maxhealth).mul(player.world.encounter.power)
				if (ppow.toString() !== "(e^NaN)NaN" && epow.toString() !== "(e^NaN)NaN") {
					player.world.encounter.health = Decimal.sub(player.world.encounter.health, ppow.mul(diff))
					player.world.health = Decimal.sub(player.world.health, epow.mul(diff))
				}
				
				if (player.world.encounter.health.lte(0)) {
					player.t.elo = getNewElo(player.t.elo, player.world.encounter.elo)
					player.world.encounter = undefined
				}
				if (player.world.health.lte(0)) {
					player.world.health = new Decimal(0)
					abortConquering()
				}
			} else {
				let delta = Decimal.div(player.world.health, soldierStats.mhp).mul(soldierStats ? soldierStats.spd : 0)
				player.world.conquerProgress = Decimal.add(player.world.conquerProgress, Decimal.mul(delta, diff))
				if (player.world.conquerProgress.gte(player.world.conquerGoal)) {
					player.world.conquerProgress = new Decimal(0)
					doneConquering()
				}
				var prob = Decimal.sub(1, Decimal.sub(1, player.world.encounterChance).pow(diff))
				if (prob.gte(Math.random()))
					player.world.encounter = getMapEncounter(player.world.conquerX, player.world.conquerY)
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

	requires: () => {
		let req = new Decimal("e18")
		if (hasUpg("wi", 85)) req = new Decimal("e50")
		if (hasUpg("wi", 35)) req = req.div(tmp.upgrades.wi[35].effect)
		if (hasUpg("wi", 43)) req = req.div(tmp.upgrades.wi[43].effect)
		if (hasUpg("wi", 75)) req = req.div(tmp.upgrades.wi[75].effect)
		req = req.div(tmp.buyables.wi[13].effect.add ? tmp.buyables.wi[13].effect.pow(tmp.buyables.wi[13].effect.add(1).log(1e10).add(1)).pow(tmp.buyables.wi[13].effect.add(1).log(1e25).add(1)) : 1)
		return req
	},

	type: "static",
	base: () => hasUpg("wi", 85) ? 1e10 : 2,
	exponent: () => hasUpg("wi", 85) ? 3 : 2.6,
	canBuyMax: () => true,
	
	effect() {
		var ret = Decimal.pow(2, Decimal.pow(player.wi.points, 1.05)).sub(1)
		if (hasUpg("wi", 85)) ret = ret.add(1)
		if (tmp.buyables.wi[11].effect.add) ret = ret.add(tmp.buyables.wi[11].effect).mul(tmp.buyables.wi[11].effect.add(1))
		if (hasUpg("wi", 54)) ret = ret.mul(tmp.upgrades.wi[54].effect)
		if (hasUpg("wi", 65)) ret = ret.mul(tmp.upgrades.wi[65].effect)
		return ret
	},
	
	effectDescription() {
		return "which are generating " + format(tmp.layerEffs.wi) + " knowledge per second"
	},
	
	
	upgrades: {
		rows: 8,
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
				if (ret.gte("1e80")) ret = ret.mul("1e80").sqrt()
				if (ret.gte("1e160")) ret = ret.mul("1e160").sqrt()
				if (ret.gte("1e240")) ret = ret.mul("1e240").sqrt()
				if (ret.gte("1e320")) ret = ret.mul("1e320").sqrt()
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
				if (ret.gte("1e10")) ret = ret.mul("1e10").sqrt()
				if (ret.gte("1e20")) ret = ret.mul("1e20").sqrt()
				if (ret.gte("1e30")) ret = ret.mul("1e30").sqrt()
				if (ret.gte("1e40")) ret = ret.mul("1e40").sqrt()
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
			desc: () => "Reduces the “Convert spiritual power into castable magic fountain” cost scaling.",
			cost: () => new Decimal(25000),
			currencyLayer: "wi",
			currencyInternalName: "knowledge",
			currencyDisplayName: "knowledge",
			unl() { return player[this.layer].unl },
			extraReq() { return hasUpg("wi", 24) && player.wi.points.gt(player.wi.bought) },
			onPurchase() { player.wi.spent = Decimal.add(player.wi.spent, tmp.upgrades.wi[14].cost); player.wi.bought = Decimal.add(player.wi.bought, 1) }
		},
		15: {
			desc: () => "Raise the “Use spiritual power to power magic in advanced spells” upgrade based on schools.",
			cost: () => new Decimal(50000),
			currencyLayer: "wi",
			currencyInternalName: "knowledge",
			currencyDisplayName: "knowledge",
			unl() { return player[this.layer].unl },
			extraReq() { return (hasUpg("wi", 14) || hasUpg("wi", 25)) && player.wi.points.gt(player.wi.bought) },
			effect() {
				let ret = Decimal.pow(player.bd.buyables[31], 0.5).div(5).add(1)
				return ret;
			},
			effectDisplay(fx) { return "^" + format(fx) },
			onPurchase() { player.wi.spent = Decimal.add(player.wi.spent, tmp.upgrades.wi[15].cost); player.wi.bought = Decimal.add(player.wi.bought, 1) }
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
				if (ret.gte("1e15")) ret = ret.mul("1e15").sqrt()
				if (ret.gte("1e30")) ret = ret.mul("1e30").sqrt()
				if (ret.gte("1e45")) ret = ret.mul("1e45").sqrt()
				if (ret.gte("1e60")) ret = ret.mul("1e60").sqrt()
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
				if (ret.gte("1e25")) ret = ret.mul("1e25").sqrt()
				if (ret.gte("1e50")) ret = ret.mul("1e50").sqrt()
				if (ret.gte("1e75")) ret = ret.mul("1e75").sqrt()
				if (ret.gte("1e100")) ret = ret.mul("1e100").sqrt()
				return ret;
			},
			effectDisplay(fx) { return "×" + format(fx) },
			onPurchase() { player.wi.spent = Decimal.add(player.wi.spent, tmp.upgrades.wi[22].cost); player.wi.bought = Decimal.add(player.wi.bought, 1) }
		},
		23: {
			desc: () => "Unlocks a new banking option.",
			cost: () => new Decimal(10000),
			currencyLayer: "wi",
			currencyInternalName: "knowledge",
			currencyDisplayName: "knowledge",
			unl() { return player[this.layer].unl },
			extraReq() { return hasUpg("wi", 22) && player.wi.points.gt(player.wi.bought) },
			onPurchase() { player.wi.spent = Decimal.add(player.wi.spent, tmp.upgrades.wi[23].cost); player.wi.bought = Decimal.add(player.wi.bought, 1) }
		},
		24: {
			desc: () => "You gain 100% of your spiritual power gain on reset every second (only when you unlocked the layer).",
			cost: () => new Decimal(25000),
			currencyLayer: "wi",
			currencyInternalName: "knowledge",
			currencyDisplayName: "knowledge",
			unl() { return player[this.layer].unl },
			extraReq() { return hasUpg("wi", 23) && player.wi.points.gt(player.wi.bought) },
			onPurchase() { player.wi.spent = Decimal.add(player.wi.spent, tmp.upgrades.wi[24].cost); player.wi.bought = Decimal.add(player.wi.bought, 1) }
		},
		25: {
			desc: () => "Reduces the “Extend the fabric of time using spiritual power” cost scaling.",
			cost: () => new Decimal(25000),
			currencyLayer: "wi",
			currencyInternalName: "knowledge",
			currencyDisplayName: "knowledge",
			unl() { return player[this.layer].unl },
			extraReq() { return hasUpg("wi", 24) && player.wi.points.gt(player.wi.bought) },
			onPurchase() { player.wi.spent = Decimal.add(player.wi.spent, tmp.upgrades.wi[25].cost); player.wi.bought = Decimal.add(player.wi.bought, 1) }
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
			desc: () => "Honor reduces the requirements of wisdom.",
			cost: () => new Decimal(60000),
			currencyLayer: "wi",
			currencyInternalName: "knowledge",
			currencyDisplayName: "knowledge",
			unl() { return player[this.layer].unl },
			extraReq() { return hasUpg("wi", 25) && player.wi.points.gt(player.wi.bought) },
			effect() {
				let ret = Decimal.sub(player.t.elo, 1000).pow(Decimal.log10(player.t.elo).pow(1.8)).pow(Decimal.log(player.t.elo, 1e10).add(1))
				return ret;
			},
			effectDisplay(fx) { return "÷" + format(fx) },
			onPurchase() { player.wi.spent = Decimal.add(player.wi.spent, tmp.upgrades.wi[35].cost); player.wi.bought = Decimal.add(player.wi.bought, 1) }
		},
		41: {
			desc: () => "Knowledge adds time to the first exotic spell's effect.",
			cost: () => new Decimal(1e25),
			currencyLayer: "wi",
			currencyInternalName: "knowledge",
			currencyDisplayName: "knowledge",
			unl() { return player[this.layer].unl },
			extraReq() { return hasUpg("wi", 42) && player.wi.points.gt(player.wi.bought) },
			effect() {
				let ret = Decimal.pow(player.wi.knowledge, 0.08).mul(Decimal.add(player.wi.knowledge, 1).log(1e10)).pow(0.85)
				if (ret.gte(600)) ret = ret.mul(600).sqrt()
				if (ret.gte(3600)) ret = ret.mul(3600).sqrt()
				if (ret.gte(36000)) ret = ret.mul(36000).sqrt()
				return ret;
			},
			effectDisplay(fx) { return "+" + formatTime(fx) },
			onPurchase() { player.wi.spent = Decimal.add(player.wi.spent, tmp.upgrades.wi[41].cost); player.wi.bought = Decimal.add(player.wi.bought, 1) }
		},
		42: {
			desc: () => "Exotic spells are also be able to be casted by the auto spell milestone.",
			cost: () => new Decimal(1e16),
			currencyLayer: "wi",
			currencyInternalName: "knowledge",
			currencyDisplayName: "knowledge",
			unl() { return player[this.layer].unl },
			extraReq() { return hasUpg("wi", 43) && player.wi.points.gt(player.wi.bought) },
			onPurchase() { player.wi.spent = Decimal.add(player.wi.spent, tmp.upgrades.wi[42].cost); player.wi.bought = Decimal.add(player.wi.bought, 1) }
		},
		43: {
			desc: () => "Knowledge reduces the requirement of wisdom.",
			cost: () => new Decimal(1e10),
			currencyLayer: "wi",
			currencyInternalName: "knowledge",
			currencyDisplayName: "knowledge",
			unl() { return player[this.layer].unl },
			extraReq() { return hasUpg("wi", 44) && player.wi.points.gt(player.wi.bought) },
			effect() {
				let ret = Decimal.pow(player.wi.knowledge, 0.01).pow(Decimal.log(player.wi.knowledge, 2)).pow(Decimal.log(player.wi.knowledge, 10)).pow(Decimal.log(player.wi.knowledge, 1e10))
				if (ret.gte("1e2000")) ret = ret.mul("1e6000").pow(0.25)
				if (ret.gte("1e1500")) ret = ret.mul("1e4500").pow(0.25)
				if (ret.gte("1e1200")) ret = ret.mul("1e2400").cbrt()
				if (ret.gte("1e1000")) ret = ret.mul("1e2000").cbrt()
				if (ret.gte("1e800")) ret = ret.mul("1e800").sqrt()
				if (ret.gte("1e650")) ret = ret.mul("1e650").sqrt()
				if (ret.gte("1e500")) ret = ret.mul("1e500").sqrt()
				if (ret.gte("1e400")) ret = ret.mul("1e400").sqrt()
				if (ret.gte("1e300")) ret = ret.mul("1e300").sqrt()
				if (ret.gte("1e200")) ret = ret.mul("1e200").sqrt()
				if (ret.gte("1e150")) ret = ret.mul("1e150").sqrt()
				if (ret.gte("1e100")) ret = ret.mul("1e100").sqrt()
				return ret;
			},
			effectDisplay(fx) { return "÷" + format(fx) },
			onPurchase() { player.wi.spent = Decimal.add(player.wi.spent, tmp.upgrades.wi[43].cost); player.wi.bought = Decimal.add(player.wi.bought, 1) }
		},
		44: {
			desc: () => "Unlocks an exotic spell. Exotic spells are not affected by amount of shrines or spiritual power upgrades.",
			cost: () => new Decimal(150000),
			currencyLayer: "wi",
			currencyInternalName: "knowledge",
			currencyDisplayName: "knowledge",
			unl() { return player[this.layer].unl },
			extraReq() { return hasUpg("wi", 45) && player.wi.points.gt(player.wi.bought) },
			onPurchase() { player.wi.spent = Decimal.add(player.wi.spent, tmp.upgrades.wi[44].cost); player.wi.bought = Decimal.add(player.wi.bought, 1) }
		},
		45: {
			desc: () => "Knowledge boosts spiritual power gain.",
			cost: () => new Decimal(100000),
			currencyLayer: "wi",
			currencyInternalName: "knowledge",
			currencyDisplayName: "knowledge",
			unl() { return player[this.layer].unl },
			extraReq() { return hasUpg("wi", 35) && player.wi.points.gt(player.wi.bought) },
			effect() {
				let ret = Decimal.pow(player.wi.knowledge, 0.25).pow(Decimal.add(player.wi.knowledge, 1).log(100)).add(1)
				return ret;
			},
			effectDisplay(fx) { return "×" + format(fx) },
			onPurchase() { player.wi.spent = Decimal.add(player.wi.spent, tmp.upgrades.wi[45].cost); player.wi.bought = Decimal.add(player.wi.bought, 1) }
		},
		51: {
			desc: () => "Not yet implemented.",
			cost: () => new Decimal(0),
			unl() { return player[this.layer].unl },
			extraReq() { return false },
		},
		52: {
			desc: () => "Its-a-me, Brick-io!",
			cost: () => Decimal.dInf,
			unl() { return player[this.layer].unl },
			extraReq() { return false },
			effect() {},
			style() { return {"background-color": "var(--background)", "color": "#fff2"} },
		},
		53: {
			desc: () => "If you haven't realized it already, you can not discover bricked discoveries.",
			cost: () => Decimal.dInf,
			unl() { return player[this.layer].unl },
			extraReq() { return false },
			effect() {},
			style() { return {"background-color": "var(--background)", "color": "#fff2"} },
		},
		54: {
			desc: () => "Knowledge boosts knowledge gain. Yes, really.",
			cost: () => new Decimal(2500000),
			currencyLayer: "wi",
			currencyInternalName: "knowledge",
			currencyDisplayName: "knowledge",
			unl() { return player[this.layer].unl },
			extraReq() { return hasUpg("wi", 44) && player.wi.points.gt(player.wi.bought) },
			effect() {
				let ret = Decimal.pow(player.wi.knowledge, 0.4).pow(Decimal.add(player.wi.knowledge, 1).log(1e100).add(1))
				if (hasUpg("wi", 64)) ret = ret.mul(tmp.upgrades.wi[64].effect)
				if (ret.gte(1e160)) ret = ret.mul(1e320).cbrt()
				if (ret.gte(1e80)) ret = ret.mul(1e160).cbrt()
				if (ret.gte(1e40)) ret = ret.mul(1e40).sqrt()
				if (ret.gte(1e20)) ret = ret.mul(1e20).sqrt()
				return ret;
			},
			effectDisplay(fx) { return "×" + format(fx) },
			onPurchase() { player.wi.spent = Decimal.add(player.wi.spent, tmp.upgrades.wi[54].cost); player.wi.bought = Decimal.add(player.wi.bought, 1) }
		},
		55: {
			desc: () => "It's not just a placeholder, it's a brick.",
			cost: () => Decimal.dInf,
			unl() { return player[this.layer].unl },
			extraReq() { return false },
			effect() {},
			style() { return {"background-color": "var(--background)", "color": "#fff2"} },
		},
		61: {
			desc: () => "Not yet implemented.",
			cost: () => new Decimal(0),
			unl() { return player[this.layer].unl },
			extraReq() { return false },
		},
		62: {
			desc: () => "Not yet implemented.",
			cost: () => new Decimal(0),
			unl() { return player[this.layer].unl },
			extraReq() { return false },
		},
		63: {
			desc: () => "get bricked lol",
			cost: () => Decimal.dInf,
			unl() { return player[this.layer].unl },
			extraReq() { return false },
			effect() {},
			style() { return {"background-color": "var(--background)", "color": "#fff2"} },
		},
		64: {
			desc: () => "The upgrade above boosts that upgrade. Recursion.",
			cost: () => new Decimal(1e11),
			currencyLayer: "wi",
			currencyInternalName: "knowledge",
			currencyDisplayName: "knowledge",
			unl() { return player[this.layer].unl },
			extraReq() { return hasUpg("wi", 54) && player.wi.points.gt(player.wi.bought) },
			effect() {
				let ret = Decimal.pow(tmp.upgrades.wi[54].effect, 0.2).add(1)
				if (hasUpg("wi", 74)) ret = ret.mul(tmp.upgrades.wi[74].effect)
				if (ret.gte(1e160)) ret = ret.mul(1e320).cbrt()
				if (ret.gte(1e80)) ret = ret.mul(1e160).cbrt()
				if (ret.gte(1e40)) ret = ret.mul(1e40).sqrt()
				if (ret.gte(1e20)) ret = ret.mul(1e20).sqrt()
				if (ret.gte(1e10)) ret = ret.mul(1e10).sqrt()
				if (ret.gte(1e5)) ret = ret.mul(1e5).sqrt()
				return ret;
			},
			effectDisplay(fx) { return "×" + format(fx) },
			onPurchase() { player.wi.spent = Decimal.add(player.wi.spent, tmp.upgrades.wi[64].cost); player.wi.bought = Decimal.add(player.wi.bought, 1) }
		},
		65: {
			desc: () => "Schools boost knowledge gain.",
			cost: () => new Decimal(1e18),
			currencyLayer: "wi",
			currencyInternalName: "knowledge",
			currencyDisplayName: "knowledge",
			unl() { return player[this.layer].unl },
			extraReq() { return hasUpg("wi", 64) && player.wi.points.gt(player.wi.bought) },
			effect() {
				return Decimal.add(player.bd.buyables[31], 1)
			},
			effectDisplay(fx) { return "×" + format(fx) },
			onPurchase() { player.wi.spent = Decimal.add(player.wi.spent, tmp.upgrades.wi[65].cost); player.wi.bought = Decimal.add(player.wi.bought, 1) }
		},
		71: {
			desc: () => "Not yet implemented.",
			cost: () => new Decimal(0),
			unl() { return player[this.layer].unl },
			extraReq() { return false },
		},
		72: {
			desc: () => "Not yet implemented.",
			cost: () => new Decimal(0),
			unl() { return player[this.layer].unl },
			extraReq() { return false },
		},
		73: {
			desc: () => "This discovery is dimmed out, meaning this discovery it actually a brick and thus can not be discovered.",
			cost: () => Decimal.dInf,
			unl() { return player[this.layer].unl },
			extraReq() { return false },
			effect() {},
			style() { return {"background-color": "var(--background)", "color": "#fff2"} },
		},
		74: {
			desc: () => "The upgrade above boosts that upgrade again. Recursive recursion.",
			cost: () => new Decimal(1e21),
			currencyLayer: "wi",
			currencyInternalName: "knowledge",
			currencyDisplayName: "knowledge",
			unl() { return player[this.layer].unl },
			extraReq() { return hasUpg("wi", 64) && player.wi.points.gt(player.wi.bought) },
			effect() {
				let ret = Decimal.pow(tmp.upgrades.wi[64].effect, 0.2).add(1)
				if (ret.gte(1e160)) ret = ret.mul(1e320).cbrt()
				if (ret.gte(1e80)) ret = ret.mul(1e160).cbrt()
				if (ret.gte(1e40)) ret = ret.mul(1e40).sqrt()
				if (ret.gte(1e20)) ret = ret.mul(1e20).sqrt()
				if (ret.gte(1e10)) ret = ret.mul(1e10).sqrt()
				if (ret.gte(1e5)) ret = ret.mul(1e5).sqrt()
				return ret;
			},
			effectDisplay(fx) { return "×" + format(fx) },
			onPurchase() { player.wi.spent = Decimal.add(player.wi.spent, tmp.upgrades.wi[74].cost); player.wi.bought = Decimal.add(player.wi.bought, 1) }
		},
		75: {
			desc: () => "Spiritual power reduces the requirements of wisdom.",
			cost: () => new Decimal(1e30),
			currencyLayer: "wi",
			currencyInternalName: "knowledge",
			currencyDisplayName: "knowledge",
			unl() { return player[this.layer].unl },
			extraReq() { return (hasUpg("wi", 74) || hasUpg("wi", 65)) && player.wi.points.gt(player.wi.bought) },
			effect() {
				let ret = Decimal.add(player.sp.points, 1)
				for (var a = 1; a <= 30; a++) {
					if (ret.gte("1e" + a + "00")) ret = ret.mul("1e" + a + "00").sqrt()
				}
				return ret;
			},
			effectDisplay(fx) { return "÷" + format(fx) },
			onPurchase() { player.wi.spent = Decimal.add(player.wi.spent, tmp.upgrades.wi[75].cost); player.wi.bought = Decimal.add(player.wi.bought, 1) }
		},
		81: {
			desc: () => "Your wisdom has exceed this far and you're wanting to seek for more. You unlock a new layer, far higher than this one.",
			cost: () => new Decimal(25),
			unl() { return player[this.layer].unl },
			extraReq() { return false },
		},
		82: {
			desc: () => "Unfortunately, we no longer be able to find anymore brick puns so enjoy this line instead.",
			cost: () => Decimal.dInf,
			unl() { return player[this.layer].unl },
			extraReq() { return false },
			effect() {},
			style() { return {"background-color": "var(--background)", "color": "#fff2"} },
		},
		83: {
			desc: () => "Yay! You found me! I'm a brick!.",
			cost: () => Decimal.dInf,
			unl() { return player[this.layer].unl },
			extraReq() { return false },
			effect() {},
			style() { return {"background-color": "var(--background)", "color": "#fff2"} },
		},
		84: {
			desc: () => "Don't look at me, I'm a brick, you should be looking at this instead ->",
			cost: () => Decimal.dInf,
			unl() { return player[this.layer].unl },
			extraReq() { return false },
			effect() {},
			style() { return {"background-color": "var(--background)", "color": "#fff2"} },
		},
		85: {
			desc: () => "Unlock the Subjects tab. Note that this discovery will reset your wisdom back to 0 and will make them harder to get, so be ready first!",
			cost: () => new Decimal(21),
			unl() { return player[this.layer].unl },
			extraReq() { return hasUpg("wi", 75) },
			onPurchase() { 
				layers.wi.buyables.respec()
				player.wi.knowledge = new Decimal(0) 
				player.wi.points = new Decimal(0) 
			}
		},
	},
	
	buyables: {
	
		respec() { 
			var data = []
			if (hasUpg("wi", 85)) data.push(85)
			player.wi.upgrades = data
			player.wi.bought = new Decimal(0)
			player.wi.knowledge = Decimal.add(player.wi.knowledge, player.wi.spent)
			player.wi.spent = new Decimal(0)
			doReset(this.layer, true)
		},
		respecText:() => "Respec Wisdom Discovers",
		
		rows: 1,
		cols: 4,
		11: {
			title: () => "Philosophy",
			cost(x) {
				let cost = Decimal.pow(100, Decimal.pow(1.2, x))
				return cost.floor()
			},
			effect(x) { 
				x = x.add(player[this.layer].buyables[12])
				x = x.add(player[this.layer].buyables[13])
				return x.pow(Decimal.add(2, player[this.layer].buyables[this.id].div(5)))
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "Level " + player[this.layer].buyables[this.id] + "\n\
				Cost: " + formatWhole(data.cost) + " knowledge\n\
				Increases base knowledge gain and multiplies knowledge gain by +/×" + format(data.effect.add(1)) + "."
			},
			unl() { return true },
			canAfford() {
				return Decimal.gte(player.wi.knowledge, tmp.buyables[this.layer][this.id].cost)
			},
			buy() {
				cost = tmp.buyables[this.layer][this.id].cost
				player.wi.knowledge = Decimal.sub(player.wi.knowledge, cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
		},
		12: {
			title: () => "Mathematics",
			cost(x) {
				let cost = Decimal.pow(100, Decimal.pow(1.225, x)).mul(1000)
				return cost.floor()
			},
			effect(x) { 
				return Decimal.pow(1e8, x.mul(tmp.buyables.wi[11].effect.add(1).log(10).add(1).log(10).add(1)).pow(0.75).mul(Math.E).mul(Math.PI))
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "Level " + player[this.layer].buyables[this.id] + "\n\
				Cost: " + formatWhole(data.cost) + " knowledge\n\
				Increases the banking production multiplier by ×" + formatWhole(data.effect) + " (based on philosophy level). This equals to the production speed of “Point Banking” and gets raised by ^0.7 per every further banking. Also adds +" + formatWhole(player[this.layer].buyables[this.id]) + " to base “Philosophy” level."
			},
			unl() { return true },
			canAfford() {
				return Decimal.gte(player.wi.knowledge, tmp.buyables[this.layer][this.id].cost)
			},
			buy() {
				cost = tmp.buyables[this.layer][this.id].cost
				player.wi.knowledge = Decimal.sub(player.wi.knowledge, cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
		},
		13: {
			title: () => "Psychology",
			cost(x) {
				let cost = Decimal.pow(100, Decimal.pow(1.225, x)).mul(200000)
				return cost.floor()
			},
			effect(x) { 
				return Decimal.pow(1e3, x.mul(Decimal.add(player.wi.knowledge, 1).log(10).add(1)).pow(0.35).mul(Math.E))
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "Level " + player[this.layer].buyables[this.id] + "\n\
				Cost: " + formatWhole(data.cost) + " knowledge\n\
				Muliplies spiritual power gain by ×" + format(data.effect) + " and reduces spiritual power needed for wisdom gaining by ÷" + format(data.effect.pow(data.effect.add(1).log(1e10).add(1)).pow(data.effect.add(1).log(1e25).add(1))) + " (based on knowledge). Also adds +" + formatWhole(player[this.layer].buyables[this.id]) + " to base “Philosophy” level and +" + format(player[this.layer].buyables[this.id].div(5)) + " to “Philosophy” effect's exponent."
			},
			unl() { return true },
			canAfford() {
				return Decimal.gte(player.wi.knowledge, tmp.buyables[this.layer][this.id].cost)
			},
			buy() {
				cost = tmp.buyables[this.layer][this.id].cost
				player.wi.knowledge = Decimal.sub(player.wi.knowledge, cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
		},
		14: {
			title: () => "Physical Education",
			cost(x) {
				let cost = Decimal.pow(10000, Decimal.pow(1.225, x)).mul(2e11)
				return cost.floor()
			},
			effect(x) { 
				return {
					first: x.pow(2).mul(player.wi.points.add(1)).add(1),
					second: x.mul(2).add(1).mul(player.wi.points.add(1).pow(0.1)).pow(0.5)
				}
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "Level " + player[this.layer].buyables[this.id] + "\n\
				Cost: " + formatWhole(data.cost) + " knowledge\n\
				Muliplies finished work's effect and building speed by ×" + format(data.effect.first) + " and raises workers and managers' effect by ^" + format(data.effect.second) + " (based on wisdom). Also adds +" + formatWhole(player[this.layer].buyables[this.id]) + " to base “Philosophy” level."
			},
			unl() { return true },
			canAfford() {
				return Decimal.gte(player.wi.knowledge, tmp.buyables[this.layer][this.id].cost)
			},
			buy() {
				cost = tmp.buyables[this.layer][this.id].cost
				player.wi.knowledge = Decimal.sub(player.wi.knowledge, cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
		},
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
	
	microtabs: {
        stuff: {
            discoveries: { title: () => "Discoveries", unl: () => hasUpg("wi", 85), content: ["respec-button", ["blank", "5px"], "upgrades"] },
			subjects: { title: () => "Subjects", unl: () => hasUpg("wi", 85), content: ["buyables"] },
        },
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
			["microtabs", "stuff"]
		],

	hotkeys: [
		{ key: "i", desc: "I: Gain wisdom", onPress() { doReset(this.layer) } },
	],

})
