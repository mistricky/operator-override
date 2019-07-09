const {Add, Sub} = require("../dist/decorators.js")

class Point {
	constructor(x, y){
		this.x = x
		this.y = y
	}

	@Add
  	addPoint({x, y}){
    	return new Point(this.x + x, this.y + y)
	}
	
	@Sub
	subPoint({x, y}){
		return new Point(this.x - x, this.y - y)
	}
}

let point1 = new Point(1, 2)
let point2 = new Point(2, 3)

console.info(point1 + point2)
console.info(point1 - point2)