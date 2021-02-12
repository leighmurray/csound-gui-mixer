<CsoundSynthesizer>
<CsOptions>
-odac ; activate real-time audio output
</CsOptions>
<CsInstruments>
; example written by Iain McCurdy

sr 	= 	44100
ksmps 	= 	32
nchnls 	= 	2
0dbfs   =   1   ; the amplitude range is 0/1

instr	1         ; play audio from disk
kSpeed  init     1     ; playback speed
iSkip   init     0     ; inskip into file (in seconds)
iLoop   init     1     ; looping switch (0=off 1=on)
ifdbgain = 0.90        ; feedback gain (0 and 1) of the internal delay line

kcf chnget "cf"
kamp chnget "amp"
kreverbTime chnget "reverb"
kresonatorFreq chnget "resonatorFreq"
kresonatorEnabled chnget "resonatorEnabled"


; read audio from disk using diskin2 opcode
a1, a2      diskin2  "audiofile.wav", kSpeed, iSkip, iLoop

a1          moogvcf   a1, kcf, 0.8  ; cutoff frequency
a2          moogvcf   a2, kcf, 0.8

a1          reverb a1, kreverbTime  ; reverb effect
a2          reverb a2, kreverbTime

  if kresonatorEnabled == 1 then
    ; if the box is ticked we have the resonator effect
    a1          streson a1, kresonatorFreq, ifdbgain  ; string resonator effect
    a2          streson a2, kresonatorFreq, ifdbgain
  endif


a1    =     a1 * kamp * 0.15  ; scaling amplitude
a1          clip a1, 0, 0.9   ; clipping 
a2    =     a2 * kamp * 0.15  
a2          clip a2, 0, 0.9

krms    rms a1 
        chnset  krms, "rms1"

        outs    a1,a2      ; send audio to outputs
  endin
</CsInstruments>

<CsScore>
i1 0 36000;
e
</CsScore>
</CsoundSynthesizer>
