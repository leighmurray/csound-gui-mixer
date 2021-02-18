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

ilastInstNumber = 5 ;number of called instances

loop:

instr 1, 2, 3, 4, 5
indx = p1

kSpeed  init     1     ; playback speed
iSkip   init     0     ; inskip into file (in seconds)
iLoop   init     1     ; looping switch (0=off 1=on)
ifdbgain = 0.90        ; feedback gain (0 and 1) of the internal delay line

ScutoffFrequencyChannel sprintf "cf%i", indx
kcf chnget ScutoffFrequencyChannel

SampChannel sprintf "amp%i", indx
kamp chnget SampChannel

SreverbChannel sprintf "reverb%i", indx
kreverbTime chnget SreverbChannel

SresonatorFreqChannel sprintf "resonatorFreq%i", indx
kresonatorFreq chnget SresonatorFreqChannel

SfeedbackRatio sprintf "feedbackRatio%i", indx
kfeedbackRatio chnget SfeedbackRatio

SresonatorEnabled sprintf "resonatorEnabled%i", indx
kresonatorEnabled chnget SresonatorEnabled

SreverbEnabled sprintf "reverbEnabled%i", indx
kreverbEnabled chnget SreverbEnabled

ScutoffEnabled sprintf "cutoffEnabled%i", indx
kcutoffEnabled chnget ScutoffEnabled

SfeedbackEnabled sprintf "feedbackEnabled%i", indx
kfeedbackEnabled chnget SfeedbackEnabled

; read audio from disk using diskin2 opcode
StrackName sprintf "track0%i.wav", indx

a1, a2      diskin2  StrackName, kSpeed, iSkip, iLoop

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

  if kfeedbackEnabled == 1 then    ; if the box is ticked then enable effect
  ; create a delay buffer with a feedback ratio (user controlled)
    ;ifeedback   =        0.7                    ; feedback ratio
    abufferOut1 delayr   0.1                    ; read audio from end of buffer
    abufferOut2 delayr   0.1
        delayw   a1 + (abufferOut1*kfeedbackRatio) ; write audio into buffer (mix in feedback signal)
        delayw   a2 + (abufferOut2*kfeedbackRatio)
    a1 = a1 + (abufferOut1*0.4)
    a2 = a2 + (abufferOut2*0.4)
  endif

a1    =     a1 * kamp * 0.15  ; scaling amplitude
a1          clip a1, 0, 0.9   ; fix clipping
a2    =     a2 * kamp * 0.15
a2          clip a2, 0, 0.9

krms    rms a1
SoutputRmsVar sprintf "rms%i", indx
        chnset  krms, SoutputRmsVar

        outs    a1,a2      ; send audio to outputs
endin

</CsInstruments>

<CsScore>
i 1 0 36000;
i 2 0 36000;
i 3 0 36000;
i 4 0 36000;
i 5 0 36000;
e
</CsScore>
</CsoundSynthesizer>
