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
kreverbEnabled chnget "reverbEnabled"
kcutoffEnabled chnget "cutoffEnabled"


; read audio from disk using diskin2 opcode
a1, a2      diskin2  "track01.wav", kSpeed, iSkip, iLoop

  if kcutoffEnabled == 1 then    ; if the box is ticked then enable effect
    a1          moogvcf   a1, kcf, 0.8  ; emulate the Moog diode ladder filter
    a2          moogvcf   a2, kcf, 0.8
  endif

  if kreverbEnabled == 1 then    ; if the box is ticked then enable effect
    a1          reverb a1, kreverbTime  ; reverberate the input signal with a “natural room” freq response
    a2          reverb a2, kreverbTime
  endif

  if kresonatorEnabled == 1 then    ; if the box is ticked then enable effect
    a1          streson a1, kresonatorFreq, ifdbgain  ; string resonator with variable fundamental freq
    a2          streson a2, kresonatorFreq, ifdbgain
  endif


a1    =     a1 * kamp * 0.15  ; scaling amplitude
a1          clip a1, 0, 0.9   ; fix clipping 
a2    =     a2 * kamp * 0.15  
a2          clip a2, 0, 0.9

krms    rms a1 
        chnset  krms, "rms1"

        outs    a1,a2      ; send audio to outputs
endin

instr 2
kSpeed  init     1     ; playback speed
iSkip   init     0     ; inskip into file (in seconds)
iLoop   init     1     ; looping switch (0=off 1=on)
ifdbgain = 0.90        ; feedback gain (0 and 1) of the internal delay line
a1, a2      diskin2  "track02.wav", kSpeed, iSkip, iLoop
        outs    a1* 0.15,a2* 0.15      ; send audio to outputs
endin

instr 3
kSpeed  init     1     ; playback speed
iSkip   init     0     ; inskip into file (in seconds)
iLoop   init     1     ; looping switch (0=off 1=on)
ifdbgain = 0.90        ; feedback gain (0 and 1) of the internal delay line
a1, a2      diskin2  "track03.wav", kSpeed, iSkip, iLoop
        outs    a1* 0.15,a2* 0.15      ; send audio to outputs
endin

instr 4
kSpeed  init     1     ; playback speed
iSkip   init     0     ; inskip into file (in seconds)
iLoop   init     1     ; looping switch (0=off 1=on)
ifdbgain = 0.90        ; feedback gain (0 and 1) of the internal delay line
a1, a2      diskin2  "track04.wav", kSpeed, iSkip, iLoop
        outs    a1* 0.15,a2* 0.15      ; send audio to outputs
endin

instr 5
kSpeed  init     1     ; playback speed
iSkip   init     0     ; inskip into file (in seconds)
iLoop   init     1     ; looping switch (0=off 1=on)
ifdbgain = 0.90        ; feedback gain (0 and 1) of the internal delay line
a1, a2      diskin2  "track05.wav", kSpeed, iSkip, iLoop
        outs    a1* 0.15,a2* 0.15      ; send audio to outputs
endin

</CsInstruments>

<CsScore>
i1 0 36000;
i2 0 36000;
i3 0 36000;
i4 0 36000;
i5 0 36000;
e
</CsScore>
</CsoundSynthesizer>
