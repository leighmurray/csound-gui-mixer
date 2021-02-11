<CsoundSynthesizer>
<CsOptions>
-odac ; activate real-time audio output
</CsOptions>
<CsInstruments>
; example written by Iain McCurdy

sr 	= 	44100
ksmps 	= 	32
nchnls 	= 	2

  instr	1 ; play audio from disk
kSpeed  init     1           ; playback speed
iSkip   init     0           ; inskip into file (in seconds)
iLoop   init     0           ; looping switch (0=off 1=on)
kcf chnget "cf"
kamp chnget "amp"
kreverb chnget "reverb"
; read audio from disk using diskin2 opcode
a1, a2      diskin2  "audiofile.wav", kSpeed, iSkip, iLoop
a1          moogvcf   a1, kcf, 0.8
a2          moogvcf   a2, kcf, 0.8
a1          reverb a1, kreverb
a2          reverb a2, kreverb

        out      a1*kamp, a2*kamp          ; send audio to outputs
  endin
</CsInstruments>

<CsScore>
i1 0 36000;
e
</CsScore>
</CsoundSynthesizer>
