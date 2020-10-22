
var mapX = 93
var mapY = 80
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
	var width = Math.floor(500 / 8)
	var height = Math.floor(450 / 12)
	for (var x = 0; x < width; x++) for (var y = 0; y < height; y++) {
		mapctx.font = "bold 12px 'Lucida Console'"
		var glyph = "░"
		var id = player.world.map[y+Math.floor(mapY)].charCodeAt(x+Math.floor(mapX))
		var type = id & 15
		     if (type === 0) { mapctx.fillStyle = "rgb(0, 0, 255)"; }
		else if (type === 1) { mapctx.fillStyle = "rgb(127, 255, 0)"; }
		else if (type === 2) { mapctx.fillStyle = "rgb(255, 127, 0)"; }
		else if (type === 3) { mapctx.fillStyle = "rgb(255, 255, 255)"; }
		else if (type === 4) { mapctx.fillStyle = "rgb(255, 255, 0)"; }
		else if (type === 5) { mapctx.fillStyle = "rgb(255, 255, 255)";}
		else if (type === 6) { mapctx.fillStyle = "rgb(127, 255, 0)"; }
		else if (type === 7) { mapctx.fillStyle = "rgb(255, 255, 127)"; }
		else if (type === 8) { mapctx.fillStyle = "rgb(0, 255, 0)"; }
		else if (type === 9) { mapctx.fillStyle = "rgb(127, 127, 255)"; }
		if (isConquerable(x+Math.floor(mapX), y+Math.floor(mapY))) { glyph = "▒" }
		if (player.world.conquering && player.world.conquerX == x+Math.floor(mapX) && player.world.conquerY == y+Math.floor(mapY)) { 
			glyph = ["░", "▒", "▓", "█", "▓", "▒", "░", " "][Math.floor(Date.now() / 100) % 8]
		}
		if (id & 16) { mapctx.font = "bold 12px 'Lucida Console'"; glyph = "█" }
		if (x + Math.floor(mapX) == mapFocusX && y + Math.floor(mapY) == mapFocusY) { if (Date.now() % 1000 > 500) mapctx.fillStyle = "rgb(255, 255, 255)"; glyph = Date.now() % 500 > 250 ? "¤" : glyph }
		mapctx.fillText(glyph, 1 + x * 8, 10 + y * 12)
	}
	mapctx.fillStyle = "rgb(255, 255, 255)";
	mapctx.fillRect((Math.floor(mapX) / 250) * 498, 447, (width / 250) * 498, 2);
	mapctx.fillRect(498, (Math.floor(mapY) / 200) * 447, 2, (height / 200) * 447);
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
					if (moist > .9) chr = 70        // Forest
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
	var typeDiff = [1000, 1, 5, 10, 2, 3, 2, 1.5, 2.5, 10000]
	return Decimal.pow(dist, 1.65).mul(Decimal.log(dist + 2, 2)).mul(5).mul(typeDiff[getTileType(x, y)])
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
	}
}
function doneConquering() {
	if (player.world.conquering) {
		player.world.conquering = false
		player.t.lands = Decimal.add(player.t.lands, 1)
		setConquered(player.world.conquerX, player.world.conquerY)
	}
}
function abortConquering() {
	if (player.world.conquering) {
		player.world.conquering = false
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
	mapFocusX = parseInt((e.clientX - $("#mapbox").offset().left - 2) / 8 + Math.floor(mapX))
	mapFocusY = parseInt((e.clientY - $("#mapbox").offset().top) / 12 + Math.floor(mapY))
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
		mapX = Math.max(0, Math.min(188, mapX + (mapMouseX - e.clientX) / 8))
		mapY = Math.max(0, Math.min(163, mapY + (mapMouseY - e.clientY) / 12))
		mapMouseX = e.clientX
		mapMouseY = e.clientY
	}
}
function onMapMouseUp (e) {
	mapMouse = false
}