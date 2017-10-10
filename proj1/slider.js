
var zTranslationSlider = document.getElementById("zTranslationSliderRange");
var zTranslationOutput = document.getElementById("zTranslationTitle");
modvMatZTranslation = zTranslationSlider.value;
zTranslationOutput.innerHTML = "zTranslation : " + zTranslationSlider.value.toString();

zTranslationSlider.oninput = function() {
	console.log(modvMatZTranslation);
	modvMatZTranslation = this.value;
	main();
	zTranslationOutput.innerHTML = "zTranslation : " + zTranslationSlider.value.toString();
}

var xTranslationSlider = document.getElementById("xTranslationSliderRange");
var xTranslationOutput = document.getElementById("xTranslationTitle");
modvMatXTranslation = xTranslationSlider.value;
xTranslationOutput.innerHTML = "xTranslation : " + xTranslationSlider.value.toString();

xTranslationSlider.oninput = function() {
	console.log(modvMatXTranslation);
	modvMatXTranslation = this.value;
	main();
	xTranslationSlider.min = zTranslationSlider.value;
	xTranslationSlider.max = Math.abs(zTranslationSlider.value);
	xTranslationOutput.innerHTML = "xTranslation : " + (this.value).toString();
}


var yTranslationSlider = document.getElementById("yTranslationSliderRange");
var yTranslationOutput = document.getElementById("yTranslationTitle");
modvMatYTranslation = yTranslationSlider.value;
yTranslationOutput.innerHTML = "yTranslation : " + yTranslationSlider.value.toString();

yTranslationSlider.oninput = function() {
	console.log(modvMatYTranslation);
	modvMatYTranslation = this.value * (window.innerHeight / window.innerWidth);
	main();
	yTranslationSlider.min = zTranslationSlider.value;
	yTranslationSlider.max = Math.abs(zTranslationSlider.value);
	yTranslationOutput.innerHTML = "yTranslation : " + (this.value * (window.innerHeight / window.innerWidth)).toString();
}
