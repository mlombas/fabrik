function fill_element(canvas) {
	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;
}

function* pair_elements(arr) {
	let first = null;
	let second = arr[0];

	for(let index = 1; index < arr.length; index++) {
		first = second;
		second = arr[index];
		yield {first, second};
	}
}
