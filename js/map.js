
var mapX = 108
var mapY = 90
var mapFocusX = -1
var mapFocusY = -1

function updateMapCanvas () {
	var mapc = document.getElementById("mapbox")
	var mapctx = mapc.getContext("2d")
	
	if (player.world === undefined) player.world = {}
	if (player.world.map === undefined) player.world.map = createMap()
	
    mapctx.fillStyle = "rgb(0, 0, 0)"
	mapctx.fillRect(0, 0, mapc.width, mapc.height)
	
    mapctx.fillStyle = "rgb(255, 255, 255)"
	var width = Math.floor(500 / 16)
	var height = Math.floor(450 / 25)
	for (var x = 0; x < width; x++) for (var y = 0; y < height; y++) {
		mapctx.font = "bold 26px 'Lucida Console'"
		var glyph = "░"
		var id = player.world.map[y+Math.floor(mapY)].charCodeAt(x+Math.floor(mapX))
		var type = id & 15
		     if (type === 0) { mapctx.fillStyle = "rgb(0, 0, 255)"; }
		else if (type === 1) { mapctx.fillStyle = "rgb(127, 255, 0)"; }
		else if (type === 2) { mapctx.fillStyle = "rgb(255, 127, 0)"; }
		else if (type === 3) { mapctx.fillStyle = "rgb(255, 255, 255)"; }
		else if (type === 4) { mapctx.fillStyle = "rgb(255, 255, 0)"; }
		else if (type === 5) { mapctx.fillStyle = "rgb(255, 255, 255)";}
		else if (type === 6) { mapctx.fillStyle = "rgb(0, 255, 0)"; }
		else if (type === 7) { mapctx.fillStyle = "rgb(255, 255, 127)"; }
		else if (type === 8) { mapctx.fillStyle = "rgb(0, 127, 0)"; }
		else if (type === 9) { mapctx.fillStyle = "rgb(127, 127, 255)"; }
		if (isConquerable(x+Math.floor(mapX), y+Math.floor(mapY))) { glyph = "▒" }
		if (player.world.conquering && player.world.conquerX == x+Math.floor(mapX) && player.world.conquerY == y+Math.floor(mapY)) { 
			glyph = ["░", "▒", "▓", "█", "▓", "▒", "░", " "][Math.floor(Date.now() / 100) % 8]
		}
		if (id & 16) { mapctx.font = "bold 26px 'Lucida Console'"; glyph = "█" }
		if (x + Math.floor(mapX) == mapFocusX && y + Math.floor(mapY) == mapFocusY) { if (Date.now() % 1000 > 500) mapctx.fillStyle = "rgb(255, 255, 255)"; glyph = Date.now() % 500 > 250 ? "¤" : glyph }
		mapctx.fillText(glyph, 1 + x * 16, 22 + y * 25)
	}
	mapctx.fillStyle = "rgb(255, 255, 255)";
	mapctx.fillRect((Math.floor(mapX) / 250) * 498, 453, (width / 250) * 498, 2);
	mapctx.fillRect(498, (Math.floor(mapY) / 200) * 453, 2, (height / 200) * 453);
}

function createMap () {
	let noise = []
	for (var a = 0; a < 250; a++) {
		noise[a] = []
		for (var b = 0; b < 300; b++) noise[a][b] = Math.random()
	}

	function smoothStep(x) {
		if (x < 0) return 0
		if (x > 1) return 1
		return x * x * (3 - 2 * x)
	}
	
	function lerp(x, y, z) {
		return x + (y - x) * z
	}
	
	function getNoise(x, y) {
		let fx = Math.floor(x); let fy = Math.floor(y)
		let dx = x - fx; let dy = y - fy
		let x1 = lerp(noise[fx][fy], noise[fx+1][fy], smoothStep(dx))
		let x2 = lerp(noise[fx][fy+1], noise[fx+1][fy+1], smoothStep(dx))
		return lerp(x1, x2, smoothStep(dy))
	}

	let map = []
	for (var a = 0; a < 200; a++) {
		map[a] = ""
		for (var b = 0; b < 250; b++) {
			var level = (getNoise(a / 10 + 50, b / 10 + 50) + getNoise(a / 5 + 30, b / 5 + 30) * 0.5 + getNoise(a / 2 + 10, b / 2 + 10) * 0.25 + getNoise(a, b) * 0.125) / 1.875
			var temp = getNoise(-a / 15 + 150, -b / 15 + 150)
			var moist = 1 - getNoise(a / 10 + 50, b / 10 + 50)
			var chr = 64                            // Waters
			if (temp < .15) chr = 73                // Iced Waters
			if (level > Math.min((Math.abs(a - 100) + Math.abs(b - 125)) / 40, .4)) {
				if (temp > .85) {
					if (moist > .5) chr = 72        // Rainforest
					else if (moist > .3) chr = 71   // Savanna
					else chr = 68                   // Desert
				}            
				else if (temp > .15) {
					if (moist > .8) chr = 70        // Forest
					else chr = 65                   // Grasslands
				}
				else chr = 69                       // Tundra
			}
			if (level > 0.75) {
				chr = 66                            // Mountains
			}
			if (level > 0.875) {
				chr = 67                            // Tall Mountains
			}
			if (([98, 99].includes(a) && [122, 123, 124, 125].includes(b)) || ([97, 98, 99, 100].includes(a) && [123, 124].includes(b))) chr += 16
			map[a] += String.fromCharCode(chr)
		}
	}

	return map
}

