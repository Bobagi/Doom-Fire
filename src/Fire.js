const firePixel = []
let fireWidth = 40
let fireHeight = 40
const firePalette = [{"r":7,"g":7,"b":7},{"r":31,"g":7,"b":7},{"r":47,"g":15,"b":7},{"r":71,"g":15,"b":7},{"r":87,"g":23,"b":7},{"r":103,"g":31,"b":7},{"r":119,"g":31,"b":7},{"r":143,"g":39,"b":7},{"r":159,"g":47,"b":7},{"r":175,"g":63,"b":7},{"r":191,"g":71,"b":7},{"r":199,"g":71,"b":7},{"r":223,"g":79,"b":7},{"r":223,"g":87,"b":7},{"r":223,"g":87,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":103,"b":15},{"r":207,"g":111,"b":15},{"r":207,"g":119,"b":15},{"r":207,"g":127,"b":15},{"r":207,"g":135,"b":23},{"r":199,"g":135,"b":23},{"r":199,"g":143,"b":23},{"r":199,"g":151,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":167,"b":39},{"r":191,"g":167,"b":39},{"r":191,"g":175,"b":47},{"r":183,"g":175,"b":47},{"r":183,"g":183,"b":47},{"r":183,"g":183,"b":55},{"r":207,"g":207,"b":111},{"r":223,"g":223,"b":159},{"r":239,"g":239,"b":199},{"r":255,"g":255,"b":255}]
let debug = false

function start(){
	fireDataStructure()
	renderFire()
	setInterval(firePropagation,50)
}

function fireDataStructure(){
	const arrayLenght = fireWidth * fireHeight

	for(let i = 0; i < arrayLenght; i++){
		firePixel[i] = 0
	}

	fireSource()
}

function firePropagation(){
	for(let column = 0; column < fireWidth; column++){
		let index = column
		for(let row = 1; row < fireHeight; row++){
			let decay = Math.floor(Math.random() * 3)
			let newIntensity = firePixel[index+fireWidth]-decay
			if(newIntensity>=0) firePixel[index-decay]=newIntensity
			else firePixel[index-decay]=0
			index += fireWidth
		}
	}
	renderFire()
}

function renderFire(){
	let html = '<table cellpadding=0 cellspacing=0>'
	for(let row = 0; row < fireHeight; row++){
		html+='<tr>'

		for(let column = 0; column < fireWidth; column++){
			const pixelIndex = column + (fireWidth * row)
			const color = firePalette[firePixel[pixelIndex]]
			const colorString = `${color.r},${color.g},${color.b}`
			if(debug){
				html+='<td>'
				//indice da celula no canto superior direito
				html+=`<div class="pixel-index">${pixelIndex}</div>`

				//intensidade de fogo no centro da celula
				html+=`<div style="color: rgb(${colorString});">${firePixel[pixelIndex]}</div>`
			}else{	

				html+=`<td class="pixel" style="background-color: rgb(${colorString})">`

			}

			html+='</td>'
		}

		html+='</tr>'
	}

	html+='</table>'

	document.querySelector('#fireCanvas').innerHTML = html
}

function fireSource(){
	const overflowPixel = fireWidth * fireHeight
	for(let pixel = overflowPixel-fireWidth; pixel < overflowPixel ;pixel++){
		firePixel[pixel]=36
	}

}

function debugMode(){
	if(debug){
		debug = false;
		fireWidth = 40
		fireHeight = 40

	}else {
		debug = true;
		fireWidth = 10
		fireHeight = 10
	}

	fireDataStructure()
	renderFire()
}

start()