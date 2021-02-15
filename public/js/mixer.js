class Effect {
    name;
    param;
    min = 0;
    max = 1;
    defaultValue = 0;
    enabled = false;
    trackNumber;

    constructor (trackNumber, name, param, min, max, defaultValue, enabled = false)
    {
        this.trackNumber = trackNumber;
        this.name = name;
        this.param = param;
        this.min = min;
        this.max = max;
        this.defaultValue = defaultValue;
        this.value;
        this.enabled = enabled;
    }

    SetEnabled (isEnabled) {
        if (isEnabled != this.enabled) {
            var channelName = this.name + "Enabled" + this.trackNumber;
            console.log("Enabling - " + channelName + ": " + isEnabled);
            csound.SetChannel(channelName, isEnabled);
            this.enabled = isEnabled;
        }
    }

    SetParam (value) {
        if (this.value != value) {
            var channelName = this.param + this.trackNumber;
            //console.log("Param - " + channelName + ": " + value);
            csound.SetChannel(channelName, value);
            this.value = value;
        }
    }

    RemapAndSetParam(value, low, high) {
        var mappedValue = this.min + (this.max - this.min) * (value - low) / (high - low);
        this.SetParam(mappedValue);
    }
}

class Track {
    trackNumber;
    amp = 1;
    effects = new Array();

    loaded = false;

    constructor(trackNumber) {
        this.trackNumber = trackNumber;
        this.effects.push(new Effect(this.trackNumber, 'cutoff', 'cf', 100, 8000, 8000, false));
        this.effects.push(new Effect(this.trackNumber, 'reverb', 'reverb', 0, 5, 0, false));
        this.effects.push(new Effect(this.trackNumber, 'resonator', 'resonatorFreq', 20, 1000, 20, false));
        this.effects.push(new Effect(this.trackNumber, 'feedback', 'feedbackRatio', 0, 0.9, 0.7, false));
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

    SetEffectValue(trackNumber, mixerEffect, value) {
        var channelName = mixerEffect + trackNumber;
        //console.log(channelName + ": " + value);
        csound.SetChannel(channelName, value);
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
