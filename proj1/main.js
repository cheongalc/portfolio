main();


function main() {
	const canvas = document.getElementById("glCanvas");
	const gl = canvas.getContext("webgl");
	if (!gl) {
		// if webGL is not working
		alert("Unable to init WebGL");
		return ;
	}
	//set clear color to black / fully opaque
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	//Define shaders
	const vsSource = `
		attribute vec4 aVertexPosition;

		uniform mat4 uModelViewMatrix;
		uniform mat4 uProjectionMatrix;

		void main() {
			gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
		}
	`;

	const fsSource = `
		void main() {
			gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
		}
	`;

	//Usage of shader program
	const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
	/* 	attrib --> get value from buffer
		next iteration of vertex shader --> get next value from attrib's buffer
		uniform --> global var, remains constant
	*/
	const programInfo = {
		program : shaderProgram,
		attribLocations : {
			vertexPosition : gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
		},
		uniformLocations : {
			projMat : gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
			modvMat : gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
		},
	};

	const buffers = initBuffers(gl);

	drawScene(gl, programInfo, buffers);
}

function initShaderProgram(gl, vsSource, fsSource) {
	const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
	const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

	//Create shader program
	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	//Alert if creating shader program failed
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert('Unable to init shader program: ' + gl.getProgramInfoLog(shaderProgram));
		return null;
	}
	return shaderProgram;
}

function loadShader(gl, type, source) {
	//Create a shader with given type and source, then compile it.
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	//Check if compilation successful
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert('Error occurred while compiling shader: ' + gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}
	return shader;
}

function initBuffers(gl) {
	//buffer for sq pos
	const sqPosBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, sqPosBuffer);

	const bufferPos = [
		1.0,  1.0,
	   -1.0,  1.0,
	    1.0, -1.0,
	   -1.0, -1.0,
	];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferPos), gl.STATIC_DRAW);

	return {
		position : sqPosBuffer,
	};
}

function drawScene(gl, programInfo, buffers) {
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clearDepth(1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL); // near things obscure far things

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	const fov = 45 * (Math.PI / 180); // 45 radians field of view
	const aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;
	const zNear = 0.1;
	const zFar = 100.0; // sets bounds of z coords to draw
	const projMat = mat4.create(); // create 4D matrix acting as projection matrix

	//glMatrix always has first argument as the destination to receive resulting matrix
	mat4.perspective(projMat, fov, aspectRatio, zNear, zFar);

	const modvMat = mat4.create();

	// .translate(destination, matrix to translate, amount to translate)
	mat4.translate(modvMat, modvMat, [-0.0, 0.0, -6.0]); // X=-0.0, Y=0.0, Z=-6.0

	{
		const numComponents = 2; // pull out 2 values per iteration
		const type = gl.FLOAT;	 // buffer data is Float32
		const normalize = false;
		const stride = 0;
		const offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
		gl.vertexAttribPointer(
			programInfo.attribLocations.vertexPosition,
			numComponents,
			type,
			normalize,
			stride,
			offset
		);
		gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
	}

	gl.useProgram(programInfo.program);

	gl.uniformMatrix4fv(
		programInfo.uniformLocations.projMat,
		false,
		projMat);
	gl.uniformMatrix4fv(
		programInfo.uniformLocations.modvMat,
		false,
		modvMat);

	{
		const offset = 0;
		const vertexCount = 4;
		gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
	}
}