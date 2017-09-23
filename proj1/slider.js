var zTranslationSlider = document.getElementById("zTranslationSliderRange");
var zTranslationOutput = document.getElementById("zTranslationTitle");
modvMatZTranslation = zTranslationSlider.value;
zTranslationOutput.innerHTML = "zTranslation : " + zTranslationSlider.value.toString();

zTranslationSlider.oninput = function() {
	console.log(modvMatZTranslation);
	modvMatZTranslation = this.value;
	main();
	zTranslationOutput.innerHTML = "zTranslation : " + zTranslationSlider.value.toString();

	if (modvMatZTranslation > -3 && modvMatZTranslation <= 0) {
		zTranslationOutput.style.color = "#000";
	} else zTranslationOutput.style.color = "#fff";
}
