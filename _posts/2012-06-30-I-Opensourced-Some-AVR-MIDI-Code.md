---
layout: post
category : development
tags : [development, music]
description : I open-sourced a MIDI to trigger converter for Boss DR-110 drum machine for AVR microcontrollers and a MIDI library.
title: I opensourced two AVR MIDI projects, now on Github
---
{% include JB/setup %}

I just open sourced some MIDI code I wrote awhile ago. 

First was DRMIDI which was a MIDI note -> trigger generator for the DR-110. 

https://github.com/boourns/drmidi 

Second is AVRMIDI which is a more generic MIDI stream parser. You implement a function that receives complete MIDI events and this shim layer will call it. 

It also allows you to register SYSEX strings, and then register a callback function, and when that SYSEX string is sent the callback function is called with the entire SYSEX snippet. 

https://github.com/boourns/AVRMIDI 

I haven't been working on AVR for a bit so I figured.. might as well give this layer away. If you use it let me know!


