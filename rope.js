class Vec2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	static distance_sq(v1, v2) {
		return (v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2;
	}

	static distance(v1, v2) {
		return distance_sq(v1, v2) ** .5;
	}
}

const STANDARD_SIZE = 20;

class Dot {
	constructor(position, radius) {
		this.position = position;
		this.radius = radius;
	}

	static standard_size_dot(position) {
		console.log("dot", position);
		return new Dot(position, STANDARD_SIZE);
	}

	draw(ctx) {
		ctx.fillStyle = "black";

		ctx.beginPath();
		ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
		ctx.fill();
	}
}

const STICK_SCALE = 0.5;

class Rope {
	constructor() {
		this.dots = [];
	}

	add_dot(dot) {
		this.dots.push(dot);
	}

	get_dot(position) {
		let possible_dot = this.dots
			.map(dot => ({
				dot: dot,
				distance: Vec2.distance_sq(dot.position, position)
			}))
			.find(({dot, distance}) => distance <= dot.radius ** 2)

		if(possible_dot !== undefined) return possible_dot.dot;
		return null;
	}

	draw(ctx) {
		this.dots.forEach(dot => dot.draw(ctx));
		for(const {first, second} of pair_elements(this.dots))
			Rope.draw_stick(ctx, first, second);
	}

	static draw_stick(ctx, dot1, dot2) {
		let start = dot1.position;
		let end = dot2.position;
		let width = Math.min(dot1.radius, dot2.radius) * STICK_SCALE;

		ctx.lineWidth = width;
		ctx.beginPath();
		ctx.moveTo(start.x, start.y);
		ctx.lineTo(end.x, end.y);
		ctx.stroke();
	}
}
