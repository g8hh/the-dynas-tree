
var mapFocusDesc = "Unselected"
var expansionDetails = [
	["display-text", () => "<h5>Click on a tile in the map to see its details. Drag the tiles on the map to see more of it.</h5>"]
]

// ----- Fourth row -----
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

	name: "经理",
	color: () => "#77FFFF",
	resource: "经理",
	row: 4,

	baseResource: "银行",
	baseAmount() { return player["b"].points },
	branches: [["w", 1], ["b", 1]],

	requires: () => new Decimal(22),

	type: "static",
	base: 1.22727,
	exponent: 1.01,
	canBuyMax: () => false,
	resetsNothing: () => hasMilestone("t", 6),
	
	effect() {
		var eff = Decimal.pow(64, player.m.points).pow(2)
		eff = eff.pow(tmp.buyables.wi[14].effect.second)
		return eff
	},
	effectDescription() {
		eff = tmp.layerEffs.m;
		return "使金币获取量和点数获取量变为 " + format(eff) + " 倍"
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
			effectDesc: () => "您可以批量雇佣工人、工作中介和建造银行。工人和工作中介直接解锁。初始拥有 " + format(1000000) + " 金币。每秒获得金币重置时的金币获取量10000%的金币。金币重置不再重置任何东西。一些之前层级的里程碑或升级中与此里程碑效果重复或被替换的项目，其效果也改变了。"
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
				return "您拥有 " + format(player[this.layer].buyables[this.id], 0) + " 农田，使点数产量变为 " + format(data.effect) + " 倍。" + "<br/>分配花费：" + formatWhole(data.cost) + " 草地方格和1点管理权力"
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
				return "您拥有 " + format(player[this.layer].buyables[this.id], 0) + " 绵羊牧场，使点数产量变为 " + format(data.effect) + " 倍。" + "<br/>分配花费：" + formatWhole(data.cost) + " 苔原方格和1点管理权力"
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
				return "您拥有 " + format(player[this.layer].buyables[this.id], 0) + " 矿井，使点数产量变为 " + format(data.effect) + " 倍。" + "<br/>分配花费：" + formatWhole(data.cost) + " 山脉方格和1点管理权力"
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
				return "您拥有 " + format(player[this.layer].buyables[this.id], 0) + " 大型矿井，使点数产量变为 " + format(data.effect) + " 倍。" + "<br/>分配花费：" + formatWhole(data.cost) + " 高山方格和1点管理权力"
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
				return "您拥有 " + format(player[this.layer].buyables[this.id], 0) + " 木作坊，使点数产量变为 " + format(data.effect) + " 倍。" + "<br/>分配花费：" + formatWhole(data.cost) + " 森林方格和1点管理权力"
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
				return "您拥有 " + format(player[this.layer].buyables[this.id], 0) + " 大型木作坊，使点数产量变为 " + format(data.effect) + " 倍。" + "<br/>分配花费：" + formatWhole(data.cost) + " 雨林方格和1点管理权力"
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
				return "您拥有 " + format(player[this.layer].buyables[this.id], 0) + " 荒原运输，使点数产量变为 " + format(data.effect) + " 倍。" + "<br/>分配花费：" + formatWhole(data.cost) + " 荒原方格和1点管理权力"
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
				return "您拥有 " + format(player[this.layer].buyables[this.id], 0) + " 沙漠运输，使点数产量变为 " + format(data.effect) + " 倍。" + "<br/>分配花费：" + formatWhole(data.cost) + " 沙漠方格和1点管理权力"
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
				return "您拥有 " + format(player[this.layer].buyables[this.id], 0) + " 养鱼场，使点数产量变为 " + format(data.effect) + " 倍。" + "<br/>分配花费：" + formatWhole(data.cost) + " 水域方格和1点管理权力"
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
				return "您拥有 " + format(player[this.layer].buyables[this.id], 0) + " 冰之农场，使点数产量变为 " + format(data.effect) + " 倍。" + "<br/>分配花费：" + formatWhole(data.cost) + " 浮冰方格和1点管理权力"
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
					function () { return "您共有 " + format(player.m.points.mul(2), 0) + " 点管理权力，已分配 " + format(player.m.allocated, 0) + " 点" + `管理权力。<h5>Each manager gives 2 managing power.<br/>土地对点数产量的总加成为：` + format(tmp.landMul) + ` 倍`}],
				["blank", "5px"],
				"respec-button",
				["blank", "5px"],
				["display-text",
					function () { return "<h3>[<span style='color:#7FFF00'>;;;</span>] 草地</h3><h5>共 " + formatWhole(player.m.landsAvailable[1]) + " ，已分配 " + formatWhole(player.m.landsAllocated[1]) + " </h5>" + "<br/><p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
				["row", [["buyable", 11]]],
				["blank", "5px"],
				["display-text",
					function () { return "<h3>[<span style='color:#FFFFFF'>:::</span>] 苔原</h3><h5>共 " + formatWhole(player.m.landsAvailable[5]) + " ，已分配 " + formatWhole(player.m.landsAllocated[5]) + " </h5>" + "<br/><p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
				["row", [["buyable", 12]]],
				["blank", "5px"],
				["display-text",
					function () { return "<h3>[<span style='color:#7FFF00'>^^^</span>] 山脉</h3><h5>共 " + formatWhole(player.m.landsAvailable[2]) + " ，已分配 " + formatWhole(player.m.landsAllocated[2]) + " </h5>" + "<br/><p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
				["row", [["buyable", 13]]],
				["blank", "5px"],
				["display-text",
					function () { return "<h3>[<span style='color:#FFFFFF'>AAA</span>] 高山</h3><h5>共 " + formatWhole(player.m.landsAvailable[3]) + " ，已分配 " + formatWhole(player.m.landsAllocated[3]) + " </h5>" + "<br/><p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
				["row", [["buyable", 14]]],
				["blank", "5px"],
				["display-text",
					function () { return "<h3>[<span style='color:#00FF00'>TTT</span>] 森林</h3><h5>共 " + formatWhole(player.m.landsAvailable[6]) + " ，已分配 " + formatWhole(player.m.landsAllocated[6]) + " </h5>" + "<br/><p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
				["row", [["buyable", 15]]],
				["blank", "5px"],
				["display-text",
					function () { return "<h3>[<span style='color:#007F00'>♠♠♠</span>] 雨林</h3><h5>共 " + formatWhole(player.m.landsAvailable[8]) + " ，已分配 " + formatWhole(player.m.landsAllocated[8]) + " </h5>" + "<br/><p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
				["row", [["buyable", 16]]],
				["blank", "5px"],
				["display-text",
					function () { return "<h3>[<span style='color:#FFFF7F'>,,,</span>] 荒原</h3><h5>共 " + formatWhole(player.m.landsAvailable[7]) + " ，已分配 " + formatWhole(player.m.landsAllocated[7]) + " </h5>" + "<br/><p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
				["row", [["buyable", 17]]],
				["blank", "5px"],
				["display-text",
					function () { return "<h3>[<span style='color:#FFFF7F'>...</span>] 沙漠</h3><h5>共 " + formatWhole(player.m.landsAvailable[4]) + " ，已分配 " + formatWhole(player.m.landsAllocated[4]) + " </h5>" + "<br/><p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
				["row", [["buyable", 18]]],
				["blank", "5px"],
				["display-text",
					function () { return "<h3>[<span style='color:#0000FF'>~~~</span>] 水域</h3><h5>共 " + formatWhole(player.m.landsAvailable[0]) + " ，已分配 " + formatWhole(player.m.landsAllocated[0]) + " </h5>" + "<br/><p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
				["row", [["buyable", 19]]],
				["blank", "5px"],
				["display-text",
					function () { return "<h3>[<span style='color:#7F7FFF'>~~~</span>] 浮冰</h3><h5>共 " + formatWhole(player.m.landsAvailable[9]) + " ，已分配 " + formatWhole(player.m.landsAllocated[9]) + " </h5>" + "<br/><p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
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
				function () { return "您最高拥有 " + format(player.m.best, 0) + " " + " 经理。" }],
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
	resource: "建造者",
	row: 4,

	baseResource: "工人",
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
			title: () => "酒馆",
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
					? "您拥有 " + format(player[this.layer].buyables[this.id], 0) + " 酒馆，因此找到和完成工作的速度变为了 " + format(data.effect) + " 倍。" + 
						(player.bd.building == 11 ? "<br/>" + 
						"进度：" + format(player.bd.progress, 0) + " / " + format(data.cost, 0) + " (" + format(Decimal.div(player.bd.progress, data.cost).mul(100)) + "%) <br/>" + 
						"预计完成时间：" + (Decimal.lte(tmp.layerEffs.bd.speed, 0) ? "永不" : formatTime(data.cost.sub(player.bd.progress).div(tmp.layerEffs.bd.speed))) + "<br/>" + 
						"点击此处以停止建造，现有进度将消失。" : "<br/>" + 
						"需要进度：" + format(data.cost, 0) + " <br/>" + 
						"点击此处以开始建造。")
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
			title: () => "居住区",
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
					? "您拥有 " + format(player[this.layer].buyables[this.id], 0) + " 居住区，因此前三行金币升级的效果变为了 " + format(data.effect) + " 倍。" + 
						(player.bd.building == 12 ? "<br/>" + 
						"进度：" + format(player.bd.progress, 0) + " / " + format(data.cost, 0) + " (" + format(Decimal.div(player.bd.progress, data.cost).mul(100)) + "%) <br/>" + 
						"预计完成时间：" + (Decimal.lte(tmp.layerEffs.bd.speed, 0) ? "永不" : formatTime(data.cost.sub(player.bd.progress).div(tmp.layerEffs.bd.speed))) + "<br/>" + 
						"点击此处以停止建造，现有进度将消失。" : "<br/>" + 
						"需要进度：" + format(data.cost, 0) + " <br/>" + 
						"点击此处以开始建造。")
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
			title: () => "圣地",
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
					? "您拥有 " + format(player[this.layer].buyables[this.id], 0) + " 圣地。" + (player[this.layer].buyables[this.id].gte(1) ? (player[this.layer].buyables[this.id].gte(7) ? "建造后可以使魔咒变得更强。" : "建造后可解锁另一个魔咒。") : "建造后可解锁另一个层级。") + 
						(player.bd.building == 13 ? "<br/>" + 
						"进度：" + format(player.bd.progress, 0) + " / " + format(data.cost, 0) + " (" + format(Decimal.div(player.bd.progress, data.cost).mul(100)) + "%) <br/>" + 
						"预计完成时间：" + (Decimal.lte(tmp.layerEffs.bd.speed, 0) ? "永不" : formatTime(data.cost.sub(player.bd.progress).div(tmp.layerEffs.bd.speed))) + "<br/>" + 
						"点击此处以停止建造，现有进度将消失。" : "<br/>" + 
						"需要进度：" + format(data.cost, 0) + " <br/>" + 
						"点击此处以开始建造。")
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
			title: () => "道路",
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
					? "您拥有 " + format(player[this.layer].buyables[this.id], 0) + " 道路。" + (player[this.layer].buyables[this.id].gte(1) ? (player[this.layer].buyables[this.id].gte(6) ? "建造后可以使障碍给予的奖励变得更多。" : "建造后可解锁另一个障碍。") : "建造后可解锁另一个转生层级。") + 
						(player.bd.building == 21 ? "<br/>" + 
						"进度：" + format(player.bd.progress, 0) + " / " + format(data.cost, 0) + " (" + format(Decimal.div(player.bd.progress, data.cost).mul(100)) + "%) <br/>" + 
						"预计完成时间：" + (Decimal.lte(tmp.layerEffs.bd.speed, 0) ? "永不" : formatTime(data.cost.sub(player.bd.progress).div(tmp.layerEffs.bd.speed))) + "<br/>" + 
						"点击此处以停止建造，现有进度将消失。" : "<br/>" + 
						"需要进度：" + format(data.cost, 0) + " <br/>" + 
						"点击此处以开始建造。")
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
			title: () => "建筑工地",
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
					? "您拥有 " + format(player[this.layer].buyables[this.id], 0) + " 建筑工地，因此建造者的建造速度变为了 " + format(data.effect) + " 倍。" + 
						(player.bd.building == 22 ? "<br/>" + 
						"进度：" + format(player.bd.progress, 0) + " / " + format(data.cost, 0) + " (" + format(Decimal.div(player.bd.progress, data.cost).mul(100)) + "%) <br/>" + 
						"预计完成时间：" + (Decimal.lte(tmp.layerEffs.bd.speed, 0) ? "永不" : formatTime(data.cost.sub(player.bd.progress).div(tmp.layerEffs.bd.speed))) + "<br/>" + 
						"点击此处以停止建造，现有进度将消失。" : "<br/>" + 
						"需要进度：" + format(data.cost, 0) + " <br/>" + 
						"点击此处以开始建造。")
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
			title: () => "军事基地",
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
					? "您拥有 " + format(player[this.layer].buyables[this.id], 0) + " 军事基地。" + (player[this.layer].buyables[this.id].gte(1) ? "" : "建造后可解锁另一个转生层级。") + 
						(player.bd.building == 23 ? "<br/>" + 
						"进度：" + format(player.bd.progress, 0) + " / " + format(data.cost, 0) + " (" + format(Decimal.div(player.bd.progress, data.cost).mul(100)) + "%) <br/>" + 
						"预计完成时间：" + (Decimal.lte(tmp.layerEffs.bd.speed, 0) ? "永不" : formatTime(data.cost.sub(player.bd.progress).div(tmp.layerEffs.bd.speed))) + "<br/>" + 
						"点击此处以停止建造，现有进度将消失。" : "<br/>" + 
						"需要进度：" + format(data.cost, 0) + " <br/>" + 
						"点击此处以开始建造。")
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
			title: () => "学校",
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
					? "您拥有 " + format(player[this.layer].buyables[this.id], 0) + " 学校。" + (player[this.layer].buyables[this.id].gte(1) ? "" : "建造后可解锁另一个转生层级。") + 
						(player.bd.building == 31 ? "<br/>" + 
						"进度：" + format(player.bd.progress, 0) + " / " + format(data.cost, 0) + " (" + format(Decimal.div(player.bd.progress, data.cost).mul(100)) + "%) <br/>" + 
						"预计完成时间：" + (Decimal.lte(tmp.layerEffs.bd.speed, 0) ? "永不" : formatTime(data.cost.sub(player.bd.progress).div(tmp.layerEffs.bd.speed))) + "<br/>" + 
						"点击此处以停止建造，现有进度将消失。" : "<br/>" + 
						"需要进度：" + format(data.cost, 0) + " <br/>" + 
						"点击此处以开始建造。")
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
				function () { return "您最高拥有 " + format(player.bd.best, 0) + " " + " 建造者。" }],
			["blank", "5px"],
			["display-text",
				function () { return player.bd.points.gte(1) ? "您已经分配了 " + format(player.bd.allocated, 0) + " 建造者，获得了 " + format(tmp.layerEffs.bd.speed) + " 的建造速度(也跟目前的金币数量有关)，但也会使金币获取量和点数产量变为原来的 ^" + format(tmp.layerEffs.bd.penalty, 5).replace(",", "") + " ，直到您停止建造为止。" : "" }],
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
			autoSpellRebuyables: false,
		}
	},

	layerShown() { return player.bd.buyables[21].gte(1) || player[this.layer].unl },

	color: () => "#77FFAA",
	resource: "领土",
	row: 4,

	baseResource: "金币",
	baseAmount() { return player.c.points },
	branches: [["w", 2], ["c", 2]],

	requires: () => new Decimal("e520").div(tmp.layerEffs ? tmp.layerEffs.t.territoryRed : 1),
	
	effect() {
		return {
			territoryRed: Decimal.pow(100, Decimal.pow(player.t.lands, 0.9)),
			soldierRed: Decimal.pow(10, Decimal.pow(player.t.lands, 0.6)),
			queueLength: player.t.points.div(10).add(player.bd.buyables[23].add(1).pow(0.5).sub(1)).floor().toNumber(),
		}
	},

	type: "static",
	base: "1e30",
	exponent: 1.5,
	canBuyMax: () => hasMilestone("t", 3),
	resetsNothing: () => hasMilestone("t", 6),

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
            name:() => "最初的障碍",
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
			currencyDisplayName: "点数",
			currencyInternalName: "points",
			unl:() => player.t.best.gte(1),
        },
        12: {
            name:() => "中介失业了",
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
			currencyDisplayName: "点数",
			currencyInternalName: "points",
			unl:() => player.bd.buyables[21].gte(2),
        },
        21: {
            name:() => "市场崩盘",
			desc:() => "您无法使用银行层级 <i>和</i> 工作中介层级。",
			reward:() => "You can access more banking options.",
			countsAs: [12],
			goal:() => new Decimal("e206"),
			currencyDisplayName: "点数",
			currencyInternalName: "points",
			unl:() => player.bd.buyables[21].gte(3),
        },
        22: {
            name:() => "从头开始",
			desc:() => "您无法使用 <i>任何</i> 低于此层级的层级(当然，金币层级除外)。",
			reward:() => "Boost the first two obstacles' buffs based on your total territory count.",
			effect:() => player.t.best.add(1).sqrt(),
			effectDisplay:(eff) => "×" + format(eff),
			countsAs: [12, 21],
			goal:() => new Decimal("e50"),
			currencyDisplayName: "点数",
			currencyInternalName: "points",
			unl:() => player.bd.buyables[21].gte(4),
        },
		31: {
            name:() => "花不出去的金币",
			desc:() => "“From Square One” and “Time Banking”'s debuff are applied at once.",
			reward:() => "You unlock more spiritual power rebuyable upgrades.",
			countsAs: [12, 21, 22],
			goal:() => new Decimal(1500000),
			currencyDisplayName: "点数",
			currencyInternalName: "points",
			unl:() => player.bd.buyables[21].gte(5),
        },
		32: {
            name:() => "无力的多元",
			desc:() => "“From Square One” and “Metacoin Banking”'s debuff are applied at once.",
			reward:() => "Boost the first two obstacles' buffs based on your number of roads.",
			effect:() => player.bd.buyables[21].add(1).sqrt(),
			effectDisplay:(eff) => "×" + format(eff),
			countsAs: [12, 21, 22],
			goal:() => new Decimal(5000000),
			currencyDisplayName: "点数",
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
		5: {
			requirementDesc: () => "40 Territories",
			done() { return player[this.layer].best.gte(40) },
			effectDesc: () => "You can automate buying spell rebuyables.",
			toggles: [["t", "autoSpellRebuyables"]],
		},
		6: {
			requirementDesc: () => "80 Territories",
			unl() { return player.so.buyables[13].gte(1) },
			done() { return player[this.layer].best.gte(80) },
			effectDesc: () => "Unlock The Queue, which lets you plan out which tiles for soldiers to conquer them automatically. Also recruiting soldiers, hiring managers, and exploring territories no longer resets anything.",
		},
	},
	
	buyables: {
		rows: 1,
		cols: 2,
		11: {
			title: () => "Update the queue",
			display: () => "Queue strategy:<br/> " + ["Least difficulty", "Most encounter chance", "Least diff. × (chance+1) score", "Least diff. × chance score", "Least diff. / (chance+1) score"][player.world && player.world.strategy ? player.world.strategy : 0],
			cost: () => new Decimal(0),
			unl() { return player[this.layer].unl },
			canAfford() { return true },
			buy() {
				updateQueue()
			},
			style() {
				return {
					"height": "80px"
				}
			}
		},
		12: {
			title: () => "Change strategy",
			display: () => "You can get more strategies by geting more honor.",
			cost: () => new Decimal(0),
			unl() { return player[this.layer].unl },
			canAfford() { return true },
			buy() {
				player.world.strategy = player.world.strategy ? (player.world.strategy + 1) % Math.min(Math.floor(new Decimal(player.t.elo).toNumber() / 1000) + 1, 5) : 1
			},
			style() {
				return {
					"height": "80px"
				}
			}
		}
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
		
		if (!player.world.conquering && player.world.queue && player.world.queue.length > 0) {
			initConquering(player.world.queue[0][0], player.world.queue[0][1]), 100
			player.world.queue.shift()
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
				["display-text", function () { return "您拥有 " + formatWhole(player.t.lands) + " 已征服的土地，因此领土的需求变为除以 " + format(tmp.layerEffs.t.territoryRed) + " ，士兵的需求变为除以 " + format(tmp.layerEffs.t.soldierRed) + "。" }], 
				["display-text", function () { return "您目前的荣誉值为 " + formatWhole(player.t.elo) + "。" }], 
				["blank", "0px"], "map-box", ["blank", "0px"],
				["info-box", [
					["display-text", function () { return "Selected Tile: " + mapFocusDesc + "<br/><p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>"}],
					["display-text", function () { 
						let entCha = mapFocusDesc === "Unselected" ? 0 : getMapEncounterChance(mapFocusX, mapFocusY)
					return (
						mapFocusDesc === "Unselected" ? "<h5>Click on a tile on the map to view its details.<br/><br/>Drag the tiles to move the map around.</h5>" :
						isConquered(mapFocusX, mapFocusY) ? "<h5>This land has already been conquered.<br/><br/>You can not reconquer the land that you already conquered, duh!</h5>" : 
						"<h5>难度：" + format(getMapDifficulty(mapFocusX, mapFocusY)) + " -> 最佳征服时间：" + formatTime(Decimal.div(getMapDifficulty(mapFocusX, mapFocusY), soldierStats.spd)) + "<br/>遭遇概率：" + (entCha.eq(0) ? "不存在" : "约" + (entCha.lt(1) ? "每 " + formatTime(Decimal.div(1, entCha)) + " 一次" : "每秒 " + format(entCha, 3) + " 次")) + (isConquerable(mapFocusX, mapFocusY) ? (player.world.conquering && player.world.conquerX == mapFocusX && player.world.conquerY == mapFocusY ? "<br/>You are conquering this tile. Click it again to abort conquering." : "<br/>Click on the tile again to initialize conquering on that tile.") : "<br/>This tile is too far for you to initialize conquering.")
					) + "<p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }]
					], {"width": "480px"}
				], 
				["row", [
					["info-box", [
						["display-text", function () { return "Your Soldiers<h5 style='font-size:6px'><br/>" }],
						["mini-bar", function () { return format(Decimal.div(player.world.health, soldierStats.mhp)) }, {"background-color": "#300"}],
						["display-text", function () { return "<h5>生命值：" + formatWhole(player.world.health) + " / " + formatWhole(soldierStats.mhp) + "</h5>" }],
						["display-text", function () { return "<h5>伤害：" + formatWhole(Decimal.div(player.world.health, soldierStats.mhp).mul(soldierStats.atk)) + " / " + formatWhole(soldierStats.atk) + "</h5>" }],
						["display-text", function () { return "<h5>荣誉值：" + format(player.t.elo) + "</h5>" }],
						], {"width": "228px"}
					], 
					["info-box", [
						["display-text", function () { return (player.world.encounter ? player.world.encounter.name : "No Encounters") + "<h5 style='font-size:6px'><br/>" + "<p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
						["mini-bar", function () { return format(player.world.encounter ? Decimal.div(player.world.encounter.health, player.world.encounter.maxhealth) : 0) + (player.time * 10 % 1 ? "0" : "") }, {"background-color": "#300"}],
						["display-text", function () { return "<h5>生命值：" + (player.world.encounter ? formatWhole(player.world.encounter.health) + " / " + formatWhole(player.world.encounter.maxhealth) : "----- / -----") + "</h5>" + "<p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
						["display-text", function () { return "<h5>伤害：" + (player.world.encounter ? formatWhole(Decimal.div(player.world.encounter.health, player.world.encounter.maxhealth).mul(player.world.encounter.power)) + " / " + formatWhole(player.world.encounter.power) : "----- / -----") + "</h5>" + "<p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
						["display-text", function () { return "<h5>荣誉值：" + (player.world.encounter ? format(player.world.encounter.elo) : "-----") + "</h5>" + "<p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
						], {"width": "228px"}
					], 
				]],
				["info-box", [
					["display-text", function () { return (
						player.world.conquering ? "Conquering " + player.world.conquerTarget + "..." : "Soldiers are Idling."
						) + "<p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>"
					}],
					["display-text", function () { return (
						player.world.conquering ? "<h5>进度：" + formatWhole(player.world.conquerProgress) + " / " + formatWhole(player.world.conquerGoal) + "<br/>" + (player.world.encounter ? "Conquering is paused because soldiers are battling the encounters." : "预计完成时间：" + formatTime(new Decimal(player.world.conquerGoal).sub(player.world.conquerProgress).div(Decimal.div(player.world.health, soldierStats.mhp).mul(soldierStats.spd))) + "</h5>") : "<h5>Please select a land to be conquered.<br/></h5>"
						) + "<p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>"
					}],
					], {"width": "480px"}
				], 
				["bar", function () { return format(player.world.conquering ? Decimal.div(player.world.conquerProgress, player.world.conquerGoal) : 0) }, {"background-color": "#333"}],
				["blank", "5px"],
			]},
            queue: { title: () => "The Queue", unl: () => hasMilestone("t", 6), content: [
				["blank", "5px"],
				["display-text", function () { return "您的队列长度为 " + formatWhole(player.world.queue ? player.world.queue.length : 0) + " / " + formatWhole(tmp.layerEffs.t.queueLength) + "。" }],
				["display-text", function () { return "You can increase the maximum queue length by getting more territories or military bases." }],
				["blank", "5px"],
				["buyable", 11], ["buyable", 12],
			]},
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
				function () { return "您最高拥有 " + format(player.t.best, 0) + " " + " 领土。" }],
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
	resource: "士兵",
	row: 4,

	baseResource: "金币",
	baseAmount() { return player.c.points },
	branches: [["w", 1], ["c", 2]],

	requires: () => new Decimal("e800").div(tmp.layerEffs ? tmp.layerEffs.t.soldierRed : 1),

	type: "static",
	base: "1e30",
	exponent: 0.9,
	canBuyMax: () => true,
	resetsNothing: () => hasMilestone("t", 6),
	
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
				return "基础属性：" + format(data.effect) + "<br/>" + 
				"花费：" + format(data.cost) + " 金币<br/>" + 
				"增加士兵的攻击伤害。"
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
				return "基础属性：" + format(data.effect) + "<br/>" + 
				"花费：" + format(data.cost) + " 金币<br/>" + 
				"增加士兵的最大生命值。"
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
				return "基础属性：" + format(data.effect) + "<br/>" + 
				"花费：" + format(data.cost) + " 金币<br/>" + 
				"增加士兵的速度。" + (data.effect.gte(6) ? "" : "将此项提升到6以后可以解锁领土层级下的一个新选项卡。")
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
				function () { return "您最高拥有 " + format(player.so.best, 0) + " 士兵。" }],
			["display-text",
				function () { return "您当前的军队评分为 " + format(player.so.rating) + " ，因此点数产量变为了 " + format(tmp.layerEffs.so) + " 倍。" }],
			["blank", "5px"],
			["display-text",
				function () { return player.so.unl ? "<h3>Soldier Statistics</h3><br/><h5>Accounts for all soldiers</h5>" : "" }],
			["blank", "5px"],
			["row", [
				["display-text",
					function () { return (player.so.unl ? "<h5/>" + 
						"基础伤害：" + formatWhole(soldierStats.atk).padEnd(15, '\u00A0') + "<br/>" +
						"生命值恢复速度：" + (format(soldierStats.gen) + "/秒").padEnd(15, '\u00A0') 
						: "") + "<br/><p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
				["display-text",
					function () { return (player.so.unl ? "<h5/>" + 
						"最大生命值：" + formatWhole(soldierStats.mhp).padEnd(15, '\u00A0')
						: "") + "<br/><p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
				["display-text",
					function () { return (player.so.unl ? "<h5/>" + 
						"移动速度：" + formatWhole(soldierStats.spd).padEnd(15, '\u00A0')
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
	name: "智慧",
	resource: "智慧",
	row: 4,

	baseResource: "魂灵能量",
	baseAmount() { return player.sp.points },
	branches: [["w", 3], ["sp", 3]],

	requires: () => {
		let req = new Decimal("e18")
		if (hasUpg("wi", 85)) req = new Decimal("e50")
		if (hasUpg("wi", 35)) req = req.div(tmp.upgrades.wi[35].effect)
		if (hasUpg("wi", 43)) req = req.div(tmp.upgrades.wi[43].effect)
		if (hasUpg("wi", 75)) req = req.div(tmp.upgrades.wi[75].effect)
		req = req.div(tmp.buyables.wi[13].effect.add ? tmp.buyables.wi[13].effect.pow(tmp.buyables.wi[13].effect.add(1).log(1e10).add(1).add(player.wi.points.add(1).pow(0.5).sub(1))).pow(tmp.buyables.wi[13].effect.add(1).log(1e20).add(1)) : 1)
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
		return "每秒产生 " + format(tmp.layerEffs.wi) + " 知识"
	},
	
	
	upgrades: {
		rows: 8,
		cols: 5,
		11: {
			desc: () => "Knowledge boosts your first row of coin boost upgrades.",
			cost: () => new Decimal(1),
			currencyLayer: "wi",
			currencyInternalName: "knowledge",
			currencyDisplayName: "知识",
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
			currencyDisplayName: "知识",
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
			currencyDisplayName: "知识",
			unl() { return player[this.layer].unl },
			extraReq() { return hasUpg("wi", 24) && player.wi.points.gt(player.wi.bought) },
			onPurchase() { player.wi.spent = Decimal.add(player.wi.spent, tmp.upgrades.wi[14].cost); player.wi.bought = Decimal.add(player.wi.bought, 1) }
		},
		15: {
			desc: () => "Raise the “Use spiritual power to power magic in advanced spells” upgrade based on schools.",
			cost: () => new Decimal(50000),
			currencyLayer: "wi",
			currencyInternalName: "knowledge",
			currencyDisplayName: "知识",
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
			currencyDisplayName: "知识",
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
			currencyDisplayName: "知识",
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
			currencyDisplayName: "知识",
			unl() { return player[this.layer].unl },
			extraReq() { return hasUpg("wi", 22) && player.wi.points.gt(player.wi.bought) },
			onPurchase() { player.wi.spent = Decimal.add(player.wi.spent, tmp.upgrades.wi[23].cost); player.wi.bought = Decimal.add(player.wi.bought, 1) }
		},
		24: {
			desc: () => "You gain 100% of your spiritual power gain on reset every second (only when you unlocked the layer).",
			cost: () => new Decimal(25000),
			currencyLayer: "wi",
			currencyInternalName: "knowledge",
			currencyDisplayName: "知识",
			unl() { return player[this.layer].unl },
			extraReq() { return hasUpg("wi", 23) && player.wi.points.gt(player.wi.bought) },
			onPurchase() { player.wi.spent = Decimal.add(player.wi.spent, tmp.upgrades.wi[24].cost); player.wi.bought = Decimal.add(player.wi.bought, 1) }
		},
		25: {
			desc: () => "Reduces the “Extend the fabric of time using spiritual power” cost scaling.",
			cost: () => new Decimal(25000),
			currencyLayer: "wi",
			currencyInternalName: "knowledge",
			currencyDisplayName: "知识",
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
			currencyDisplayName: "知识",
			unl() { return player[this.layer].unl },
			extraReq() { return hasUpg("wi", 25) && player.wi.points.gt(player.wi.bought) },
			effect() {
				let ret = Decimal.sub(player.t.elo, 1000).pow(Decimal.log10(player.t.elo).pow(1.8)).pow(Decimal.log(player.t.elo, 1e10).add(1))
				if (hasUpg("wi", 85)) ret = ret.tetrate(1.001).pow(12)
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
			currencyDisplayName: "知识",
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
			currencyDisplayName: "知识",
			unl() { return player[this.layer].unl },
			extraReq() { return hasUpg("wi", 43) && player.wi.points.gt(player.wi.bought) },
			onPurchase() { player.wi.spent = Decimal.add(player.wi.spent, tmp.upgrades.wi[42].cost); player.wi.bought = Decimal.add(player.wi.bought, 1) }
		},
		43: {
			desc: () => "Knowledge " + (hasUpg("wi", 85) ? "and wisdom " : "") + "reduces the requirement of wisdom.",
			cost: () => new Decimal(1e10),
			currencyLayer: "wi",
			currencyInternalName: "knowledge",
			currencyDisplayName: "知识",
			unl() { return player[this.layer].unl },
			extraReq() { return hasUpg("wi", 44) && player.wi.points.gt(player.wi.bought) },
			effect() {
				let ret = Decimal.pow(player.wi.knowledge, 0.01).pow(Decimal.log(player.wi.knowledge, 2)).pow(Decimal.log(player.wi.knowledge, 10)).pow(Decimal.log(player.wi.knowledge, 1e10))
				if (hasUpg("wi", 85)) ret = ret.pow(player.wi.points.pow(player.wi.points.div(10).min(1.2).add(1)).add(1))
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
			currencyDisplayName: "知识",
			unl() { return player[this.layer].unl },
			extraReq() { return hasUpg("wi", 45) && player.wi.points.gt(player.wi.bought) },
			onPurchase() { player.wi.spent = Decimal.add(player.wi.spent, tmp.upgrades.wi[44].cost); player.wi.bought = Decimal.add(player.wi.bought, 1) }
		},
		45: {
			desc: () => "Knowledge boosts spiritual power gain.",
			cost: () => new Decimal(100000),
			currencyLayer: "wi",
			currencyInternalName: "knowledge",
			currencyDisplayName: "知识",
			unl() { return player[this.layer].unl },
			extraReq() { return hasUpg("wi", 35) && player.wi.points.gt(player.wi.bought) },
			effect() {
				let ret = Decimal.pow(player.wi.knowledge, 0.25).pow(Decimal.add(player.wi.knowledge, 1).log(100)).add(1)
				if (hasUpg("wi", 85)) ret = ret.pow(0.35)
				return ret;
			},
			effectDisplay(fx) { return "×" + format(fx) },
			onPurchase() { player.wi.spent = Decimal.add(player.wi.spent, tmp.upgrades.wi[45].cost); player.wi.bought = Decimal.add(player.wi.bought, 1) }
		},
		51: {
			desc: () => "Unlocks a second exotic spell.",
			cost: () => new Decimal(1e80),
			currencyLayer: "wi",
			currencyInternalName: "knowledge",
			currencyDisplayName: "知识",
			unl() { return player[this.layer].unl },
			extraReq() { return hasUpg("wi", 41) && player.wi.points.gt(player.wi.bought) },
			onPurchase() { player.wi.spent = Decimal.add(player.wi.spent, tmp.upgrades.wi[51].cost); player.wi.bought = Decimal.add(player.wi.bought, 1) }
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
			currencyDisplayName: "知识",
			unl() { return player[this.layer].unl },
			extraReq() { return hasUpg("wi", 44) && player.wi.points.gt(player.wi.bought) },
			effect() {
				let ret = Decimal.pow(player.wi.knowledge, 0.4).pow(Decimal.add(player.wi.knowledge, 1).log(1e100).add(1))
				if (hasUpg("wi", 64)) ret = ret.mul(tmp.upgrades.wi[64].effect)
				if (hasUpg("wi", 85)) ret = ret.pow(0.2)
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
			desc: () => "Unlocks a third exotic spell.",
			cost: () => new Decimal(1e116),
			currencyLayer: "wi",
			currencyInternalName: "knowledge",
			currencyDisplayName: "知识",
			unl() { return player[this.layer].unl },
			extraReq() { return hasUpg("wi", 51) && player.wi.points.gt(player.wi.bought) },
			onPurchase() { player.wi.spent = Decimal.add(player.wi.spent, tmp.upgrades.wi[61].cost); player.wi.bought = Decimal.add(player.wi.bought, 1) }
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
			currencyDisplayName: "知识",
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
			currencyDisplayName: "知识",
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
			currencyDisplayName: "知识",
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
			currencyDisplayName: "知识",
			unl() { return player[this.layer].unl },
			extraReq() { return (hasUpg("wi", 74) || hasUpg("wi", 65)) && player.wi.points.gt(player.wi.bought) },
			effect() {
				let ret = Decimal.add(player.sp.points, 1)
				for (var a = 1; a <= 30; a++) {
					if (ret.gte("1e" + a + "00")) ret = ret.mul("1e" + a + "00").sqrt()
				}
				if (hasUpg("wi", 85)) ret = ret.pow(10)
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
		cols: 8,
		11: {
			title: () => "Philosophy",
			cost(x) {
				if (x.gte(25)) x = x.pow(2).div(25)
				let cost = Decimal.pow(100, Decimal.pow(1.2, x))
				return cost.floor()
			},
			effect(x) { 
				x = x.add(player[this.layer].buyables[12])
				x = x.add(player[this.layer].buyables[13])
				x = x.add(player[this.layer].buyables[14])
				x = x.add(tmp.buyables.wi[16].effect)
				x = x.add(tmp.buyables.wi[18].effect)
				return x.pow(Decimal.add(2, player.wi.buyables[13].div(5)).add(tmp.buyables.wi[15].effect).add(tmp.buyables.wi[17].effect).add(tmp.buyables.wi[18].effect))
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "等级 " + player[this.layer].buyables[this.id] + "<br/>" + 
				"花费：" + formatWhole(data.cost) + " 知识<br/>" + 
				"使基础的知识获取量增加 " + format(data.effect.add(1)) + " 并使知识获取量变为 " + format(data.effect.add(1)) + " 倍。"
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
				if (x.gte(15)) x = x.pow(2).div(15)
				x = x.add(tmp.buyables.wi[18].effect)
				let cost = Decimal.pow(100, Decimal.pow(1.225, x)).mul(1000)
				return cost.floor()
			},
			effect(x) { 
				x = x.add(tmp.buyables.wi[16].effect)
				return Decimal.pow(1e8, x.mul(tmp.buyables.wi[11].effect.add(1).log(10).add(1).log(10).add(1)).pow(0.75).mul(Math.E).mul(Math.PI))
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "等级 " + player[this.layer].buyables[this.id] + "<br/>" + 
				"花费：" + formatWhole(data.cost) + " 知识<br/>" + 
				"使银行业务产量倍率变为 " + formatWhole(data.effect) + " 倍(基于哲学等级)。此倍率等于“点数业务”的产量倍率，且分别乘以后面每个银行业务倍率的一定数值次方，该数值初始为0.7，且每再往后一个银行业务，就使此数值再乘以0.7。另外还使“哲学”的基础等级增加 " + formatWhole(player[this.layer].buyables[this.id]) + " 。"
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
				x = x.add(tmp.buyables.wi[17].effect)
				x = x.add(tmp.buyables.wi[18].effect)
				if (x.gte(15)) x = x.pow(2).div(15)
				let cost = Decimal.pow(100, Decimal.pow(1.225, x)).mul(150000)
				return cost.floor()
			},
			effect(x) { 
				x = x.add(tmp.buyables.wi[15].effect)
				var eff = Decimal.pow(1e3, x.mul(Decimal.add(player.wi.knowledge, 1).log(10).add(1)).pow(0.35).mul(Math.E)).pow(player.wi.points.add(1).pow(0.02))
				if (eff.gte(1e200)) eff = eff.mul(1e120).sqrt()
				return eff
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "等级 " + player[this.layer].buyables[this.id] + "<br/>" + 
				"花费：" + formatWhole(data.cost) + " 知识<br/>" + 
				"使魂灵能量获取量变为 " + format(data.effect) + " 倍，并将智慧获取所需的魂灵能量数值除以 " + format(data.effect.pow(data.effect.add(1).log(1e10).add(1).add(player.wi.points.add(1).pow(0.5).sub(1))).pow(data.effect.add(1).log(1e20).add(1))) + " (基于知识和智慧)。另外使“哲学”的基础等级增加 " + formatWhole(player[this.layer].buyables[this.id]) + " ，并使“哲学”效果的指数增加 " + format(player[this.layer].buyables[this.id].div(5)) + " 。"
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
				if (x.gte(6)) x = x.pow(2).div(6)
				let cost = Decimal.pow(10000, Decimal.pow(1.225, x)).mul(2e7)
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
				return "等级 " + player[this.layer].buyables[this.id] + "<br/>" + 
				"花费：" + formatWhole(data.cost) + " 知识<br/>" + 
				"使已完成的工作效果和建造速度变为 " + format(data.effect.first) + " 倍，并使工人和经理的效果变为原来的 ^" + format(data.effect.second) + " (基于智慧)。另外使“哲学”的基础等级增加 " + formatWhole(player[this.layer].buyables[this.id]) + " 。"
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
		15: {
			title: () => "Structural Engineering",
			cost(x) {
				if (x.gte(6)) x = x.pow(2).div(6)
				let cost = Decimal.pow(1000000, Decimal.pow(x.mul(0.05).add(1.25), x)).mul(5e10)
				return cost.floor()
			},
			effect(x) { 
				x = x.add(tmp.buyables.wi[16].effect)
				x = x.add(tmp.buyables.wi[17].effect)
				x = x.add(tmp.buyables.wi[18].effect)
				if (x.gte(10)) x = x.mul(10).sqrt()
				return x
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "等级 " + player[this.layer].buyables[this.id] + "<br/>" + 
				"花费：" + formatWhole(data.cost) + " 知识<br/>" + 
				"使“哲学”效果的指数和基础等级增加 " + format(data.effect) + " 。"
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
		16: {
			title: () => "Calculus",
			cost(x) {
				x = x.add(tmp.buyables.wi[18].effect)
				if (x.gte(6)) x = x.pow(2).div(6)
				let cost = Decimal.pow(1e11, Decimal.pow(x.mul(0.1).add(1.3), x)).mul(1e21)
				return cost.floor()
			},
			effect(x) { 
				return x.pow(0.9)
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "等级 " + player[this.layer].buyables[this.id] + "<br/>" + 
				"花费：" + formatWhole(data.cost) + " 知识<br/>" + 
				"使“哲学”，“数学”和“结构工程学”的基础等级增加 " + format(data.effect) + " 。"
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
		17: {
			title: () => "Literature",
			cost(x) {
				if (x.gte(4)) x = x.pow(2).div(4)
				let cost = Decimal.pow(1e20, Decimal.pow(x.mul(0.1).add(1.3), x).add(x.div(3))).mul(1e40)
				return cost.floor()
			},
			effect(x) { 
				return x.mul(2.5).pow(0.9)
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "等级 " + player[this.layer].buyables[this.id] + "<br/>" + 
				"花费：" + formatWhole(data.cost) + " 知识<br/>" + 
				"使“哲学”效果的指数、基础等级，“结构工程学”的基础等级增加 " + format(data.effect) + " 。"
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
		18: {
			title: () => "Algebra",
			cost(x) {
				if (x.gte(4)) x = x.pow(2).div(4)
				let cost = Decimal.pow(1e50, Decimal.pow(x.mul(0.1).add(1.5), x).add(x.div(3))).mul(1e66)
				return cost.floor()
			},
			effect(x) { 
				return x.mul(2).pow(0.9)
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "等级 " + player[this.layer].buyables[this.id] + "<br/>" + 
				"花费：" + formatWhole(data.cost) + " 知识<br/>" + 
				"使“哲学”效果的指数，“哲学”、“心理学”、“数学”、“结构工程学”和“微积分”的基础等级增加 " + format(data.effect) + " 。"
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
				function () { return "您最高拥有 " + format(player.wi.best, 0) + " 智慧。" }],
			["blank", "5px"],
			["display-text",
				function () { return "您拥有 " + format(player.wi.knowledge, 0) + " 知识。" }],
			["blank", "5px"],
			["display-text",
				function () { return "您拥有 " + format(player.wi.points.sub(player.wi.bought), 0) + " 未发现的智慧。<h5>您拥有 " + formatWhole(player.wi.spent) + " 已花费的知识。</h5>" }],
			["microtabs", "stuff"]
		],

	hotkeys: [
		{ key: "i", desc: "I: Gain wisdom", onPress() { doReset(this.layer) } },
	],

})
