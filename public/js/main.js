// called by csound.js
function moduleDidLoad() {
    clear_console();
    console.log = print_msg;
    console.warn = print_msg;

    attachListeners();
    loadTrack();
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

var playing = false;
var started = false;
var loaded = false;

function togglePlay() {
    console.log("toggle play");
    if (loaded) {
        if (!playing) {
            console.log("playing");
            if (started) csound.Play();
            else {
                CsoundObj.CSOUND_AUDIO_CONTEXT.resume();
                csound.PlayCsd("gmwav.csd");
                started = true;
            }
            document.getElementById('playButton').innerText = "Pause";
            playing = true;
        } else {
            console.log("pausing");
            csound.Pause()
            document.getElementById('playButton').innerText = "Play";
            playing = false;
        }
    }
}

function loadTrack() {
    if (!loaded) {
        console.log("loading file...");
        for (var i=1; i <= 5; i++) {
            csound.CopyUrlToLocal("/audio/track0" + i + ".wav", "track0" + i + ".wav", function() {
                loaded = true;
                console.log("Ready to play. \n");
            });
        }
    } else {
        csound.UpdateStatus("to load a new file, first refresh page!")
    }
}
