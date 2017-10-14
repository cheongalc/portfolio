function update(pos1, pos2, pos3, pos4) {
	var inputVertex1 = document.getElementById("input_vertexVal_" + pos1.toString());
	var inputVertex2 = document.getElementById("input_vertexVal_" + pos2.toString());
	var inputVertex3 = document.getElementById("input_vertexVal_" + pos3.toString());
	var inputVertex4 = document.getElementById("input_vertexVal_" + pos4.toString());

	var outputVertex = document.getElementById("valText_" + pos1 + pos2 + pos3 + pos4);

	pos1 = parseInt(pos1.toString(16), 16);
	pos2 = parseInt(pos2.toString(16), 16);
	pos3 = parseInt(pos3.toString(16), 16);
	pos4 = parseInt(pos4.toString(16), 16);

	var val1 = inputVertex1.value / 255;
	var val2 = inputVertex2.value / 255;
	var val3 = inputVertex3.value / 255;
	var val4 = inputVertex4.value / 255;

	bufferColors[pos1] = val1;
	bufferColors[pos2] = val2;
	bufferColors[pos3] = val3;
	bufferColors[pos4] = val4;

	outputVertex.innerHTML = "rgba(" + val1.toFixed(2).toString() + ", " + val2.toFixed(2).toString() + ", " + val3.toFixed(2).toString() + ", "+ val4.toFixed(2).toString() + ")";
	main();

}