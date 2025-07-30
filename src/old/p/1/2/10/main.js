var cubeRotation = 0.0; // amount to rotate cube in RADIANS

main();

function main() {
	const canvas = document.getElementById("glCanvas");
	const gl = canvas.getContext("webgl");

	if (!gl) {
		alert("Unable to init WebGL");
		return ;
	}

	//vertexShader program
	const vsSource = `
		attribute vec4 aVertexPosition;
		attribute vec4 aVertexColor;

		uniform mat4 uWorldMatrix;
		uniform mat4 uProjectionMatrix;

		varying lowp vec4 vColor;

		void main(void) {
			gl_Position = uProjectionMatrix * uWorldMatrix * aVertexPosition;
			vColor = aVertexColor;
		}
	`;

	//fragmentShader program
	const fsSource = `
		varying lowp vec4 vColor;

		void main(void) {
			gl_FragColor = vColor;
		}
	`;

	const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

	const programInfo = {
		program : shaderProgram,
		attribLocations : {
			vertexPosition : gl.getAttribLocation(shaderProgram, "aVertexPosition"),
			vertexColor : gl.getAttribLocation(shaderProgram, "aVertexColor"),
		},
		uniformLocations : {
			projectionMatrix : gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
			worldMatrix : gl.getUniformLocation(shaderProgram, "uWorldMatrix"),
		},
	};

	const buffers = initBuffers(gl);

	var then = 0;
	function render(now) {
		now *= 0.001;
		const deltaTime = now - then; // delta time is the time elapsed between 2 frame updates
		then = now;

		drawScene(gl, programInfo, buffers, deltaTime);

		requestAnimationFrame(render);
	}

	requestAnimationFrame(render);
}

function initShaderProgram(gl, vsSource, fsSource) {
	const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
	const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
	    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
	    return null;
	}

	return shaderProgram;
}

function loadShader(gl, type, source) {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
	    gl.deleteShader(shader);
	    return null;
	}

	return shader;
}

function initBuffers(gl) {

	// buffer for positions of cube

	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	const positions = [
		//front face
		-1.0, -1.0, 1.0,	// top left v 		0
		1.0, -1.0, 1.0,		// top right v 		1
		1.0, -1.0, -1.0,	// bot right v 		2
		-1.0, -1.0, -1.0,	// bot left v 		3

		//left face
		-1.0, 1.0, 1.0,		// top left v 		4
		-1.0, -1.0, 1.0,	// top right v 		5
		-1.0, -1.0, -1.0,	// bot right v 		6
		-1.0, 1.0, -1.0,	// bot left v 		7

		//back face
		1.0, 1.0, 1.0,		// top left v 		8
		-1.0, 1.0, 1.0,		// top right v 		9
		-1.0, 1.0, -1.0,	// bot right v  	10
		1.0, 1.0, -1.0,		// bot left v 		11

		//right face
		1.0, -1.0, 1.0,		// top left v 		12
		1.0, 1.0, 1.0,		// top right v 		13
		1.0, 1.0, -1.0,		// bot right v 		14
		1.0, -1.0, -1.0,	// bot left v 		15

		//top face
		-1.0, 1.0, 1.0,		// top left v 		16
		1.0, 1.0, 1.0,		// top right v 		17
		1.0, -1.0, 1.0,		// bot right v 		18
		-1.0, -1.0, 1.0,	// bot left v 		19

		//bottom face
		-1.0, 1.0, -1.0,	// top left v 		20
		1.0, 1.0, -1.0,		// top right v 		21
		1.0, -1.0, -1.0,	// bot right v 		22
		-1.0, -1.0, -1.0,	// bot left v 		23
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

	// buffer for colors of cube

	const colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	const faceColors = [
		[1.0, 1.0, 1.0, 1.0], // front face is white
		[0.9, 0.9, 0.9, 1.0], // left face is red
		[0.8, 0.8, 0.8, 1.0], // back face is green
		[0.7, 0.7, 0.7, 1.0], // right face is blue
		[0.6, 0.6, 0.6, 1.0], // top face is yellow
		[0.5, 0.5, 0.5, 1.0]  // bottom face is purple
	];
	var colors = [];
	for (j = 0; j < faceColors.length; j++) {
		const c = faceColors[j];
		colors = colors.concat(c, c, c, c);
	}
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

	// buffer for indices of cube

	const indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	const indices = [
		0, 1, 2,		0, 2, 3,	// front
		4, 5, 6,		4, 6, 7,	// left
		8, 9, 10,		8, 10, 11,	// back
		12, 13, 14, 	12, 14, 15,	// right
		16, 17, 18, 	16, 18, 19,	// top
		20, 21, 22,		20, 22, 23	// bottom
	];
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

	return {
		position : positionBuffer,
		color : colorBuffer,
		indices : indexBuffer,
	};	
}

function drawScene(gl, programInfo, buffers, deltaTime) {
	gl.clearColor(0.4, 0.4, 0.4, 1.0);		// set everything to black & 100% opaque
	gl.clearDepth(1.0);
	gl.enable(gl.DEPTH_TEST);				// allows for comparisons between the depths (z value) of different vertexes
	gl.depthFunc(gl.LEQUAL);				// sets depth function to obscure far things in favor of near things
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 

	const fov = toRadians(45);				// field of view is 45 degrees (gl only accepts radians);
	const aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;
	const zNear = 0.1;
	const zFar = 100;

	const projectionMatrix = mat4.create();
	mat4.perspective(projectionMatrix, fov, aspectRatio, zNear, zFar);

	const worldMatrix = mat4.create();
	mat4.translate(worldMatrix, worldMatrix, [0.0, 0.0, -5.0]); // translate to X:0, Y:0, Z:-5
	mat4.rotate(worldMatrix, worldMatrix, cubeRotation * 1, [0, 0, 1]); // rotate about z axis
	mat4.rotate(worldMatrix, worldMatrix, cubeRotation * -1, [1, 0, 0]); // rotate about x axis
	mat4.rotate(worldMatrix, worldMatrix, cubeRotation, [0, 1, 0]);

	// pull value from pos buffer to aVertexPosition
	{
		const numComponents = 3, // x, y, z
			type = gl.FLOAT,
			normalize = false,
			stride = 0,
			offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
		gl.vertexAttribPointer(
			programInfo.attribLocations.vertexPosition,
			numComponents,
			type,
			normalize,
			stride,
			offset);
		gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
	}
	// pull value from color buffer to aVertexColor
	{
		const numComponents = 4, //r, g, b, a
			type = gl.FLOAT,
			normalize = false,
			stride = 0,
			offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
		gl.vertexAttribPointer(
			programInfo.attribLocations.vertexColor,
			numComponents,
			type,
			normalize,
			stride,
			offset);
		gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
	}

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
	gl.useProgram(programInfo.program);

	gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
	gl.uniformMatrix4fv(programInfo.uniformLocations.worldMatrix, false, worldMatrix);

	{
		const vertexCount = 36; // length of indices array
		const type = gl.UNSIGNED_SHORT;
		const offset = 0;
		gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
	}

	cubeRotation += deltaTime;

}

function toRadians(n) {
	return n * Math.PI / 180;
}