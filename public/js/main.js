// called by csound.js
function moduleDidLoad() {
    clear_console();
    console.log = print_msg;
    console.warn = print_msg;

    SetAmp();
    SetCf();
    SetReverb(); 
    SetResonatorFreq();
    SetResonatorEnabled();
    SetReverbEnabled();
    attachListeners();
    window.addEventListener("unload", function(e) {
        if (csound != null)
        csound.destroy();
    }, false);
}

// attach callbacks to sliders
function attachListeners() {
    document.getElementById('playButton').addEventListener('click', togglePlay);
    document.getElementById('files').addEventListener('change', handleFileSelect, false);
    document.getElementById("amp").addEventListener("input", SetAmp);
    document.getElementById("cf").addEventListener("input", SetCf);
    document.getElementById("reverb").addEventListener("input", SetReverb);
    document.getElementById("resonatorFreq").addEventListener("input", SetResonatorFreq);
    document.getElementById("resonatorEnabled").addEventListener("input", SetResonatorEnabled);
    document.getElementById("reverbEnabled").addEventListener("input", SetReverbEnabled);
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

// set amplitude
function SetAmp() {
    SetParam('amp', '', 1000., 0.0);
}

// set centre frequency
function SetCf() {
    SetParam('cf', 'Hz', 1., 0.);
}

// set reverb 
function SetReverb() {
    // Value for reverb is in seconds
    SetParam("reverb", "seconds", 1000., 0.);
}

// set the resonating frequency for the string resonator
function SetResonatorFreq() {
    // String resonator based on fundamental frequency
    SetParam("resonatorFreq", "Hz", 1., 0.);
}

// checkbox for string resonator
function SetResonatorEnabled() {
    // enable string resonator based on fundamental frequency
    SetCheckboxParam("resonatorEnabled", "Resonator Enabled");
}

// checkbox for reverberation
function SetReverbEnabled() {
    // enable reverberation in a "natural room"
    SetCheckboxParam("reverbEnabled", "Reverb Enabled");
}

// set checkbox parameter
function SetCheckboxParam(name, label) {
    var val = document.getElementById(name).checked;
    csound.SetChannel(name, val);
    console.log(name + ": " + val);
}

// set parameter
function SetParam(name, label, scal, off) {
    var val = document.getElementById(name).value / scal + off;
    csound.SetChannel(name, val);
    console.log(name + ": " + val + " " + label);
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

function handleFileSelect(evt) {
    if (!loaded) {
        var files = evt.target.files;
        var f = files[0];
        var objectURL = window.URL.createObjectURL(f);
        csound.CopyUrlToLocal(objectURL, "audiofile.wav", function() {
            loaded = true;
            console.log("Ready to play. \n");
        });
    } else {
        csound.UpdateStatus("to load a new file, first refresh page!")
    }
}
