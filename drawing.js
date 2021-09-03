class Renderer {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.drawables = [];

		this.start();
	}

	clear() {
		this.ctx.save();

		this.ctx.fillStyle = "white";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.ctx.restore();
	}

	run() {
		this.clear();

		for(const drawable of this.drawables) {
			this.ctx.save();
			drawable.draw(this.ctx);
			this.ctx.restore();
		}
	}

	start() {
		this.interval_id = setInterval(this.run.bind(this), 16);
	}

	stop() {
		clearInterval(this.interval_id);
	}

	add_drawable(drawable) {
		this.drawables.push(drawable);
	}
}
