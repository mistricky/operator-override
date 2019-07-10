# 🏎️ operator-override

It allows JavaScript to support operator override, More elegant override style use decorator. 

Use Typescript, can provide friendly code hints.

## Tip

Dont't worry about what decorator does in output code, because they only exist compile time ⌚️. This mean that you can't use decorators other than those in `decorators.js`,  This greatly reduces side effects. If you want use other decorator, you just need `@babel/plugin-proposal-decorators`🎣.

## Install

Using npm

```
npm i -D babel-plugin-operator-override
```

or using yarn

```
yarn add babel-plugin-operator-override -D
```

## Quick Start

Just add `babel-plugin-operator-override` in your `.babelrc` 

By the way, the `legacy` must be a `true`, because `operator-override` extends `@babel/plugin-syntax-decorators` to support decorator syntax.

```json
{
  "plugins": [
    ["babel-plugin-operator-override", {"legacy": true}]
  ]
}
```

🎉Now you can start using it!

## Usage

`operator-override` use decorator to support operator override

```js
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

console.info(point1 + point2) // Point { x: 3, y: 5 }
console.info(point1 - point2) // Point { x: -1, y: -1 }
```

