class Effect {
    Enabled (isEnabled) {

    }
}

class Track {
    trackNumber;
    amp = 1;
    cf = 8000;
    reverb = 0;
    resonatorFreq = 0;
    feedbackRatio = 0;

    resonatorEnabled = false;
    reverbEnabled = false;
    cutoffEnabled = false;
    feedbackEnabled = false;

    loaded = false;

    constructor(trackNumber) {
        this.trackNumber = trackNumber;
    }

    Load () {
        if (!this.loaded) {
            console.log("loading file...");
            csound.CopyUrlToLocal("/audio/track0" + this.trackNumber + ".wav", "track0" + this.trackNumber + ".wav", () => function() {
                this.loaded = true;
                console.log("Ready to play. \n");
            });
        } else {
            csound.UpdateStatus("to load a new file, first refresh page!")
        }
    }
}

class Mixer {
    tracks = new Array();
    playing = false;
    loaded = false;
    started = false;

    constructor (numberOfTracks) {
        for (var i=1; i<=numberOfTracks; i++)
        {
            this.tracks.push(new Track(i));
        }
    }

    Play () {
        if (this.loaded) {
            if (!this.playing) {
                console.log("playing");
                if (this.started){
                    csound.Play();
                }
                else
                {
                    CsoundObj.CSOUND_AUDIO_CONTEXT.resume();
                    csound.PlayCsd("gmwav.csd");
                    this.started = true;
                }
                this.playing = true;
                return true;
            }
        }
        return false;
    }

    Pause () {
        if (this.loaded) {
            if (this.playing) {
                console.log("pausing");
                csound.Pause()
                this.playing = false;
                return true;
            }
        }
        return false;
    }

    TogglePlay() {
        if (!this.Play()){
            this.Pause();
        }
    }

    LoadTracks() {
        this.tracks.forEach(function (track) {
            track.Load();
        });
        this.loaded = true; // It takes a while to load so this isn't completely accurate.
    }
}


function clear_console() {
    var element = document.getElementById('console');
    element.value = ' ';
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

function initialiseMixer(){
    clear_console();
    console.log = print_msg;
    console.warn = print_msg;

    console.log("calling load tracks");
    mixer.LoadTracks();
    window.addEventListener("unload", function(e) {
        if (csound != null)
        csound.destroy();
    }, false);
}
