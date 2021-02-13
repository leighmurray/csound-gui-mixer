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

    LoadTracks() {
        this.tracks.forEach(function (track) {
            track.Load();
        });
        this.loaded = true; // It takes a while to load so this isn't completely accurate.
    }
}
