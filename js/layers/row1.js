addLayer("c", {
	startData() {
		return {
			unl: true,
			points: new Decimal(2),
			best: new Decimal(0),
			total: new Decimal(0),
		}
	},

	layerShown() { return true },

	name: "coins",
	color: () => "#FFFF00",
	resource: "coins",
	row: 0,

	baseResource: "points",
	baseAmount() { return player.points },

	requires: () => new Decimal(2.5),

	resetsNothing: () => hasMilestone("m", 0),


	type: "normal",
	exponent: 0.5,

	gainMult() {
		let mul = new Decimal(1)
		if (hasUpg(this.layer, 24)) mul = mul.mul(1.25);
		if (hasUpg(this.layer, 32)) mul = mul.mul(layers.c.upgrades[32].effect())
		mul = mul.mul(tmp.layerEffs.b)
		mul = mul.mul(tmp.layerEffs.m)
		if (player.sp.buyables[22].gt(0)) mul = mul.mul(tmp.buyables.sp[22].effect)
		if (player.b.banking & 1) mul = mul.pow(0.5)
		if (inChallenge("t", 11)) mul = mul.pow(0.5)
		return mul
	},
	gainExp() {
		let mul = new Decimal(1)
		if (player.b.banking & 4) mul = mul.mul(0.1)
		if (player.bd.building != 0) mul = mul.mul(tmp.layerEffs.bd.penalty)
		return mul
	},

	upgrades: {
		rows: 6,
		cols: 4,
		11: {
			desc: () => "Generates " + format(tmp.pointGen) + " points every second.",
			cost: () => new Decimal(2),
			unl() { return player[this.layer].unl },
		},
		12: {
			desc: () => "Boosts points generation based on your total coin count.",
			cost: () => new Decimal(5),
			unl() { return hasUpg(this.layer, 11) },
			effect() {
				let ret = player[this.layer].total.div(5).add(1).max(1).log10().add(1)
				ret = ret.times(player.wf.workDoneEffect)
				if (hasUpg(this.layer, 13)) ret = ret.times(layers.c.upgrades[13].effect())
				if (hasUpg(this.layer, 21)) ret = ret.times(layers.c.upgrades[21].effect())
				if (hasUpg(this.layer, 31)) ret = ret.times(layers.c.upgrades[31].effect())
				if (hasUpg(this.layer, 41)) ret = ret.times(layers.c.upgrades[41].effect())
				if (hasUpg(this.layer, 51)) ret = ret.mul(layers.c.upgrades[51].effect())
				if (tmp.buyables.bd[12].effect) ret = ret.mul(tmp.buyables.bd[12].effect)
				if (hasUpg("wi", 11)) ret = ret.mul(layers.wi.upgrades[11].effect())
				if (hasUpg("w", 12)) ret = ret.pow(layers.w.upgrades[12].effect())
				return ret;
			},
			effectDisplay(fx) { return "×" + format(fx) }, // Add formatting to the effect
		},
		13: {
			desc: () => "Boosts the previous upgrade based on your best coin count.",
			cost: () => new Decimal(10),
			unl() { return hasUpg(this.layer, 12) && !(player.b.banking & 2) },
			effect() {
				let ret = player[this.layer].best.div(2).add(1).max(1).log10().add(1)
				ret = ret.times(player.wf.workDoneEffect)
				if (hasUpg(this.layer, 14)) ret = ret.times(layers.c.upgrades[14].effect())
				if (hasUpg(this.layer, 21)) ret = ret.times(layers.c.upgrades[21].effect())
				if (hasUpg(this.layer, 31)) ret = ret.times(layers.c.upgrades[31].effect())
				if (hasUpg(this.layer, 41)) ret = ret.times(layers.c.upgrades[41].effect())
				if (hasUpg(this.layer, 51)) ret = ret.mul(layers.c.upgrades[51].effect())
				if (hasUpg("wi", 11)) ret = ret.mul(layers.wi.upgrades[11].effect())
				if (tmp.buyables.bd[12].effect) ret = ret.mul(tmp.buyables.bd[12].effect)
				return ret;
			},
			effectDisplay(fx) { return "×" + format(fx) }, // Add formatting to the effect
		},
		14: {
			desc: () => "Boosts the previous upgrade based on your current coin count.",
			cost: () => new Decimal(15),
			unl() { return hasUpg(this.layer, 13) },
			effect() {
				let ret = player[this.layer].points.add(1).max(1).log10().add(1)
				ret = ret.times(player.wf.workDoneEffect)
				if (hasUpg(this.layer, 21)) ret = ret.times(layers.c.upgrades[21].effect())
				if (hasUpg(this.layer, 31)) ret = ret.times(layers.c.upgrades[31].effect())
				if (hasUpg(this.layer, 41)) ret = ret.times(layers.c.upgrades[41].effect())
				if (hasUpg(this.layer, 51)) ret = ret.mul(layers.c.upgrades[51].effect())
				if (hasUpg("wi", 11)) ret = ret.mul(layers.wi.upgrades[11].effect())
				if (tmp.buyables.bd[12].effect) ret = ret.mul(tmp.buyables.bd[12].effect)
				return ret;
			},
			effectDisplay(fx) { return "×" + format(fx) }, // Add formatting to the effect
		},
		21: {
			desc: () => "Boosts all boost upgrades above based on your current point count.",
			cost: () => new Decimal(30),
			unl() { return hasUpg(this.layer, 14) },
			effect() {
				let ret = player.points.div(10).add(1).sqrt().max(1).log10().add(1)
				ret = ret.times(player.wf.workDoneEffect)
				if (hasUpg(this.layer, 22)) ret = ret.times(layers.c.upgrades[22].effect())
				if (hasUpg(this.layer, 31)) ret = ret.times(layers.c.upgrades[31].effect())
				if (hasUpg(this.layer, 41)) ret = ret.times(layers.c.upgrades[41].effect())
				if (hasUpg(this.layer, 51)) ret = ret.mul(layers.c.upgrades[51].effect())
				if (tmp.buyables.bd[12].effect) ret = ret.mul(tmp.buyables.bd[12].effect)
				if (hasUpg("wi", 21)) ret = ret.mul(layers.wi.upgrades[21].effect())
				if (hasUpg("w", 11)) ret = ret.pow(layers.w.upgrades[11].effect())
				if (player.b.banking & 1) ret = ret.pow(0.5)
				return ret;
			},
			effectDisplay(fx) { return "×" + format(fx) }, // Add formatting to the effect
		},
		22: {
			desc: () => "Boosts the previous upgrade based on your coins gain on coin reset.",
			cost: () => new Decimal(100),
			unl() { return hasUpg(this.layer, 21) },
			effect() {
				let p = new Decimal(1)
				if (tmp.gainExp !== undefined) p = tmp.resetGain["c"];
				let ret = p.cbrt().add(1).log10().add(1)
				ret = ret.times(player.wf.workDoneEffect)
				if (hasUpg(this.layer, 31)) ret = ret.times(layers.c.upgrades[31].effect())
				if (hasUpg(this.layer, 41)) ret = ret.times(layers.c.upgrades[41].effect())
				if (hasUpg(this.layer, 51)) ret = ret.mul(layers.c.upgrades[51].effect())
				if (tmp.buyables.bd[12].effect) ret = ret.mul(tmp.buyables.bd[12].effect)
				if (hasUpg("wi", 21)) ret = ret.mul(layers.wi.upgrades[21].effect())
				return ret;
			},
			effectDisplay(fx) { return "×" + format(fx) },
		},
		23: {
			desc: () => "The point generation upgrade also gets boosted by the “all previous boost upgrades” upgrade.",
			cost: () => new Decimal(300),
			unl() { return hasUpg(this.layer, 22) },
		},
		24: {
			desc: () => "Boosts coins gain on coin reset (unaffected by the “all previous boost upgrades” upgrades).",
			cost: () => new Decimal(1500),
			unl() { return hasUpg(this.layer, 23) },
			effect() {
				let ret = new Decimal(8);
				ret = ret.times(player.wf.workDoneEffect)
				if (hasUpg(this.layer, 34)) ret = ret.times(layers.c.upgrades[34].effect())
				if (tmp.buyables.bd[12].effect) ret = ret.mul(tmp.buyables.bd[12].effect)
				if (hasUpg("wi", 21)) ret = ret.mul(layers.wi.upgrades[21].effect())
				return ret;
			},
			effectDisplay(fx) { return "×" + format(fx) },
		},
		31: {
			desc: () => "Boosts all boost upgrades and point production above based on your best worker count.",
			cost: () => new Decimal(6000),
			unl() { return hasUpg(this.layer, 24) && hasMilestone("w", 0) },
			effect() {
				let ret = player["w"].best.cbrt().div(2).add(1);
				if (hasUpg(this.layer, 41)) ret = ret.times(layers.c.upgrades[41].effect())
				if (hasUpg(this.layer, 51)) ret = ret.mul(layers.c.upgrades[51].effect())
				if (tmp.buyables.bd[12]) ret = ret.mul(tmp.buyables.bd[12].effect)
				if (tmp.buyables.wf[31]) ret = ret.mul(tmp.buyables.wf[31].effect)
				if (hasUpg("w", 11)) ret = ret.pow(layers.w.upgrades[11].effect())
				if (player.b.banking & 1) ret = ret.pow(0.5)
				return ret;
			},
			effectDisplay(fx) { return "×" + format(fx) },
		},
		32: {
			desc: () => "Boosts coins gain on coin reset based on point generation speed.",
			cost: () => new Decimal(500000),
			unl() { return hasUpg(this.layer, 31) },
			effect() {
				let ret = new Decimal(1);
				if (tmp.pointGen !== undefined) ret = tmp.pointGen.add(1).pow(0.1)
				if (hasUpg(this.layer, 41)) ret = ret.times(layers.c.upgrades[41].effect())
				if (hasUpg(this.layer, 51)) ret = ret.mul(layers.c.upgrades[51].effect())
				if (tmp.buyables.bd[12]) ret = ret.mul(tmp.buyables.bd[12].effect)
				if (tmp.buyables.wf[31]) ret = ret.mul(tmp.buyables.wf[31].effect)
				return ret;
			},
			effectDisplay(fx) { return "×" + format(fx) },
		},
		33: {
			desc: () => "The two previous “all previous boost upgrades” upgrades are applied once more to point production.",
			cost: () => new Decimal(20000000),
			unl() { return hasUpg(this.layer, 32) },
		},
		34: {
			desc: () => "Boosts the above upgrade based on the two previous “all previous boost upgrades” upgrades.",
			cost: () => new Decimal(1.25e9),
			unl() { return hasUpg(this.layer, 33) },
			effect() {
				let ret = layers.c.upgrades[21].effect().times(layers.c.upgrades[31].effect()).pow(0.25)
				if (hasUpg(this.layer, 41)) ret = ret.times(layers.c.upgrades[41].effect())
				if (hasUpg(this.layer, 51)) ret = ret.mul(layers.c.upgrades[51].effect())
				if (tmp.buyables.bd[12]) ret = ret.mul(tmp.buyables.bd[12].effect)
				if (tmp.buyables.wf[31]) ret = ret.mul(tmp.buyables.wf[31].effect)
				return ret;
			},
			effectDisplay(fx) { return "×" + format(fx) },
		},
		41: {
			desc: () => "Boosts all boost upgrades above (again) based on your point production speed.",
			cost: () => new Decimal(3.5e9),
			unl() { return hasUpg(this.layer, 34) && hasMilestone("w", 1) },
			effect() {
				let ret = new Decimal(1);
				if (tmp.pointGen !== undefined) ret = tmp.pointGen.add(1).max(1).log10().add(1).pow(0.05)
				if (hasUpg(this.layer, 42)) ret = ret.pow(2)
				if (hasUpg(this.layer, 43)) ret = ret.mul(ret.pow(0.3333333))
				if (hasUpg(this.layer, 44)) ret = ret.mul(ret.pow(0.3333333))
				if (hasUpg(this.layer, 51)) ret = ret.mul(layers.c.upgrades[51].effect())
				if (hasUpg("w", 11)) ret = ret.pow(layers.w.upgrades[11].effect())
				if (tmp.buyables.wf[32]) ret = ret.mul(tmp.buyables.wf[32].effect)
				if (player.b.banking & 1) ret = ret.pow(0.5)
				return ret;
			},
			effectDisplay(fx) { return "×" + format(fx) },
		},
		42: {
			desc: () => "Alright this is getting boring. Boosts the previous upgrade by itself.",
			cost: () => new Decimal(4e10),
			unl() { return hasUpg(this.layer, 41) },
		},
		43: {
			desc: () => "Same as the previous upgrade, but the boost is cube rooted.",
			cost: () => new Decimal(4e12),
			unl() { return hasUpg(this.layer, 42) },
		},
		44: {
			desc: () => "Same as the previous upgrade. That's literally all you need to know.",
			cost: () => new Decimal(1.25e14),
			unl() { return hasUpg(this.layer, 43) },
		},
		51: {
			desc: () => "Boosts all boost upgrades above (yet again) based on your current workfinder count.",
			cost: () => new Decimal(2e29),
			unl() { return hasUpg(this.layer, 44) && hasUpg("wf", 11) },
			effect() {
				let ret = player.wf.points.add(1).pow(0.05);
				if (hasUpg(this.layer, 52)) ret = ret.mul(layers.c.upgrades[52].effect())
				if (hasUpg(this.layer, 61)) ret = ret.mul(layers.c.upgrades[61].effect())
				if (hasUpg(this.layer, 62)) ret = ret.mul(layers.c.upgrades[62].effect())
				if (hasUpg(this.layer, 63)) ret = ret.mul(layers.c.upgrades[62].effect())
				if (tmp.buyables.wf[33]) ret = ret.mul(tmp.buyables.wf[33].effect)
				if (hasUpg(this.layer, 54)) ret = ret.pow(1.02)
				if (player.b.banking & 1) ret = ret.pow(0.5)
				return ret;
			},
			effectDisplay(fx) { return "×" + format(fx) },
		},
		52: {
			desc: () => "Boosts the previous upgrade based on point generation speed.",
			cost: () => new Decimal(4e32),
			unl() { return hasUpg(this.layer, 51) },
			effect() {
				let ret = new Decimal(1);
				if (tmp.pointGen !== undefined) ret = tmp.pointGen.add(1).max(1).log(10).add(1).pow(0.02)
				if (hasUpg(this.layer, 53)) ret = ret.mul(layers.c.upgrades[53].effect())
				if (hasUpg(this.layer, 61)) ret = ret.mul(layers.c.upgrades[61].effect())
				if (hasUpg(this.layer, 62)) ret = ret.mul(layers.c.upgrades[62].effect())
				if (hasUpg(this.layer, 63)) ret = ret.mul(layers.c.upgrades[62].effect())
				if (tmp.buyables.wf[33]) ret = ret.mul(tmp.buyables.wf[33].effect)
				if (hasUpg(this.layer, 54)) ret = ret.pow(1.02)
				return ret;
			},
			effectDisplay(fx) { return "×" + format(fx) },
		},
		53: {
			desc: () => "Boosts the previous upgrade based on finished work count.",
			cost: () => new Decimal(1e46),
			unl() { return hasUpg(this.layer, 52) },
			effect() {
				let ret = new Decimal(1).add(player.wf.workDone).max(1).log(1e100).add(1)
				if (hasUpg(this.layer, 61)) ret = ret.mul(layers.c.upgrades[61].effect())
				if (hasUpg(this.layer, 62)) ret = ret.mul(layers.c.upgrades[62].effect())
				if (hasUpg(this.layer, 63)) ret = ret.mul(layers.c.upgrades[62].effect())
				if (tmp.buyables.wf[33]) ret = ret.mul(tmp.buyables.wf[33].effect)
				if (hasUpg(this.layer, 54)) ret = ret.pow(1.02)
				return ret;
			},
			effectDisplay(fx) { return "×" + format(fx) },
		},
		54: {
			desc: () => "Raises all left upgrades to the power of ^1.02.",
			cost: () => new Decimal(1e50),
			unl() { return hasUpg(this.layer, 53) },
		},
		61: {
			desc: () => "Boost all boost upgrades on the fifth row based on unfinished work.",
			cost: () => new Decimal(1e80),
			unl() { return hasUpg(this.layer, 54) && hasUpg("w", 15) },
			effect() {
				let ret = new Decimal(1).add(player.wf.workUndone).max(1).log(1e200).add(1)
				if (hasUpg(this.layer, 64)) ret = ret.mul(layers.c.upgrades[64].effect())
				return ret;
			},
			effectDisplay(fx) { return "×" + format(fx) },
		},
		62: {
			desc: () => "Boost all boost upgrades on the fifth row based on finished work.",
			cost: () => new Decimal(1e90),
			unl() { return hasUpg(this.layer, 61) },
			effect() {
				let ret = new Decimal(1).add(player.wf.workDone).max(1).log(1e200).add(1)
				if (hasUpg(this.layer, 64)) ret = ret.mul(layers.c.upgrades[64].effect())
				return ret;
			},
			effectDisplay(fx) { return "×" + format(fx) },
		},
		63: {
			desc: () => "Boost all boost upgrades on the fifth row based on bankings' effects.",
			cost: () => new Decimal(1e98),
			unl() { return hasUpg(this.layer, 62) },
			effect() {
				let ret = new Decimal(1)
				if (tmp.buyables.b[11].effect.mul) ret = new Decimal(1).add(tmp.buyables.b[11].effect.mul(tmp.buyables.b[12].effect).mul(tmp.buyables.b[13].effect)).max(1).log(1e300).add(1)
				if (hasUpg(this.layer, 64)) ret = ret.mul(layers.c.upgrades[64].effect())
				return ret;
			},
			effectDisplay(fx) { return "×" + format(fx) },
		},
		64: {
			desc: () => "Boost all left upgrades based on current bank count.",
			cost: () => new Decimal(1e108),
			unl() { return hasUpg(this.layer, 63) },
			effect() {
				let ret = player.b.points.add(1).pow(0.002)
				return ret;
			},
			effectDisplay(fx) { return "×" + format(fx, 3) },
		},
	},
	update(diff) {
		if (player[this.layer].total.eq(0)) {
			let kickstart = new Decimal(0)
			if (hasMilestone("w", 0)) kickstart = new Decimal(80)
			if (hasMilestone("w", 1)) kickstart = new Decimal(250)
			if (hasMilestone("w", 2)) kickstart = new Decimal(10000)
			if (hasMilestone("m", 0)) kickstart = new Decimal(1000000)
			player[this.layer].points = kickstart
			player[this.layer].best = kickstart
			player[this.layer].total = kickstart
		}
		if (hasUpg("c", 11)) player.points = player.points.add(tmp.pointGen.times(diff)).max(0).min(ENDGAME)
		if (hasUpg("w", 21) && tmp.gainExp !== undefined) {
			let delta = tmp.resetGain["c"].mul(0.1).mul(diff)
			addPoints("c", delta)
		}
		if (hasMilestone("m", 0) && tmp.gainExp !== undefined) {
			let delta = tmp.resetGain["c"].mul(100).mul(diff)
			addPoints("c", delta)
		}
	},
	automate() {
		if (player["w"].autoCoinUpgrade) {
			let penalty = player["w"].points.add(1).mul(5).pow(1.05)
			for (let x = 10; x <= 60; x += 10) for (let y = 1; y <= 4; y++) {
				var z = x + y
				if (!hasUpg("c", z) && canAffordUpg("c", z) && tmp.upgrades.c[z].unl) {
					buyUpg("c", z)
					player.wf.workUndone = player.wf.workUndone.add(penalty)
				}
			}
		}
	},

	hotkeys: [
		{ key: "c", desc: "C: Reset for coins", onPress() { doReset(this.layer) } },
	],
})
