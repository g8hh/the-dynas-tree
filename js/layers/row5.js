
// ----- Fifth row -----
addLayer("s", {
	startData() {
		return {
			unl: true,
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

	layerShown() { return hasMilestone("t", 6) },

	name: "singularity",
	color: () => "#000000",
	resource: "singularity points",
	row: 4,

	baseResource: "points",
	baseAmount() { return player.points },
	branches: [["m", 1]],

	requires: () => Decimal.dInf,

	type: "static",
	base: 1.22727,
	exponent: 1.01,
	canBuyMax: () => false,
	
	gainMult() {
		return new Decimal(1)
	},
	gainExp() {
		return new Decimal(1)
	},
	
	tabFormat:
		[
			["display-text",
				function () { return player.points.lt(ENDGAME) ? "WARNING: You're approaching the point of singularity. Once you go past this, the game will end." : "You have <h2 style='color: black; text-shadow: white 0px 0px 10px'>" + formatWhole(player.s.points) + "</h2> singularity points." }],
			["blank", "5px"],
			["display-text",
				function () { return "Capacity: <h2 style='color: black; text-shadow: white 0px 0px 10px'>" + format(player.points) + " / " + format(Decimal.pow(2, 262144)) + "</h2> points" }],
			["blank"],
			["bar", function () { return format(player.points ? player.points.add(1).log(Decimal.pow(2, 262144)) : 0) }, {"background-color": "#000"}],
			["blank", "5px"],
			["display-text",
				function () { return player.points.gte(ENDGAME) ? "This is pretty much the end game for now. Content coming soon, I guess?" : "" }],
		],

})