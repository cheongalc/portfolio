var bufferColors = [
	1.0,  1.0,  1.0,  1.0,    // white
    1.0,  0.0,  0.0,  1.0,    // red
    0.0,  1.0,  0.0,  1.0,    // green
    0.0,  0.0,  1.0,  1.0,    // blue
];

main();

function main() {
	const canvas = document.getElementById("glCanvas");

	canvas.style.width = canvas.width = window.innerWidth;
	canvas.style.height = canvas.height = window.innerHeight;

	const gl = canvas.getContext("webgl");

	if (!gl) {
		alert("Unable to init WebGL, your browser might not support it.");
		return ;
	}

	// Vertex Shader Program

	const vsSource = `
		attribute vec4 aVertexPosition;
		attribute vec4 aVertexColor;

		uniform mat4 uModelViewMatrix;
		uniform mat4 uProjectionMatrix;

		varying lowp vec4 vColor;

		void main(void) {
			gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
			vColor = aVertexColor;
		}
	`;

	// Fragment Shader Program

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
			modelViewMatrix : gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
		},
	};

	const buffers = initBuffers(gl);
	drawScene(gl, programInfo, buffers);
}

function initShaderProgram(gl, vsSource, fsSource) {
	const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
	const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	// If creating shader program failed

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert('Unable to initialize shader program! ' + gl.getProgramInfoLog(shaderProgram));
		return null;
	}

	return shaderProgram;
}

function loadShader(gl, type, source) {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert("Error occurred while loading shader " + type.toString() + ": " + gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}

	return shader;
}

function initBuffers(gl) {
	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	const positions = [
		 1.0,  1.0,
	    -1.0,  1.0,
	     1.0, -1.0,
	    -1.0, -1.0,
	];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

	
	const colorBuffer =	gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

	// rgba()
	var colors = bufferColors;

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

	return {
		position : positionBuffer,
		colors : colorBuffer,
	};
}

function drawScene(gl, programInfo, buffers) {
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clearDepth(1.0);	
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	const fov = radians(45);
	const aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;
	const zNearLimit = 0.1;
	const zFarLimit = 100.0;

	const projectionMatrix = mat4.create();
	mat4.perspective(projectionMatrix,
					 fov,
					 aspectRatio,
					 zNearLimit,
					 zFarLimit);

	// model view matrix = world matrix
	const modelViewMatrix = mat4.create();

	mat4.translate(modelViewMatrix,
				   modelViewMatrix,
				   [0.0, 0.0, -5.0]); // [x, y, z]

	{
		const numComponents = 2; 	// pull 2 uniforms from shader program per iteration
		const type = gl.FLOAT;		// data in buffer bit is WebGL floats, i.e. Float32
		const normalize = false;	// don't normalize
		const stride = 0;			// how many bytes to get from one set of values to the next, 0 = use type and numComponents above
		const offset = 0;			// offset how many bytes in the position & color buffers to start from, 0 = start from beginning index
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position); // bind pos buffer
		gl.vertexAttribPointer(
			programInfo.attribLocations.vertexPosition,
			numComponents,
			type,
			normalize,
			stride,
			offset);
		gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
	}

	{
	    const numComponents = 4;
	    const type = gl.FLOAT;
	    const normalize = false;
	    const stride = 0;
	    const offset = 0;
	    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.colors);
	    gl.vertexAttribPointer(
	        programInfo.attribLocations.vertexColor,
	        numComponents,
	        type,
	        normalize,
	        stride,
	        offset);
	    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
	}

	gl.useProgram(programInfo.program);

	gl.uniformMatrix4fv(
		programInfo.uniformLocations.projectionMatrix,
		false,
		projectionMatrix);
	gl.uniformMatrix4fv(
		programInfo.uniformLocations.modelViewMatrix,
		false,
		modelViewMatrix);

	{
		const offset = 0;
		const vertexCount = 4;
		gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
	}
}

function radians(n) {
	return n * Math.PI / 180;
}