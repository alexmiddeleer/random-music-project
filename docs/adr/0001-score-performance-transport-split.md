# Score, Performance, and Transport Split

We split authored music from playback runtime: a **Composition** contains notation-ready **Scores** in musical time, a compiler derives a **Performance** of scheduled **Musical Actions** in seconds, and a **Transport** owns playback position, play/pause state, and runtime playback rate. This keeps Scores instrument-agnostic for future sheet music while allowing Playback Setup to map each Part to its own runtime Instrument instance, defaulting to piano for the current POC.

The rejected simpler path was storing timed Control actions directly on Composition. That would make Happy Birthday easy to play now, but it would couple authored music to piano Controls and seconds-based timing, creating debt when adding measures, pickup bars, rests, multi-part scores, sheet music rendering, or alternate Instruments.
