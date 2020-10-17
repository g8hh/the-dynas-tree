/*
	Biome Chart:
	
	Ocean           | @
	Fields          | A
	Mountains       | B
	High Mountains  | C
*/

var worldMap;
var mapX = 94
var mapY = 80
var mapFocusX = -1
var mapFocusY = -1

function updateMapCanvas () {
	var mapc = document.getElementById("mapbox")
	var mapctx = mapc.getContext("2d")
	
	if (worldMap === undefined) worldMap = createMap()
	
	mapctx.clearRect(0, 0, mapc.width, mapc.height)
    mapctx.fillStyle = "rgb(255, 255, 255)"
	var width = Math.floor(500 / 8)
	var height = Math.floor(450 / 12)
	for (var x = 0; x < width; x++) for (var y = 0; y < height; y++) {
		mapctx.font = "12px 'Lucida Console'"
		var glyph = "░"
		var id = worldMap[y+Math.floor(mapY)].charCodeAt(x+Math.floor(mapX))
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
		if (id & 16) { mapctx.font = "bold 10px 'Lucida Console'"; glyph = "█" }
		if (x + Math.floor(mapX) == mapFocusX && y + Math.floor(mapY) == mapFocusY) { mapctx.fillStyle = "rgb(255, 255, 255)"; glyph = Date.now() % 1000 > 500 ? "¤" : glyph }
		mapctx.fillText(glyph, 1 + x * 8, 10 + y * 12)
	}
	mapctx.fillStyle = "rgb(0, 255, 0)";
	mapctx.rect((mapX / 250) * 498, 448, (width / 250) * 498, 2); mapctx.fill()
	mapctx.rect(498, (mapY / 200) * 448, 2, (height / 200) * 448); mapctx.fill()
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
			var moist = getNoise(-a / 5 + 200, -b / 5 + 200)
			var chr = 64                            // Waters
			if (level > Math.min((Math.abs(a - 100) + Math.abs(b - 100)) / 40, .4)) {
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
			if ([98, 99].includes(a) && [148, 149].includes(b)) chr += 16
			map[a] += String.fromCharCode(chr)
		}
	}

	return map
}

var mapMouse = false
var mapMouseX = 0
var mapMouseY = 0
function onMapMouseDown (e) {
	mapMouse = true
	mapMouseX = e.clientX
	mapMouseY = e.clientY
	
	mapFocusX = parseInt((e.clientX - $("#mapbox").offset().left) / 8 + Math.floor(mapX))
	mapFocusY = parseInt((e.clientY - $("#mapbox").offset().top) / 12 + Math.floor(mapY))
	
	var id = worldMap[mapFocusX].charCodeAt(mapFocusY)
	var type = id & 15
	if (type === 0) mapFocusDesc = "Waters"
	else if (type === 1) mapFocusDesc = "Fields"
	else if (type === 2) mapFocusDesc = "Mountains"
	else if (type === 3) mapFocusDesc = "Tall Mountains"
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