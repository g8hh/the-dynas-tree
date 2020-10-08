
// ----- First row -----
addLayer("c", {
	startData() { return {         
		unl: true,               
		points:  new Decimal(2),  
		best: new Decimal(0),
		total: new Decimal(0),
	}},

	layerShown() {return true},   

	color:() => "#FFFF00",                      
	resource: "coins",           
	row: 0,                                 

	baseResource: "points",               
	baseAmount() {return player.points},   

	requires:() => new Decimal(2.5),   

	resetsNothing:() => player["m"].best.gte(1),
										
	
	type: "normal",                     
	exponent: 0.5,                          

	gainMult() {     
		let mul = new Decimal(1)
		if (hasUpg(this.layer, 24)) mul = mul.mul(1.25);
		if (hasUpg(this.layer, 32)) mul = mul.mul(layers.c.upgrades[32].effect())
		mul = mul.mul(tmp.layerEffs.b)
		mul = mul.mul(tmp.layerEffs.m)
		if (player.b.banking & 1) mul = mul.pow(0.5)
		return mul
	},
	gainExp() {      
		let mul = new Decimal(1)  
		if (player.b.banking & 4) mul = mul.mul(0.1)  
		return mul
	},
	
	upgrades: {
		rows: 6,
		cols: 4,
		11: {
			desc:() => "Generates " + format(tmp.pointGen) + " points every second.",
			cost:() => new Decimal(2),
			unl() { return player[this.layer].unl },
		},
		12: {
			desc:() => "Boosts points generation based on your total coin count.",
			cost:() => new Decimal(5),
			unl() { return hasUpg(this.layer, 11)},
			effect() {
				let ret = player[this.layer].total.div(5).add(1).max(1).log10().add(1)
				ret = ret.times(player.wf.workDoneEffect)
				if (hasUpg(this.layer, 13)) ret = ret.times(layers.c.upgrades[13].effect())
				if (hasUpg(this.layer, 21)) ret = ret.times(layers.c.upgrades[21].effect())
				if (hasUpg(this.layer, 31)) ret = ret.times(layers.c.upgrades[31].effect())
				if (hasUpg(this.layer, 41)) ret = ret.times(layers.c.upgrades[41].effect())
				if (hasUpg(this.layer, 51)) ret = ret.mul(layers.c.upgrades[51].effect())
				if (hasUpg("w", 12)) ret = ret.pow(layers.w.upgrades[12].effect())
				return ret;
			},
			effectDisplay(fx) { return "×"+format(fx) }, // Add formatting to the effect
		},
		13: {
			desc:() => "Boosts the previous upgrade based on your best coin count.",
			cost:() => new Decimal(10),
			unl() { return hasUpg(this.layer, 12) && !(player.b.banking & 2)},
			effect() {
				let ret = player[this.layer].best.div(2).add(1).max(1).log10().add(1)
				ret = ret.times(player.wf.workDoneEffect)
				if (hasUpg(this.layer, 14)) ret = ret.times(layers.c.upgrades[14].effect())
				if (hasUpg(this.layer, 21)) ret = ret.times(layers.c.upgrades[21].effect())
				if (hasUpg(this.layer, 31)) ret = ret.times(layers.c.upgrades[31].effect())
				if (hasUpg(this.layer, 41)) ret = ret.times(layers.c.upgrades[41].effect())
				if (hasUpg(this.layer, 51)) ret = ret.mul(layers.c.upgrades[51].effect())
				return ret;
			},
			effectDisplay(fx) { return "×"+format(fx) }, // Add formatting to the effect
		},
		14: {
			desc:() => "Boosts the previous upgrade based on your current coin count.",
			cost:() => new Decimal(15),
			unl() { return hasUpg(this.layer, 13)},
			effect() {
				let ret = player[this.layer].points.add(1).max(1).log10().add(1)
				ret = ret.times(player.wf.workDoneEffect)
				if (hasUpg(this.layer, 21)) ret = ret.times(layers.c.upgrades[21].effect())
				if (hasUpg(this.layer, 31)) ret = ret.times(layers.c.upgrades[31].effect())
				if (hasUpg(this.layer, 41)) ret = ret.times(layers.c.upgrades[41].effect())
				if (hasUpg(this.layer, 51)) ret = ret.mul(layers.c.upgrades[51].effect())
				return ret;
			},
			effectDisplay(fx) { return "×"+format(fx) }, // Add formatting to the effect
		},
		21: {
			desc:() => "Boosts all boost upgrades above based on your current point count.",
			cost:() => new Decimal(30),
			unl() { return hasUpg(this.layer, 14)},
			effect() {
				let ret = player.points.div(10).add(1).sqrt().max(1).log10().add(1)
				ret = ret.times(player.wf.workDoneEffect)
				if (hasUpg(this.layer, 22)) ret = ret.times(layers.c.upgrades[22].effect())
				if (hasUpg(this.layer, 31)) ret = ret.times(layers.c.upgrades[31].effect())
				if (hasUpg(this.layer, 41)) ret = ret.times(layers.c.upgrades[41].effect())
				if (hasUpg(this.layer, 51)) ret = ret.mul(layers.c.upgrades[51].effect())
				if (hasUpg("w", 11)) ret = ret.pow(layers.w.upgrades[11].effect())
				if (player.b.banking & 1) ret = ret.pow(0.5)
				return ret;
			},
			effectDisplay(fx) { return "×"+format(fx) }, // Add formatting to the effect
		},
		22: {
			desc:() => "Boosts the previous upgrade based on your coins gain on coin reset.",
			cost:() => new Decimal(100),
			unl() { return hasUpg(this.layer, 21)},
			effect() {
				let p = new Decimal(1)
				if (tmp.gainExp !== undefined) p = tmp.resetGain["c"];
				let ret = p.cbrt().add(1).log10().add(1)
				ret = ret.times(player.wf.workDoneEffect)
				if (hasUpg(this.layer, 31)) ret = ret.times(layers.c.upgrades[31].effect())
				if (hasUpg(this.layer, 41)) ret = ret.times(layers.c.upgrades[41].effect())
				if (hasUpg(this.layer, 51)) ret = ret.mul(layers.c.upgrades[51].effect())
				return ret;
			},
			effectDisplay(fx) { return "×"+format(fx) },
		},
		23: {
			desc:() => "The point generation upgrade also gets boosted by the “all previous boost upgrades” upgrade.",
			cost:() => new Decimal(300),
			unl() { return hasUpg(this.layer, 22)},
		},
		24: {
			desc:() => "Boosts coins gain on coin reset (unaffected by the “all previous boost upgrades” upgrades).",
			cost:() => new Decimal(1500),
			unl() { return hasUpg(this.layer, 23)},
			effect() {
				let ret = new Decimal(8);
				ret = ret.times(player.wf.workDoneEffect)
				if (hasUpg(this.layer, 34)) ret = ret.times(layers.c.upgrades[34].effect())
				return ret;
			},
			effectDisplay(fx) { return "×"+format(fx) },
		},
		31: {
			desc:() => "Boosts all boost upgrades and point production above based on your best worker count.",
			cost:() => new Decimal(6000),
			unl() { return hasUpg(this.layer, 24) && player["w"].best.gte(1)},
			effect() {
				let ret = player["w"].best.cbrt().div(2).add(1);
				if (hasUpg(this.layer, 41)) ret = ret.times(layers.c.upgrades[41].effect())
				if (hasUpg(this.layer, 51)) ret = ret.mul(layers.c.upgrades[51].effect())
				if (hasUpg("w", 11)) ret = ret.pow(layers.w.upgrades[11].effect())
				if (player.b.banking & 1) ret = ret.pow(0.5)
				return ret;
			},
			effectDisplay(fx) { return "×"+format(fx) },
		},
		32: {
			desc:() => "Boosts coins gain on coin reset based on point generation speed.",
			cost:() => new Decimal(500000),
			unl() { return hasUpg(this.layer, 31)},
			effect() {
				let ret = new Decimal(1);
				if (tmp.pointGen !== undefined) ret = tmp.pointGen.add(1).pow(0.1)
				if (hasUpg(this.layer, 41)) ret = ret.times(layers.c.upgrades[41].effect())
				if (hasUpg(this.layer, 51)) ret = ret.mul(layers.c.upgrades[51].effect())
				return ret;
			},
			effectDisplay(fx) { return "×"+format(fx) },
		},
		33: {
			desc:() => "The two previous “all previous boost upgrades” upgrades are applied once more to point production.",
			cost:() => new Decimal(20000000),
			unl() { return hasUpg(this.layer, 32)},
		},
		34: {
			desc:() => "Boosts the above upgrade based on the two previous “all previous boost upgrades” upgrades.",
			cost:() => new Decimal(1.25e9),
			unl() { return hasUpg(this.layer, 33)},
			effect() {
				let ret = layers.c.upgrades[21].effect().times(layers.c.upgrades[31].effect()).pow(0.25)
				if (hasUpg(this.layer, 41)) ret = ret.times(layers.c.upgrades[41].effect())
				if (hasUpg(this.layer, 51)) ret = ret.mul(layers.c.upgrades[51].effect())
				return ret;
			},
			effectDisplay(fx) { return "×"+format(fx) },
		},
		41: {
			desc:() => "Boosts all boost upgrades above (again) based on your point production speed.",
			cost:() => new Decimal(3.5e9),
			unl() { return hasUpg(this.layer, 34) && player["w"].best.gte(2)},
			effect() {
				let ret = new Decimal(1);
				if (tmp.pointGen !== undefined) ret = tmp.pointGen.add(1).max(1).log10().add(1).pow(0.05)
				if (hasUpg(this.layer, 42)) ret = ret.pow(2)
				if (hasUpg(this.layer, 43)) ret = ret.mul(ret.pow(0.3333333))
				if (hasUpg(this.layer, 44)) ret = ret.mul(ret.pow(0.3333333))
				if (hasUpg(this.layer, 51)) ret = ret.mul(layers.c.upgrades[51].effect())
				if (hasUpg("w", 11)) ret = ret.pow(layers.w.upgrades[11].effect())
				if (player.b.banking & 1) ret = ret.pow(0.5)
				return ret;
			},
			effectDisplay(fx) { return "×"+format(fx) },
		},
		42: {
			desc:() => "Alright this is getting boring. Boosts the previous upgrade by itself.",
			cost:() => new Decimal(4e10),
			unl() { return hasUpg(this.layer, 41) },
		},
		43: {
			desc:() => "Same as the previous upgrade, but the boost is cube rooted.",
			cost:() => new Decimal(4e12),
			unl() { return hasUpg(this.layer, 42) },
		},
		44: {
			desc:() => "Same as the previous upgrade. That's literally all you need to know.",
			cost:() => new Decimal(1.25e14),
			unl() { return hasUpg(this.layer, 43) },
		},
		51: {
			desc:() => "Boosts all boost upgrades above (yet again) based on your current workfinder count.",
			cost:() => new Decimal(2e29),
			unl() { return hasUpg(this.layer, 44) && hasUpg("wf", 11) },
			effect() {
				let ret = player.wf.points.add(1).pow(0.05);
				if (hasUpg(this.layer, 52)) ret = ret.mul(layers.c.upgrades[52].effect())
				if (hasUpg(this.layer, 61)) ret = ret.mul(layers.c.upgrades[61].effect())
				if (hasUpg(this.layer, 62)) ret = ret.mul(layers.c.upgrades[62].effect())
				if (hasUpg(this.layer, 63)) ret = ret.mul(layers.c.upgrades[62].effect())
				if (hasUpg(this.layer, 54)) ret = ret.pow(1.02)
				if (player.b.banking & 1) ret = ret.pow(0.5)
				return ret;
			},
			effectDisplay(fx) { return "×"+format(fx) },
		},
		52: {
			desc:() => "Boosts the previous upgrade based on point generation speed.",
			cost:() => new Decimal(4e32),
			unl() { return hasUpg(this.layer, 51) },
			effect() {
				let ret = new Decimal(1);
				if (tmp.pointGen !== undefined) ret = tmp.pointGen.add(1).max(1).log(10).add(1).pow(0.02)
				if (hasUpg(this.layer, 53)) ret = ret.mul(layers.c.upgrades[53].effect())
				if (hasUpg(this.layer, 61)) ret = ret.mul(layers.c.upgrades[61].effect())
				if (hasUpg(this.layer, 62)) ret = ret.mul(layers.c.upgrades[62].effect())
				if (hasUpg(this.layer, 63)) ret = ret.mul(layers.c.upgrades[62].effect())
				if (hasUpg(this.layer, 54)) ret = ret.pow(1.02)
				return ret;
			},
			effectDisplay(fx) { return "×"+format(fx) },
		},
		53: {
			desc:() => "Boosts the previous upgrade based on finished work count.",
			cost:() => new Decimal(1e46),
			unl() { return hasUpg(this.layer, 52) },
			effect() {
				let ret = new Decimal(1).add(player.wf.workDone).max(1).log(1e100).add(1)
				if (hasUpg(this.layer, 61)) ret = ret.mul(layers.c.upgrades[61].effect())
				if (hasUpg(this.layer, 62)) ret = ret.mul(layers.c.upgrades[62].effect())
				if (hasUpg(this.layer, 63)) ret = ret.mul(layers.c.upgrades[62].effect())
				if (hasUpg(this.layer, 54)) ret = ret.pow(1.02)
				return ret;
			},
			effectDisplay(fx) { return "×"+format(fx) },
		},
		54: {
			desc:() => "Raises all left upgrades to the power of ^1.02.",
			cost:() => new Decimal(1e50),
			unl() { return hasUpg(this.layer, 53) },
		},
		61: {
			desc:() => "Boost all boost upgrades on the fifth row based on unfinished work.",
			cost:() => new Decimal(1e80),
			unl() { return hasUpg(this.layer, 54) && hasUpg("w", 15) },
			effect() {
				let ret = new Decimal(1).add(player.wf.workUndone).max(1).log(1e200).add(1)
				if (hasUpg(this.layer, 64)) ret = ret.mul(layers.c.upgrades[64].effect())
				return ret;
			},
			effectDisplay(fx) { return "×"+format(fx) },
		},
		62: {
			desc:() => "Boost all boost upgrades on the fifth row based on finished work.",
			cost:() => new Decimal(1e90),
			unl() { return hasUpg(this.layer, 61) },
			effect() {
				let ret = new Decimal(1).add(player.wf.workDone).max(1).log(1e200).add(1)
				if (hasUpg(this.layer, 64)) ret = ret.mul(layers.c.upgrades[64].effect())
				return ret;
			},
			effectDisplay(fx) { return "×"+format(fx) },
		},
		63: {
			desc:() => "Boost all boost upgrades on the fifth row based on bankings' effects.",
			cost:() => new Decimal(1e98),
			unl() { return hasUpg(this.layer, 62) },
			effect() {
				let ret = new Decimal(1)
				if (tmp.buyables) ret = new Decimal(1).add(tmp.buyables.b[11].effect.mul(tmp.buyables.b[12].effect).mul(tmp.buyables.b[13].effect)).max(1).log(1e300).add(1)
				if (hasUpg(this.layer, 64)) ret = ret.mul(layers.c.upgrades[64].effect())
				return ret;
			},
			effectDisplay(fx) { return "×"+format(fx) },
		},
		64: {
			desc:() => "Boost all left upgrades based on current bank count.",
			cost:() => new Decimal(1e108),
			unl() { return hasUpg(this.layer, 63) },
			effect() {
				let ret = player.b.points.add(1).pow(0.002)
				return ret;
			},
			effectDisplay(fx) { return "×"+format(fx, 3) },
		},
	},
	update(diff) {
		if (player[this.layer].total.eq(0)) {
			let kickstart = new Decimal(0)
			if (player["w"].best.gte(1)) kickstart = new Decimal(80)
			if (player["w"].best.gte(2)) kickstart = new Decimal(250)
			if (player["w"].best.gte(3)) kickstart = new Decimal(10000)
			if (player["m"].best.gte(1)) kickstart = new Decimal(1000000)
			player[this.layer].points = kickstart
			player[this.layer].best = kickstart
			player[this.layer].total = kickstart
		}
		if (hasUpg("c", 11)) player.points = player.points.add(tmp.pointGen.times(diff)).max(0)
		if (hasUpg("w", 21) && tmp.gainExp !== undefined) { 
			let delta = tmp.resetGain["c"].mul(0.1).mul(diff)
			player.c.points = player.c.points.add(delta).max(0)
			player.c.total = player.c.total.add(delta).max(0)
			player.c.best = player.c.best.max(player.c.points)
		}
		if (player["m"].best.gte(1) && tmp.gainExp !== undefined) { 
			let delta = tmp.resetGain["c"].mul(10).mul(diff)
			player.c.points = player.c.points.add(delta).max(0)
			player.c.total = player.c.total.add(delta).max(0)
			player.c.best = player.c.best.max(player.c.points)
		}
	},
	automate() {
		if (player["w"].autoCoinUpgrade) {
			let penalty = player["w"].points.add(1).mul(5).pow(1.05)
			for (let x = 10; x <= 60; x += 10) for (let y = 1; y <= 4; y++) {
				var z = x + y
				if (!hasUpg("c", z) && canAffordUpg("c", z) && tmp.upgrades.c[z].unl) {
					buyUpg("c", z)
					console.log(z)
					player.wf.workUndone = player.wf.workUndone.add(penalty)
				}
			}
		}
	},
	
	hotkeys: [
		{key: "c", desc: "C: Coin reset", onPress(){if (player[this.layer].unl) doReset(this.layer)}},
	],
})