function getMapDifficulty (x, y) {
	var dist = (x - 123.5) * (x - 123.5) + (y - 98.5) * (y - 98.5)
	
	if (dist > 4000) dist = dist * Math.pow(10, dist / 4000 - 1)
	if (dist > 2000) dist = (dist * dist) / 2000
	if (dist > 500) dist = (dist * dist) / 500
	if (dist > 60) dist = (dist * dist) / 60
	
	var typeDiff = [1000, 1, 5, 10, 2, 3, 2, 1.5, 2.5, 10000]
	return Decimal.pow(dist, 1.65).mul(Decimal.log(dist + 2, 2)).mul(5).mul(typeDiff[getTileType(x, y)])
}

function getMapEncounterChance (x, y) {
	var dist = (x - 123.5) * (x - 123.5) + (y - 98.5) * (y - 98.5)
	
	if (dist > 3000) dist = dist * Math.pow(10, dist / 3000 - 1)
	if (dist > 1500) dist = (dist * dist) / 1500
	if (dist > 500) dist = (dist * dist) / 500
	if (dist > 80) dist = (dist * dist) / 80
	
	var typeChance = [0.005, 1, 0.7, 0.4, 0.2, 0.2, 0.3, 0.3, 0.2, 0.0002]
	if (dist < 10) return new Decimal(0)
	return Decimal.log(dist / 10, 10).div(100).mul(typeChance[getTileType(x, y)])
}

function getMapEncounter (x, y) {
	var dist = (x - 123.5) * (x - 123.5) + (y - 98.5) * (y - 98.5)
	var ent = {}
	
	// Max name length = 28
	var names = [
		["Ship of Neighboring Country", "A Cthulhu", "A Shiver of Sharks"],
		["Army of Neighboring Country", "A Sloth of Bears"],
		["Army of Neighboring Country"],
		["Army of Neighboring Country"],
		["Army of Neighboring Country"],
		["Army of Neighboring Country"],
		["Army of Neighboring Country"],
		["Army of Neighboring Country"],
		["Army of Neighboring Country"],
	]
	
	var id = getTileType(x, y);
	
	ent.name = names[id][Math.floor(Math.random() * names[id].length)]
	ent.maxhealth = Decimal.pow(dist, 2)
	ent.health = ent.maxhealth
	ent.power = Decimal.pow(dist, 1.6)
	ent.elo = Decimal.add(1000, Decimal.pow(dist, 1.4))
	return ent
}

function getNewElo (x, y) {
	
	x = new Decimal(x)
	y = new Decimal(y)
	
	function getProbability (a, b) {
		return Decimal.pow(10, a.sub(b).div(400)).add(1).recip()
	}
	
	let px = getProbability(y, x)
	
	let mag = new Decimal(30)
	
	return x.add(mag.mul(Decimal.sub(1, px)))
}

function getTileType(x, y) {
	return player.world.map[y].charCodeAt(x) & 15
}

function isConquered(x, y) {
	return player.world.map && player.world.map[y] && !!(player.world.map[y].charCodeAt(x) & 16)
}

function setCharAt(str,index,chr) {
	if(index > str.length-1) return str;
	return str.substr(0,index) + chr + str.substr(index+1);
}

function setConquered(x, y) {
	if (!isConquered(x, y))
		player.world.map[y] = setCharAt(player.world.map[y], x, String.fromCharCode(player.world.map[y].charCodeAt(x) + 16))
}

function isConquerable(x, y) {
	return isConquered(x+1, y) || isConquered(x-1, y) || isConquered(x, y+1) || isConquered(x, y-1)
}

function initConquering(x, y) {
	if (!isConquered(x, y) && isConquerable(x, y)) {
		player.world.conquerX = x
		player.world.conquerY = y
		player.world.conquering = true
		player.world.conquerTarget = mapFocusDesc 
		player.world.conquerProgress = new Decimal(0)
		player.world.conquerGoal = getMapDifficulty(x, y)
		player.world.encounterChance = getMapEncounterChance(x, y)
	}
}
function doneConquering() {
	if (player.world.conquering) {
		player.world.conquering = false
		player.world.encounter = undefined
		player.t.lands = Decimal.add(player.t.lands, 1)
		player.m.landsAvailable[getTileType(player.world.conquerX, player.world.conquerY)]++
		setConquered(player.world.conquerX, player.world.conquerY)
	}
}
function abortConquering() {
	if (player.world.conquering) {
		player.world.conquering = false
		player.world.encounter = undefined
	}
}

var mapMouse = false
var mapMouseX = 0
var mapMouseY = 0
function onMapMouseDown (e) {
	mapMouse = true
	mapMouseX = e.clientX
	mapMouseY = e.clientY
	
	var oldX = mapFocusX; var oldY = mapFocusY
	mapFocusX = parseInt((e.clientX - $("#mapbox").offset().left - 2) / 16 + Math.floor(mapX))
	mapFocusY = parseInt((e.clientY - $("#mapbox").offset().top) / 25 + Math.floor(mapY))
	if (oldX === mapFocusX && oldY === mapFocusY) {
		if (player.world.conquering && player.world.conquerX === mapFocusX && player.world.conquerY === mapFocusY)
			abortConquering()
		else
			initConquering(mapFocusX, mapFocusY)
	}
	
	var id = player.world.map[mapFocusY].charCodeAt(mapFocusX)
	var type = id & 15
	mapFocusDesc = ["Waters", "Grasslands", "Mountains", "Tall Mountains", "Desert", "Tundra", "Forest", "Savanna", "Rainforest", "Iced Waters"][type]
	if (id & 16) mapFocusDesc += ", Conquered"
}

function onMapMouseMove (e) {
	if (mapMouse) {
		mapX = Math.max(0, Math.min(219, mapX + (mapMouseX - e.clientX) / 16))
		mapY = Math.max(0, Math.min(182, mapY + (mapMouseY - e.clientY) / 24))
		mapMouseX = e.clientX
		mapMouseY = e.clientY
	}
}
function onMapMouseUp (e) {
	mapMouse = false
}