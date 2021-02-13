mixer = new Mixer(5);

// called by csound.js
function moduleDidLoad() {
    clear_console();
    console.log = print_msg;
    console.warn = print_msg;

    attachListeners();
    //loadTrack();
    console.log("calling load tracks");
    mixer.LoadTracks();
    window.addEventListener("unload", function(e) {
        if (csound != null)
        csound.destroy();
    }, false);
}

// attach callbacks to sliders
function attachListeners() {
    document.getElementById('playButton').addEventListener('click', togglePlay);
    for (var i=1; i<=5; i++) {
        var sliders = new Array("amp", "cf", "reverb", "resonatorFreq", "feedbackRatio");
        var checkboxes = new Array("resonatorEnabled", "reverbEnabled", "cutoffEnabled", "feedbackEnabled");
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

function print_msg(message) {
    var element = document.getElementById('console');
    element.value += (message + "\n");
    element.scrollTop = 99999; // focus on bottom
    count += 1;
    if (count == 1000) {
        clear_console();
        count = 0;
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

function clear_console() {
    var element = document.getElementById('console');
    element.value = ' ';
}

var count = 0;

function handleMessage(message) {
    var element = document.getElementById('console');
    element.value += message;
    count += 1;
    if (count == 1000) {
        element.value = ' ';
        count = 0;
    }
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