// ----- Second row -----
addLayer("wf", {
	startData() { return {         
		unl: false,               
		points: new Decimal(0),  
		best: new Decimal(0),
		total: new Decimal(0),
		workUndone: new Decimal(0),
		workDone: new Decimal(0),
		workUndoneEffect: new Decimal(0),
		workDoneEffect: new Decimal(0),
		workUndonePerSec: new Decimal(0),
		workDonePerSec: new Decimal(0),
	}},

	layerShown() {return player["w"].best.gte(4) || player[this.layer].unl || player.m.unl},   

	color:() => "#333333",                      
	resource: "workfinders",           
	row: 1,                                 

	baseResource: "coins",               
	baseAmount() {return player["c"].points},  
    branches: [["c", 1]],

	requires:() => new Decimal(1e20),          	
	
	type: "static",   
	base: 5000,                  
	exponent: 0.6,    
	canBuyMax: () => (player["w"].upgrades.includes(23) || player["m"].best.gte(1)),

	gainMult() {                    
		return new Decimal(1)
	},
	gainExp() {              
		return new Decimal(1)
	},
	
	buyables: {
		rows: 2,
		cols: 3,
		11: {
			title:() => "Increase workers' strength",
			cost(x) {
				if (x.gte(10)) x = x.pow(x.div(10))
				let cost = Decimal.pow(10, x).mul(1000)
				return cost.floor()
			},
			effect(x) { // Effects of owning x of the items, x is a decimal
				if (!tmp.buyables[this.layer][12]) return Decimal.pow(1.35, x)
				let eff = Decimal.pow(tmp.buyables[this.layer][12].effect.add(1.35), x)
				if (tmp.buyables[this.layer][13]) eff = eff.pow(tmp.buyables[this.layer][13].effect)
				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "Level " + player[this.layer].buyables[this.id] + "\n\
				Cost: " + format(data.cost) + " finished work\n\
				Increases work finishing speed by ×" + format(tmp.buyables[this.layer][12] ? tmp.buyables[this.layer][12].effect.add(1.35) : 1.35) + " per level.\n\
				Currently: ×" + format(data.effect)
			},
			unl() { return player[this.layer].unl }, 
			canAfford() {
				return player[this.layer].workDone.gte && player[this.layer].workDone.gte(tmp.buyables[this.layer][this.id].cost)},
			buy() { 
				cost = tmp.buyables[this.layer][this.id].cost
				player[this.layer].workDone = player[this.layer].workDone.sub(cost)	
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
		},
		12: {
			title:() => "Increase workers' dexterity",
			cost(x) {
				if (x.gte(10)) x = x.pow(x.div(10))
				let cost = Decimal.pow(10, x).mul(2000)
				return cost.floor()
			},
			effect(x) { // Effects of owning x of the items, x is a decimal
				let eff = x.mul(0.01)
				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "Level " + player[this.layer].buyables[this.id] + "\n\
				Cost: " + format(data.cost) + " finished work\n\
				Increases the previous increase upgrade by +0.01 per level per level.\n\
				Currently: +" + format(data.effect)
			},
			unl() { return player[this.layer].unl }, 
			canAfford() {
				return player[this.layer].workDone.gte && player[this.layer].workDone.gte(tmp.buyables[this.layer][this.id].cost)},
			buy() { 
				cost = tmp.buyables[this.layer][this.id].cost
				player[this.layer].workDone = player[this.layer].workDone.sub(cost)	
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
		},
		13: {
			title:() => "Increase workers' collaborativeness",
			cost(x) {
				if (x.gte(10)) x = x.pow(x.div(10))
				let cost = Decimal.pow(20, x).mul(5000)
				return cost.floor()
			},
			effect(x) { // Effects of owning x of the items, x is a decimal
				let eff = x.mul(0.01).add(1)
				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "Level " + player[this.layer].buyables[this.id] + "\n\
				Cost: " + format(data.cost) + " finished work\n\
				Increases the first upgrade's effect by ^+0.01 per level. Levels on this upgrade stack additively.\n\
				Currently: ^" + format(data.effect)
			},
			unl() { return player[this.layer].unl }, 
			canAfford() {
				return player[this.layer].workDone.gte && player[this.layer].workDone.gte(tmp.buyables[this.layer][this.id].cost)},
			buy() { 
				cost = tmp.buyables[this.layer][this.id].cost
				player[this.layer].workDone = player[this.layer].workDone.sub(cost)	
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
		},
		21: {
			title:() => "Promote workfinders to part-time workers",
			cost(x) {
				if (x.gte(10)) x = x.pow(x.div(10))
				let cost = Decimal.pow(x.add(1), 1.5).mul(6)
				return cost.floor()
			},
			effect(x) { // Effects of owning x of the items, x is a decimal
				let eff = x.mul(10).cbrt()
				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "Level " + player[this.layer].buyables[this.id] + "\n\
				Cost: " + format(data.cost) + " workfinders\n\
				Workfinders also finish works at reduced workers' capacity.\n\
				Currently: " + format(data.effect) + "%"
			},
			unl() { return player[this.layer].unl }, 
			canAfford() {
				return player[this.layer].points.gte(tmp.buyables[this.layer][this.id].cost)},
			buy() { 
				cost = tmp.buyables[this.layer][this.id].cost
				player[this.layer].points = player[this.layer].points.sub(cost)	
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
		},
		22: {
			title:() => "Increase work quality",
			cost(x) {
				if (x.gte(10)) x = x.pow(x.div(10))
				let cost = Decimal.pow(1e6, x).mul(1e29)
				return cost.floor()
			},
			effect(x) { // Effects of owning x of the items, x is a decimal
				let eff = x.mul(0.4).add(1).cbrt()
				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "Level " + player[this.layer].buyables[this.id] + "\n\
				Cost: " + format(data.cost) + " coins\n\
				Boosts the finished work's effect.\n\
				Currently: ^" + format(data.effect)
			},
			unl() { return player[this.layer].unl }, 
			canAfford() {
				return player.c.points.gte(tmp.buyables[this.layer][this.id].cost)},
			buy() { 
				cost = tmp.buyables[this.layer][this.id].cost
				player.c.points = player.c.points.sub(cost)	
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
		},
		23: {
			title:() => "Increase work planning skills",
			cost(x) {
				if (x.gte(10)) x = x.pow(x.div(10))
				let cost = Decimal.pow(1e10, x).mul(1e40)
				return cost.floor()
			},
			effect(x) { // Effects of owning x of the items, x is a decimal
				let eff = x.mul(0.02).add(1).recip()
				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "Level " + player[this.layer].buyables[this.id] + "\n\
				Cost: " + format(data.cost) + " coins\n\
				Reduces the unfinished work penalty.\n\
				Currently: ^" + format(data.effect, 3)
			},
			unl() { return player[this.layer].unl }, 
			canAfford() {
				return player.c.points.gte(tmp.buyables[this.layer][this.id].cost)},
			buy() { 
				cost = tmp.buyables[this.layer][this.id].cost
				player.c.points = player.c.points.sub(cost)	
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
		},
	},
	
	upgrades: {
		rows: 2,
		cols: 5,
		11: {
			desc:() => "Unlock a new row of coin upgrades because why not?",
			cost:() => new Decimal(5),
			unl() { return player[this.layer].unl },
		},
		12: {
			desc:() => "Finish work faster based on unfinished work count.",
			cost:() => new Decimal(17),
			unl() { return hasUpg("wf", 11) },
			effect() {
				let ret = new Decimal(1).add(player.wf.workUndone).max(1).log(100).add(1)
				return ret;
			},
			effectDisplay(fx) { return "×"+format(fx) },
		},
		13: {
			desc:() => "Finish work faster based on finshed work's effect.",
			cost:() => new Decimal(22),
			unl() { return hasUpg("wf", 12) },
			effect() {
				let ret = Decimal.log(new Decimal(1).add(player.wf.workDoneEffect).max(1), 10).add(1)
				return ret;
			},
			effectDisplay(fx) { return "×"+format(fx) },
		},
		14: {
			desc:() => "Find work faster based on finshed work count.",
			cost:() => new Decimal(26),
			unl() { return hasUpg("wf", 13) },
			effect() {
				let ret = new Decimal(1).add(player.wf.workDone).max(1).log(100).add(1).cbrt()
				return ret;
			},
			effectDisplay(fx) { return "×"+format(fx) },
		},
		15: {
			desc:() => "Find work faster based on current workfinder count.",
			cost:() => new Decimal(29),
			unl() { return hasUpg("wf", 14) },
			effect() {
				let ret = player.wf.points.add(1).pow(0.2)
				return ret;
			},
			effectDisplay(fx) { return "×"+format(fx) },
		},
		21: {
			desc:() => "Multiplier to finished work's effect based on unfinished work's effect.",
			cost:() => new Decimal(80),
			unl() { return hasUpg("wf", 15) },
			effect() {
				let ret = Decimal.pow(player.wf.workUndoneEffect, 3).add(1)
				return ret;
			},
			effectDisplay(fx) { return "×"+format(fx) },
		},
		22: {
			desc:() => "Power to unfinished work's effect based on finished work's effect.",
			cost:() => new Decimal(234),
			unl() { return hasUpg("wf", 21) },
			effect() {
				let ret = Decimal.add(player.wf.workDoneEffect, 1).log(1e12).add(1).recip()
				return ret;
			},
			effectDisplay(fx) { return "^"+format(fx, 3) },
		},
		23: {
			desc:() => "Finish work 10 times faster. Are you happy now?",
			cost:() => new Decimal(242),
			unl() { return hasUpg("wf", 22) },
		},
		24: {
			desc:() => "Find work 5 times faster. With yin there are yang.",
			cost:() => new Decimal(252),
			unl() { return hasUpg("wf", 22) },
		},
		25: {
			desc:() => "Guys this is it. A new prestige layer.",
			cost:() => new Decimal(555),
			unl() { return hasUpg("wf", 24) },
		},
	},
	
	tabFormat: 
		["main-display",
			["prestige-button", function() {return "Hire "}],
			["blank", "5px"],
			["display-text",
				function() {return "You have at best " + format(player.wf.best, 0) + " workfinders."}],
			["display-text",
				function() {return player.wf.best >= 100 ? "\
				Workfinders' efficiency starts dropping at 100 workfinders, then it drops faster at 40,000 and 16,000,000 workfinders. Currently: " + format(awf.max(100).log10().div(player.wf.points.max(100).log10()).min(1).mul(100), 3) + "%" : ""}],
			["blank", "5px"],
			["display-text",
				function() {return "You have " + format(player.wf.workDone, 0) + " finished work, which are increasing the effects of the first two rows of your coin layer's boost upgrades by ×" + format(player.wf.workDoneEffect, 3) + "."}],
			["display-text",
				function() {return "You have " + format(player.wf.workUndone, 0) + " unfinished work, which are raising the finished work's effect to the power of ^" + format(player.wf.workUndoneEffect, 5).replace(",", "") + "."}],
			["blank", "5px"],
			["display-text",
				function() {return "Your workfinders are finding " + format(player.wf.workUndonePerSec) + " unfinished work and your workers are finishing " + format(player.wf.workDonePerSec) + " work per second. (" + format(player.wf.workUndonePerSec.sub(player.wf.workDonePerSec)) + " actual unfinished work and " + format(Decimal.min(player.wf.workUndonePerSec, player.wf.workDonePerSec)) + " actual finished work per second)"}],
			["blank", "5px"],
			"buyables", ["blank", "5px"], "upgrades", "milestones"],
	
	update(diff) {
		awf = player.wf.points;
		if (awf >= 16000000) awf = awf.pow(0.5).mul(4000)
		if (awf >= 40000) awf = awf.pow(0.5).mul(200)
		if (awf >= 100) awf = awf.pow(0.5).mul(10)
		
		let wups = awf.pow(1.25)
		if (hasUpg("wf", 14)) wups = wups.mul(layers.wf.upgrades[14].effect())
		if (hasUpg("wf", 15)) wups = wups.mul(layers.wf.upgrades[15].effect())
		if (hasUpg("wf", 24)) wups = wups.mul(5)
		if (hasUpg("w", 22)) wups = wups.mul(layers.w.upgrades[22].effect())
		if (hasUpg("w", 24)) wups = wups.mul(layers.w.upgrades[24].effect())
		player[this.layer].workUndonePerSec = wups
	
		let wdps = player.w.points.add(awf.mul(tmp.buyables[this.layer][21].effect.div(100))).pow(1.25).mul(tmp.buyables[this.layer][11].effect)
		if (hasUpg("wf", 12)) wdps = wdps.mul(layers.wf.upgrades[12].effect())
		if (hasUpg("wf", 13)) wdps = wdps.mul(layers.wf.upgrades[13].effect())
		if (hasUpg("wf", 23)) wdps = wdps.mul(10)
		if (hasUpg("w", 22)) wdps = wdps.mul(layers.w.upgrades[22].effect())
		if (hasUpg("w", 24)) wdps = wdps.mul(layers.w.upgrades[24].effect())
		player[this.layer].workDonePerSec = wdps
		
		if (!player[this.layer].workUndone.add) player[this.layer].workUndone = new Decimal(player[this.layer].workUndone)
		if (!player[this.layer].workDone.add) player[this.layer].workDone = new Decimal(player[this.layer].workDone)
		let wu = player[this.layer].workUndone = player[this.layer].workUndone.add(wups.times(diff)).max(0)
		let dwd = wdps.times(diff).min(wu)
		wu = player[this.layer].workUndone = player[this.layer].workUndone.sub(dwd).max(0)
		let wd = player[this.layer].workDone = player[this.layer].workDone.add(dwd).max(0)
		
		let wue = wu.add(1).log(1e10).add(1).cbrt().recip().pow(tmp.buyables[this.layer][23].effect)
		if (hasUpg("wf", 22)) wue = wue.pow(layers.wf.upgrades[22].effect())
		player[this.layer].workUndoneEffect = wue
	
		let wde = wd.add(1).pow(0.1).pow(tmp.buyables[this.layer][22].effect).pow(wue)
		if (hasUpg("wf", 21)) wde = wde.mul(layers.wf.upgrades[21].effect())
		if (player.b.banking & 1) wde = wde.pow(0.5)
		player[this.layer].workDoneEffect = wde
	},
	automate() {
		if (player["w"].autoFinderUpgrade) {
			let penalty = player["w"].points.add(1).mul(600).pow(1.25)
			for (let x = 10; x <= 20; x += 10) for (let y = 1; y <= 3; y++) {
				var z = x + y
				if (tmp.buyables.wf[z].unl && tmp.buyables.wf[z].canAfford) {
					buyBuyable("wf", z)
					player.wf.workUndone = player.wf.workUndone.add(penalty)
				}
			}
		}
	},
	
	hotkeys: [
		{key: "f", desc: "F: Hire workfinders", onPress(){if (player[this.layer].unl) doReset(this.layer)}},
	],
})
addLayer("b", {
	startData() { return {         
		unl: false,               
		points: new Decimal(0),  
		best: new Decimal(0),
		total: new Decimal(0),
		banking: 0,
		bankTime: new Decimal(0),
		speed: new Decimal(0),
	}},

	layerShown() {return player["w"].best.gte(7) || player[this.layer].unl || player.m.unl},   

	color:() => "#00FF00",                      
	resource: "banks",           
	row: 1,                                 

	baseResource: "points",               
	baseAmount() {return player.points},  

	requires:() => new Decimal(5e83),          	
	
	type: "static",   
	base: 50000,                  
	exponent: 1.25,    
	canBuyMax: () => player["w"].best.gte(12),
	
	effect() {
		var eff = Decimal.pow(16, player.b.points)
		if (player.b.banking & 1) eff = eff.pow(0.5)
		return eff
	},
	effectDescription() {
		eff = tmp.layerEffs.b;
		return "which are boosting your coin gains by ×" + format(eff)
	},

	gainMult() {             
		return new Decimal(1)
	},
	gainExp() {                             
		return new Decimal(1)
	},
	
	buyables: {
		rows: 2,
		cols: 3,
		11: {
			title:() => "Coin Banking",
			cost(x) {
				return new Decimal(0)
			},
			effect(x) { 
				var eff = player[this.layer].buyables[this.id].add(1).pow(0.35)
				if (eff.gte(1e9)) eff = eff.mul(1e9).sqrt()
				if (tmp.buyables.b[21]) eff = eff.mul(tmp.buyables.b[21].effect)
				if (tmp.buyables.b[22]) eff = eff.mul(tmp.buyables.b[22].effect)
				if (hasUpg("w", 25)) eff = eff.pow(layers.w.upgrades[25].effect())
				return eff
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return data.canAfford 
					? "You have " + format(player[this.layer].buyables[this.id], 0) + " banked coins, which are boosting the point generation speed by ×" + format(data.effect) + ".\n\n\
						Banking is currently " + (player.b.banking == 1 ? "enabled.\n\
						Click here to disable banking and gain " + format(player.c.points.sub(player.b.buyables[11]).max(0), 0) + " banked coins." : "disabled.\n\
						Click here to enable banking, which will force a bank reset and square root all of your point generation speed, coin gains, workers' effect, finished works' effects, banks' effects and your “all previous boost upgrades” upgrades' effects.")
					: (player.b.banking > 0 ? "Please disable the current active banking before you can activate another one." : "You need to build at least 2 banks before you can use this function.")
			},
			unl() { return true }, 
			canAfford() { return player[this.layer].best.gte(2) && (player.b.banking == 0 || player.b.banking == 1) },
			buy() { 
				if (player.b.banking == 1) player.b.buyables[11] = player.b.buyables[11].max(player.c.points)
				player.b.banking = player.b.banking == 1 ? 0 : 1
                doReset(this.layer, true)
			},
		},
		12: {
			title:() => "Point Banking",
			cost(x) {
				return new Decimal(0)
			},
			effect(x) { 
				var eff = player[this.layer].buyables[this.id].add(1).pow(0.6)
				if (eff.gte(1e9)) eff = eff.mul(1e9).sqrt()
				if (tmp.buyables.b[21]) eff = eff.mul(tmp.buyables.b[21].effect)
				if (tmp.buyables.b[22]) eff = eff.mul(tmp.buyables.b[22].effect)
				if (hasUpg("w", 25)) eff = eff.pow(layers.w.upgrades[25].effect())
				return eff
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return data.canAfford 
					? "You have " + format(player[this.layer].buyables[this.id], 0) + " banked points, which are boosting the point generation speed by ×" + format(data.effect) + ".\n\n\
						Banking is currently " + (player.b.banking == 2 ? "enabled.\n\
						Click here to disable banking and gain " + format(player.points.sub(player.b.buyables[12]).max(0), 0) + " banked points." : "disabled.\n\
						Click here to enable banking, which will force a bank reset, cube root your point generation speed and lock you out so you can only be able to access the first two coin upgrades.")
					: (player.b.banking > 0 ? "Please disable the current active banking before you can activate another one." : "You need to build at least 4 banks before you can use this function.")
			},
			unl() { return true }, 
			canAfford() { return player[this.layer].best.gte(4) && (player.b.banking == 0 || player.b.banking == 2) },
			buy() { 
				if (player.b.banking == 2) player.b.buyables[12] = player.b.buyables[12].max(player.points)
				player.b.banking = player.b.banking == 2 ? 0 : 2
                doReset(this.layer, true)
			},
		},
		13: {
			title:() => "Time Banking",
			cost(x) {
				return new Decimal(0)
			},
			effect(x) { 
				var eff = player[this.layer].buyables[this.id].mul(2).add(1).pow(0.9)
				if (eff.gte(100000)) eff = eff.mul(100000).sqrt()
				if (tmp.buyables.b[21]) eff = eff.mul(tmp.buyables.b[21].effect)
				if (tmp.buyables.b[22]) eff = eff.mul(tmp.buyables.b[22].effect)
				if (hasUpg("w", 25)) eff = eff.pow(layers.w.upgrades[25].effect())
				return eff
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return data.canAfford 
					? "You have " + format(player[this.layer].buyables[this.id], 0) + " banked time, which are boosting the point generation speed by ×" + format(data.effect) + ".\n\n\
						Banking is currently " + (player.b.banking == 3 ? "enabled.\n\
						Click here to disable banking and gain " + format(Decimal.sub(tmp.pointGen, player.b.buyables[13]).max(0), 0) + " banked time." : "disabled.\n\
						Click here to enable banking, which will force a bank reset, and all of the previous banking debuffs will be applied at once. The thing you are banking here is your points generated per second.")
					: (player.b.banking > 0 ? "Please disable the current active banking before you can activate another one." : "You need to build at least 6 banks before you can use this function.")
			},
			unl() { return true }, 
			canAfford() { return player[this.layer].best.gte(6) && (player.b.banking == 0 || player.b.banking == 3) },
			buy() { 
				if (player.b.banking == 3) player.b.buyables[13] = player.b.buyables[13].max(tmp.pointGen)
				player.b.banking = player.b.banking == 3 ? 0 : 3
                doReset(this.layer, true)
			},
		},
		21: {
			title:() => "Meta Banking",
			cost(x) {
				return new Decimal(0)
			},
			effect(x) { 
				var eff = player[this.layer].buyables[this.id].mul(2.5).add(1).pow(0.4)
				if (tmp.buyables.b[22]) eff = eff.mul(tmp.buyables.b[22].effect)
				return eff
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return data.canAfford 
					? "You have " + format(player[this.layer].buyables[this.id], 0) + " banked metas, which are boosting all previous bankings' buffs by ×" + format(data.effect) + ".\n\n\
						Banking is currently " + (player.b.banking == 4 ? "enabled.\n\
						Click here to disable banking and gain " + format(Decimal.sub(tmp.resetGain ? tmp.resetGain["c"] : 0, player.b.buyables[21]).max(0), 0) + " banked metas." : "disabled.\n\
						Click here to enable banking, which will force a bank reset, and tenth root your point generation and coin gains. The thing you are banking here is your coins gain on coin reset.")
					: (player.b.banking > 0 ? "Please disable the current active banking before you can activate another one." : "You need to build at least 12 banks before you can use this function.")
			},
			unl() { return player["w"].best.gte(13) }, 
			canAfford() { return player[this.layer].best.gte(12) && (player.b.banking == 0 || player.b.banking == 4) },
			buy() { 
				if (player.b.banking == 4) player.b.buyables[21] = player.b.buyables[21].max(tmp.resetGain["c"])
				player.b.banking = player.b.banking == 4 ? 0 : 4
                doReset(this.layer, true)
			},
		},
		22: {
			title:() => "Speed Banking",
			cost(x) {
				return new Decimal(0)
			},
			effect(x) { 
				var eff = player[this.layer].buyables[this.id].mul(2.5).add(1).pow(0.6)
				return eff
			},
			display() { 
				let data = tmp.buyables[this.layer][this.id]
				return data.canAfford 
					? "You have " + format(player[this.layer].buyables[this.id], 0) + " banked speed, which are boosting all previous bankings' buffs by ×" + format(data.effect) + ".\n\n\
						Banking is currently " + (player.b.banking == 8 ? "enabled.\n\
						Click here to disable banking and gain " + format(Decimal.sub(player.b.speed, player.b.buyables[22]).max(0), 0) + " banked speed." : "disabled.\n\
						Click here to enable banking, which will force a bank reset, and will make your point production slower over time. You will also lose 50% of your points every second. In return, you will start gaining speed if your points generated per second is greater than 1,000 and will be converted into banked speed on banking disable.")
					: (player.b.banking > 0 ? "Please disable the current active banking before you can activate another one." : "You need to build at least 16 banks before you can use this function.")
			},
			unl() { return player["w"].best.gte(13) }, 
			canAfford() { return player[this.layer].best.gte(16) && (player.b.banking == 0 || player.b.banking == 8) },
			buy() { 
				if (player.b.banking == 8) player.b.buyables[22] = player.b.buyables[22].max(player.b.speed)
				player.b.banking = player.b.banking == 8 ? 0 : 8
                doReset(this.layer, true)
			},
		},
		23: {
			title:() => "Acceleration Banking",
			cost(x) {
				return new Decimal(0)
			},
			effect(x) { 
				var eff = player[this.layer].buyables[this.id]
				if (eff.gte(25)) eff = eff.mul(25).sqrt()
				return eff
			},
			display() { 
				let data = tmp.buyables[this.layer][this.id]
				return data.canAfford 
					? "You have " + format(player[this.layer].buyables[this.id], 0) + " banked acceleration, which are accelerating “Speed Banking”'s speed by " + format(data.effect) + " per second.\n\n\
						Banking is currently " + (player.b.banking == 15 ? "enabled.\n\
						Click here to disable banking and gain " + format(Decimal.sub(player.b.speed, player.b.buyables[23]).max(0), 0) + " banked speed." : "disabled.\n\
						Click here to enable banking, which will force a bank reset, and all the previous bankings' debuffs will be activated at once, but your point production is multiplied by 10,000 before all debuffs (except for the “Speed Banking” debuff). You're also gaining speed on this one.")
					: (player.b.banking > 0 ? "Please disable the current active banking before you can activate another one." : "You need to build at least 16 banks before you can use this function.")
			},
			unl() { return player["w"].best.gte(13) }, 
			canAfford() { return player[this.layer].best.gte(16) && (player.b.banking == 0 || player.b.banking == 15) },
			buy() { 
				if (player.b.banking == 15) player.b.buyables[23] = player.b.buyables[23].max(player.b.speed)
				player.b.banking = player.b.banking == 15 ? 0 : 15
                doReset(this.layer, true)
			},
		},
	},
	
	update(diff) {
		if (player.b.banking == 0) player.b.bankTime = new Decimal(0)
		else player.b.bankTime = Decimal.add(player.b.bankTime, diff)
		if (player.b.banking & 8) {
			if (new Decimal(1000).lt(tmp.pointGen)) {
				let delta = player.b.banking == 8 ? new Decimal(1).add(player.b.bankTime.mul(tmp.buyables.b[23].effect)) : new Decimal(1)
				player.b.speed = player.b.speed.add(delta.mul(diff))
				player.points = player.points.mul(Decimal.pow(0.5, diff))
			}
		} else {
			player.b.speed = new Decimal(0)
		}
	},
	
	
	tabFormat: 
		["main-display",
			["prestige-button", function() {return "Build "}],
			["blank", "5px"],
			["display-text",
				function() {return "You have at best " + format(player.b.best, 0) + " " + " banks."}],
			["display-text",
				function() {return player.b.banking > 0 ? ("You have been banking for " + formatTime(player.b.bankTime.toNumber()) + (player.b.banking & 8 ? (", which is reducing your point production by ^" + format(Decimal.pow(player.b.bankTime, 2).add(1).recip(), 5).replace(",", "")) : "") + ".") : ""}],
			["display-text",
				function() {return player.b.banking & 8 ? ("You have " + format(player.b.speed) + " speed.") : ""}],
			["display-text",
				function() {return player.b.banking & 8 ? (new Decimal(1000).lt(tmp.pointGen) ? "You are gaining " + format(player.b.banking == 8 ? new Decimal(1).add(player.b.bankTime.mul(tmp.buyables.b[23].effect)) : new Decimal(1)) + " speed per second." : ("You need " + format(tmp.pointGen) + " / " + format(1000) + " points per second to gain speed.")) : ""}],
			["blank", "5px"],
			"buyables", ["blank", "5px"], "milestones", "upgrades"],
			
	hotkeys: [
		{key: "b", desc: "B: Build banks", onPress(){if (player[this.layer].unl) doReset(this.layer)}},
	],
	
})

// ----- Third row -----
addLayer("w", {
	startData() { return {         
		unl: false,               
		points: new Decimal(0),  
		best: new Decimal(0),
		total: new Decimal(0),
		autoCoinUpgrade: false,
		autoFinderUpgrade: false,
	}},

	layerShown() {return hasUpg("c", 21) || player[this.layer].unl || player.m.unl},   

	color:() => "#FFFFFF",                      
	resource: "workers",           
	row: 2,                                 

	baseResource: "coins",               
	baseAmount() {return player["c"].points},  
    branches: [["c", 1], ["b", 1], ["wf", 1]],

	requires:() => new Decimal(15000),          	
	
	type: "static",   
	base: 15000,                  
	exponent: 1.35,    
	canBuyMax: () => player["w"].best.gte(9) || player["m"].best.gte(1),
	
	effect() {
		var eff = Decimal.pow(player.w.points.add(1), 2)
		if (player["w"].best.gte(13)) eff = eff.pow(3)
		if (player["w"].best.gte(16)) eff = eff.pow(3)
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
			requirementDesc:() => "1 Worker",
			done() {return player[this.layer].best.gte(1)},
			effectDesc:() => "Unlocks a new row of coin upgrades. Also you kickstart your worker resets and below (not coins) with " + format(80) + " coins."
		},
		1: {
			requirementDesc:() => "2 Workers",
			done() {return player[this.layer].best.gte(2)},
			effectDesc:() => "Unlocks an another new row of coin upgrades. Also you kickstart with " + format(250) + " coins."
		},
		2: {
			requirementDesc:() => "3 Workers",
			done() {return player[this.layer].best.gte(3)},
			effectDesc:() => "Unlocks worker upgrades. Scroll down to find them! Also you kickstart with " + format(10000) + " coins.",
		},
		3: {
			requirementDesc:() => "4 Workers",
			done() {return player[this.layer].best.gte(4)},
			effectDesc:() => "Unlocks workfinders and working, where workers can do their work. They are reseted on worker reset.",
		},
		4: {
			requirementDesc:() => "5 Workers",
			done() {return player[this.layer].best.gte(5)},
			effectDesc:() => "Automates buying coin upgrades, but each upgrade bought by the autobuyer will give you " + format(5 * player[this.layer].points.add(1).pow(1.05)) + " unfinished work (based on current worker count).",
            toggles: [["w", "autoCoinUpgrade"]]
		},
		5: {
			requirementDesc:() => "6 Workers",
			done() {return player[this.layer].best.gte(6)},
			effectDesc:() => "Unlocks more worker upgrades, may or may not related to the workfinder layer.",
		},
		6: {
			requirementDesc:() => "7 Workers",
			done() {return player[this.layer].best.gte(7)},
			effectDesc:() => "Unlocks banks, which you can manage bankings and lendings. They are reseted on worker reset too.",
		},
		7: {
			requirementDesc:() => "8 Workers",
			done() {return player[this.layer].best.gte(8)},
			effectDesc:() => "Automates buying workfinder rebuyable upgrades, but each rebuyable upgrade bought by the autobuyer will give you " + format(player[this.layer].points.add(1).mul(600).pow(1.25)) + " unfinished work (based on current worker count).",
            toggles: [["w", "autoFinderUpgrade"]]
		},
		8: {
			requirementDesc:() => "9 Workers",
			done() {return player[this.layer].best.gte(9)},
			effectDesc:() => "Unlocks more worker upgrades. And you can bulk hire workers now. Why didn't I think of this earlier...",
		},
		9: {
			requirementDesc:() => "12 Workers",
			done() {return player[this.layer].best.gte(12)},
			effectDesc:() => "You can bulk build banks.",
		},
		10: {
			requirementDesc:() => "13 Workers",
			done() {return player[this.layer].best.gte(13)},
			effectDesc:() => "Unlocks new banking options. Also the workers' effect gets cubed.",
		},
		11: {
			requirementDesc:() => "16 Workers",
			done() {return player[this.layer].best.gte(16)},
			effectDesc:() => "The workers' effect gets cubed again. Yay!",
		},
		12: {
			requirementDesc:() => "Not available yet",
			done() {return false},
			effectDesc:() => "To be continued...",
		},
	},
	
	upgrades: {
		rows: 2,
		cols: 5,
		11: {
			desc:() => "Raises all of the first three coin layer's “all previous boost upgrades” upgrades based on your best worker count.",
			cost:() => new Decimal(3),
			unl() { return player[this.layer].best.gte(3) },
			effect() {
				let ret = player[this.layer].best.div(20).add(1)
				if (hasUpg(this.layer, 14)) ret = ret.add(player[this.layer].points.div(30))
				return ret.sqrt();
			},
			effectDisplay(fx) { return "^"+format(fx) },
		},
		12: {
			desc:() => "The previous upgrade also affect the first coin layer's boost upgrade but with reduced effect.",
			cost:() => new Decimal(2),
			unl() { return hasUpg(this.layer, 11) },
			effect() {
				let ret = layers.w.upgrades[11].effect().cbrt()
				return ret;
			},
			effectDisplay(fx) { return "^"+format(fx) },
		},
		13: {
			desc:() => "Remember that upgrade that applies something again to the point prodution? Why not keep doing that again, shall we?",
			cost:() => new Decimal(3),
			unl() { return hasUpg(this.layer, 12) },
		},
		14: {
			desc:() => "The current worker count also contibutes to the first upgrade's formula.",
			cost:() => new Decimal(3),
			unl() { return hasUpg(this.layer, 13) },
		},
		15: {
			desc:() => "Unlock more coin upgrades. Yay.",
			cost:() => new Decimal(9),
			unl() { return player["w"].best.gte(9) },
		},
		21: {
			desc:() => "You gain 10% of your current coins gain on coin reset per second.",
			cost:() => new Decimal(6),
			unl() { return hasUpg(this.layer, 14) && player[this.layer].best.gte(6) },
		},
		22: {
			desc:() => "Boosts finished work and unfinished work gain based on current coin count.",
			cost:() => new Decimal(5),
			unl() { return hasUpg(this.layer, 21) },
			effect() {
				let ret = player.c.points.add(1).log10().add(1).sqrt()
				return ret;
			},
			effectDisplay(fx) { return "×"+format(fx) },
		},
		23: {
			desc:() => "Unlocks the ability to bulk hire workfinders.",
			cost:() => new Decimal(6),
			unl() { return hasUpg(this.layer, 22) },
		},
		24: {
			desc:() => "Boosts finished work and unfinished work gain based on current point count.",
			cost:() => new Decimal(6),
			unl() { return hasUpg(this.layer, 23) },
			effect() {
				let ret = player.points.add(1).log10().add(1).cbrt()
				return ret;
			},
			effectDisplay(fx) { return "×"+format(fx) },
		},
		25: {
			desc:() => "The first three banking buffs are stronger based on workers.",
			cost:() => new Decimal(10),
			unl() { return player["w"].best.gte(9) },
			effect() {
				let ret = player.w.points.div(500).add(1).max(1).sqrt()
				return ret;
			},
			effectDisplay(fx) { return "^"+format(fx, 3) },
		},
	},
	
	tabFormat: 
		["main-display",
			["prestige-button", function() {return "Hire "}],
			["blank", "5px"],
			["display-text",
				function() {return "You have at best " + format(player[this.layer].best, 0) + " " + " workers."}],
			["blank", "5px"],
			"milestones", "upgrades"],
			
	hotkeys: [
		{key: "w", desc: "W: Hire workers", onPress(){if (player[this.layer].unl) doReset(this.layer)}},
	],
	
})

// ----- Fifth row -----
addLayer("m", {
	startData() { return {         
		unl: false,               
		points: new Decimal(0),  
		best: new Decimal(0),
		total: new Decimal(0),
	}},

	layerShown() {return hasUpg("wf", 25) || player[this.layer].unl},   

	color:() => "#77FFFF",                      
	resource: "managers",           
	row: 4,                                 

	baseResource: "banks",               
	baseAmount() {return player["b"].points},  
    branches: [["w", 1], ["b", 1]],

	requires:() => new Decimal(20),          	
	
	type: "static",   
	base: 1.1,                  
	exponent: 1.5,    
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
			requirementDesc:() => "1 Manager",
			done() {return player[this.layer].best.gte(1)},
			effectDesc:() => "You can bulk hire workers and workfinders, kickstart with " + format(1000000) + " coins, gain 1000% of your coins gain on coin reset every second, and coin reset no longer reset anything."
		},
	},
	
	tabFormat: 
		["main-display",
			["prestige-button", function() {return "Hire "}],
			["blank", "5px"],
			["display-text",
				function() {return "You have at best " + format(player[this.layer].best, 0) + " " + " managers."}],
			["blank", "5px"],
			"milestones", "upgrades"],
			
	hotkeys: [
		{key: "m", desc: "M: Hire managers", onPress(){if (player[this.layer].unl) doReset(this.layer)}},
	],
	
})
