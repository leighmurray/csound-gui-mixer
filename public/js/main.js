mixer = new Mixer(5);

// called by csound.js
function moduleDidLoad() {
    attachListeners();
    initialiseMixer();
}

// attach callbacks to sliders
function attachListeners() {
    document.getElementById('playButton').addEventListener('click', togglePlay);
    for (var i=1; i<=5; i++) {
        var sliders = new Array("amp", "cf", "reverb", "resonatorFreq", "feedbackRatio", 
                "decimatorBitDepth", "harmonyEstimFreq");
        var checkboxes = new Array("resonatorEnabled", "reverbEnabled", "cutoffEnabled", 
                "feedbackEnabled", "decimatorEnabled", "harmonyEnabled");
        sliders.forEach(function (sliderName) {
            var slider = document.getElementById(sliderName + i);
            slider.addEventListener("input", SetSliderParam);
            slider.dispatchEvent(new Event("input"));
        });
        checkboxes.forEach(function (checkboxName) {
            var checkbox = document.getElementById(checkboxName + i);
            checkbox.addEventListener("input", SetCheckboxParam);
            checkbox.dispatchEvent(new Event("input"));
        });
    }
}

// set checkbox parameter
function SetCheckboxParam() {
    csound.SetChannel(this.id, this.checked);
    console.log(this.id + ": " + this.checked);
}

// set parameter
function SetSliderParam() {
    console.log("name: " + this.id);
    var scaledValue = this.value / this.dataset.scale;
    csound.SetChannel(this.id, scaledValue);
    console.log(this.id + ": " + scaledValue);
}

function togglePlay() {
    console.log("toggle play");
    if (mixer.playing) {
        if (mixer.Pause()) {
            document.getElementById('playButton').innerText = "Play";
        }
    } else {
        if (mixer.Play()) {
            document.getElementById('playButton').innerText = "Pause";
        }
    }
}
