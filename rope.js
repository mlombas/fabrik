class Vec2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	add(v2) {
		return new Vec2(this.x + v2.x, this.y + v2.y);
	}

	substract(v2) {
		return this.add(v2.scale(-1));
	}

	scale(s) {
		return new Vec2(this.x * s, this.y * s);
	}

	normalized() {
		return this.scale(1/this.length());
	}

	length() {
		return (this.x**2 + this.y**2)**.5;
	}

	static distance_sq(v1, v2) {
		return (v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2;
	}

	static distance(v1, v2) {
		return Vec2.distance_sq(v1, v2) ** .5;
	}

	static clone(v) {
		return new Vec2(v.x, v.y);
	}
}

const STANDARD_SIZE = 20;

class Dot {
	constructor(position, radius) {
		this.position = position;
		this.radius = radius;
	}

	static standard_size_dot(position) {
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
const MAX_FABRIK_ITERATIONS = 3;
const FABRIK_TOLERANCE = 1e-8;

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

	//Algorithm from
	//FABRIK: A fast, iterative solver for the Inverse Kinematics problem
	//https://www.researchgate.net/publication/220632147_FABRIK_A_fast_iterative_solver_for_the_Inverse_Kinematics_problem
	fabrik(end) {
		let d = 
			Array.from(pair_elements(
				this.dots.map(d => d.position)
			))
			.map(({first, second}) => Vec2.distance(first, second));
		let b = Vec2.clone(this.dots[0].position);

		let n_iter = 0;
		while(
			n_iter++ < MAX_FABRIK_ITERATIONS &&
			Vec2.distance_sq(this.dots.at(-1).position, end) > FABRIK_TOLERANCE ** 2
		) {
			this._forward(end, d);
			this._backward(b, d);
		}
	}

	_forward(end, d) {
		this.dots[this.dots.length - 1].position = end;

		for(let i = this.dots.length - 2; i >= 0; i--) 
			this.dots[i].position = this._move_vec_along_line(
				this.dots[i].position,
				this.dots[i + 1].position,
				d[i]
			);
	}

	_backward(start, d) {
		this.dots[0].position = start;

		for(let i = 1; i < this.dots.length; i++) 
			this.dots[i].position = this._move_vec_along_line(
				this.dots[i].position,
				this.dots[i - 1].position,
				d[i - 1]
			);
	}

	_move_vec_along_line(to_move, fixed, distance) {
		let unit_vector = to_move.substract(fixed).normalized();
		let vector = unit_vector.scale(distance);
		return fixed.add(vector);
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
