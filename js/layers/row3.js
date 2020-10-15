
// ----- Third row -----
addLayer("w", {
	startData() {
		return {
			unl: false,
			points: new Decimal(0),
			best: new Decimal(0),
			total: new Decimal(0),
			autoCoinUpgrade: false,
			autoFinderUpgrade: false,
		}
	},

	layerShown() { return (hasUpg("c", 21) || player[this.layer].unl || player.m.unl) && !inChallenge("t", 21) },

	color: () => "#FFFFFF",
	resource: "workers",
	row: 2,

	baseResource: "coins",
	baseAmount() { return player["c"].points },
	branches: [["c", 1], ["b", 1], ["wf", 1]],

	requires: () => new Decimal(15000),

	type: "static",
	base: 15000,
	exponent: 1.35,
	canBuyMax: () => hasMilestone("w", 8) || hasMilestone("m", 0),
	resetsNothing: () => (player.m.best.gte(3)),

	effect() {
		var eff = Decimal.pow(player.w.points.add(1), 2)
		if (hasMilestone("m", 0) && hasUpg("w", 21)) eff = Decimal.pow(player.w.points.add(2), 3)
		if (hasMilestone("w", 10)) eff = eff.pow(3)
		if (hasMilestone("w", 11)) eff = eff.pow(3)
		if (player.b.banking & 1) eff = eff.pow(0.5)
		return eff
	},
	effectDescription() {
		eff = tmp.layerEffs.w;
		return "which are boosting your point gains by ×" + format(eff)
	},

	gainMult() {
		return new Decimal(1)
	},
	gainExp() {
		return new Decimal(1)
	},

	milestones: {
		0: {
			requirementDesc: () => "1 Worker",
			done() { return player[this.layer].best.gte(1) },
			effectDesc: () => "Unlocks a new row of coin upgrades. Also you kickstart your worker resets and below (not coins) with " + format(80) + " coins."
		},
		1: {
			requirementDesc: () => "2 Workers",
			done() { return player[this.layer].best.gte(2) },
			effectDesc: () => "Unlocks an another new row of coin upgrades. Also you kickstart with " + format(250) + " coins."
		},
		2: {
			requirementDesc: () => "3 Workers",
			done() { return player[this.layer].best.gte(3) },
			effectDesc: () => "Unlocks worker upgrades. They're on an another tab! Also you kickstart with " + format(10000) + " coins.",
		},
		3: {
			requirementDesc: () => "4 Workers",
			done() { return player[this.layer].best.gte(4) },
			// TODO: Implement
			effectDesc: () => hasMilestone("m", 0) ? "The “Promote workfinders to part-time workers” rebuyable upgrade is 5× stronger." : "Unlocks workfinders and working, where workers can do their work. They are reseted on worker reset.",
		},
		4: {
			requirementDesc: () => "5 Workers",
			done() { return player[this.layer].best.gte(5) },
			effectDesc: () => "Automates buying coin upgrades, but each upgrade bought by the autobuyer will give you " + format(5 * player[this.layer].points.add(1).pow(1.05)) + " unfinished work (based on current worker count).",
			toggles: [["w", "autoCoinUpgrade"]]
		},
		5: {
			requirementDesc: () => "6 Workers",
			done() { return player[this.layer].best.gte(6) },
			effectDesc: () => "Unlocks more worker upgrades, may or may not related to the workfinder layer.",
		},
		6: {
			requirementDesc: () => "7 Workers",
			done() { return player[this.layer].best.gte(7) },
			effectDesc: () => hasMilestone("m", 0) ? "Hiring workfinders no longer resets anything." : "Unlocks banks, which you can manage bankings. They are reseted on worker reset too.",
		},
		7: {
			requirementDesc: () => "8 Workers",
			done() { return player[this.layer].best.gte(8) },
			effectDesc: () => "Automates buying workfinder rebuyable upgrades, but each rebuyable upgrade bought by the autobuyer will give you " + format(player[this.layer].points.add(1).mul(600).pow(1.25)) + " unfinished work (based on current worker count).",
			toggles: [["w", "autoFinderUpgrade"]]
		},
		8: {
			requirementDesc: () => "9 Workers",
			done() { return player[this.layer].best.gte(9) },
			effectDesc: () => "Unlocks more worker upgrades. And you can bulk hire workers now. Why didn't I think of this earlier...",
		},
		9: {
			requirementDesc: () => "12 Workers",
			done() { return player[this.layer].best.gte(12) },
			effectDesc: () => hasMilestone("m", 0) ? "The first three banking buffs are 25× stronger." : "You can bulk build banks.",
		},
		10: {
			requirementDesc: () => "13 Workers",
			done() { return player[this.layer].best.gte(13) },
			effectDesc: () => "Unlocks new banking options. Also the workers' effect gets cubed.",
		},
		11: {
			requirementDesc: () => "16 Workers",
			done() { return player[this.layer].best.gte(16) },
			effectDesc: () => "The workers' effect gets cubed again. Yay!",
		},
	},

	upgrades: {
		rows: 2,
		cols: 5,
		11: {
			desc: () => "Raises all of the first three coin layer's “all previous boost upgrades” upgrades based on your best worker count.",
			cost: () => new Decimal(3),
			unl() { return hasMilestone("w", 2) },
			effect() {
				let ret = player[this.layer].best.div(20).add(1)
				if (hasUpg(this.layer, 14)) ret = ret.add(player[this.layer].points.div(30))
				return ret.sqrt();
			},
			effectDisplay(fx) { return "^" + format(fx) },
		},
		12: {
			desc: () => "The previous upgrade also affect the first coin layer's boost upgrade but with reduced effect.",
			cost: () => new Decimal(2),
			unl() { return hasUpg(this.layer, 11) },
			effect() {
				let ret = layers.w.upgrades[11].effect().cbrt()
				return ret;
			},
			effectDisplay(fx) { return "^" + format(fx) },
		},
		13: {
			desc: () => "Remember that upgrade that applies something again to the point prodution? Why not keep doing that again, shall we?",
			cost: () => new Decimal(3),
			unl() { return hasUpg(this.layer, 12) },
		},
		14: {
			desc: () => "The current worker count also contibutes to the first upgrade's formula.",
			cost: () => new Decimal(3),
			unl() { return hasUpg(this.layer, 13) },
		},
		15: {
			desc: () => "Unlock more coin upgrades. Yay.",
			cost: () => new Decimal(9),
			unl() { return player["w"].best.gte(9) },
		},
		21: {
			desc: () => hasMilestone("m", 0) ? "Worker's effect is scaled better. ((x+1)^2 => (x+2)^3)" : "You gain 10% of your current coins gain on coin reset per second.",
			cost: () => new Decimal(6),
			unl() { return hasUpg(this.layer, 14) && hasMilestone("w", 5) },
		},
		22: {
			desc: () => "Boosts finished work and unfinished work gain based on current coin count.",
			cost: () => new Decimal(5),
			unl() { return hasUpg(this.layer, 21) },
			effect() {
				let ret = player.c.points.add(1).log10().add(1).sqrt()
				return ret;
			},
			effectDisplay(fx) { return "×" + format(fx) },
		},
		23: {
			desc: () => hasMilestone("m", 0) ? "Find and finish work 2× faster." : "Unlocks the ability to bulk hire workfinders.",
			cost: () => new Decimal(6),
			unl() { return hasUpg(this.layer, 22) },
		},
		24: {
			desc: () => "Boosts finished work and unfinished work gain based on current point count.",
			cost: () => new Decimal(6),
			unl() { return hasUpg(this.layer, 23) },
			effect() {
				let ret = player.points.add(1).log10().add(1).cbrt()
				return ret;
			},
			effectDisplay(fx) { return "×" + format(fx) },
		},
		25: {
			desc: () => "The first three banking buffs are stronger based on workers.",
			cost: () => new Decimal(10),
			unl() { return player["w"].best.gte(9) },
			effect() {
				let ret = player.w.points.div(500).add(1).max(1).sqrt()
				return ret;
			},
			effectDisplay(fx) { return "^" + format(fx, 3) },
		},
	},
	
	automate() {
		if (player.m.autoWorkerReset && !inChallenge("t", 21)) doReset("w")
			
		if (player["t"].autoWorkerUpgrade) {
			for (let x = 10; x <= 20; x += 10) for (let y = 1; y <= 5; y++) {
				var z = x + y
				if (!hasUpg("w", z) && canAffordUpg("w", z) && tmp.upgrades.w[z].unl) {
					buyUpg("w", z)
				}
			}
		}
	},

	microtabs: {
        stuff: {
            milestones: { title: () => "Milestones", content: ["milestones"] },
			upgrades: { title: () => "Upgrades", content: ["upgrades"] },
        },
	},
	
	tabFormat:
		["main-display",
			["prestige-button", function () { return "Hire " }],
			["blank", "5px"],
			["display-text",
				function () { return "You have at best " + format(player.w.best, 0) + " " + " workers." }],
			["blank", "5px"],
			["microtabs", "stuff"]],

	hotkeys: [
		{ key: "w", desc: "W: Hire workers", onPress() { doReset(this.layer) } },
	],

})
