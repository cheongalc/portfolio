function update(vertexPos1, vertexPos2) {
	var inputVertex1 = document.getElementById("input_vertexVal_" + vertexPos1.toString());
	var inputVertex2 = document.getElementById("input_vertexVal_" + vertexPos2.toString());

	var vertexPos1val = inputVertex1.value;
	var vertexPos2val = inputVertex2.value;

	manipulatedBufferPos[vertexPos1] = vertexPos1val;
	manipulatedBufferPos[vertexPos2] = vertexPos2val;

	main();

	var output = document.getElementById("valText_" + vertexPos1.toString() + vertexPos2.toString());
	output.innerHTML = "(" + vertexPos1val.toString() + ", " + vertexPos2val.toString() + ")";
}