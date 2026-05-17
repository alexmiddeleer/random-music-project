# Audio Instrument Context

This context covers browser-playable audio instruments controlled through controls and physical input mappings. The current implementation is a piano, but names should leave room for other instruments.

## Language

**Instrument**:
A playable sound source with interactive controls and a sound implementation.
_Avoid_: Piano-only naming for concepts that must support other instruments.

**Control**:
A playable or editable part of an **Instrument** that can receive musical intent.
_Avoid_: UI element when the concept is not specifically about rendering; Piano Key when the behavior is not piano-specific.

**Note**:
A pitched musical target identified by a name and MIDI number.
_Avoid_: Tone when pitch identity matters.

**Tuning**:
The frequency reference used to convert MIDI numbers into audible pitches.
_Avoid_: Pitch config.

**Input Mapping**:
A mapping from physical input positions to **Controls**.
_Avoid_: Keyboard Map when the mapping may include non-keyboard inputs or non-piano layouts; UI Map when the concept is not visual layout.

**Layout**:
The visual arrangement metadata for **Controls**, such as order, layer, position, size, grouping, or labels needed to render an **Instrument**.

**Voice**:
A sounding instance produced by a **Control**.

**Musical Action**:
A durable instruction to start, stop, or change musical output for a **Control** at a scheduled playback time.
_Avoid_: Keyboard event when the intent may come from a score, recording, or playback.

**Composition**:
A named musical work that may have one or more **Scores**.
_Avoid_: Song when authorship, arrangement, or notation structure matters.

**Score**:
A notation-ready arrangement of a **Composition** using musical time.
_Avoid_: Performance when referring to written musical structure rather than playback events; Control when referring to instrument-agnostic written music.

**Beat**:
A rational unit of musical time used by a **Score**.
_Avoid_: Seconds when referring to notation-ready timing.

**Part**:
A performer-oriented line within a **Score**.
_Avoid_: Track when referring to written music rather than recording or playback machinery.

**Measure**:
A bounded segment of musical time within a **Score**.
_Avoid_: Bar when consistency with notation software terminology matters.

**Performance**:
Scheduled **Musical Actions** derived from a **Score** for playback on an **Instrument**.
_Avoid_: Score when referring to timed playback events rather than notation-ready structure.

**Transport**:
A runtime controller for playback position and play/pause state of a **Performance**.
_Avoid_: Performance when referring to playback controls rather than scheduled musical events.

**Playback Setup**:
The selected runtime inputs used to play a **Score**, such as **Instrument** choice and initial playback rate.
_Avoid_: Score when referring to playback choices rather than authored musical structure.

**Bundled Composition**:
A pre-authored **Composition** included with the instrument experience.
_Avoid_: Pre-made Sheet Music when referring to playable action data rather than visual notation.

**Sheet Music**:
A visual notation of a **Score** for reading.
_Avoid_: Score until the project needs a stricter notation distinction.

## Relationships

- An **Instrument** is the parent module for playable behavior.
- An **Instrument** has one or more child **Controls**.
- A **Control** belongs to exactly one **Instrument**.
- A **Control** may reference one **Note** when it produces pitched sound.
- A **Note** is a reusable music value, not a child module of a **Control**.
- A **Tuning** belongs to an **Instrument** preset or playback context.
- A **Tuning** defines how **Notes** become frequencies for sound output.
- An **Input Mapping** belongs to an **Instrument** preset.
- An **Input Mapping** contains physical input bindings.
- Each physical input binding maps one physical input position to one **Control**.
- A **Layout** belongs to an **Instrument** preset.
- A **Layout** has layout entries for **Controls** as children.
- Each layout entry describes how one **Control** is placed visually.
- Starting a **Control** creates one **Voice**.
- A **Voice** belongs to the **Control** that started it.
- Stopping a **Control** stops the matching active **Voice**.
- A **Musical Action** targets one **Control** at one scheduled playback time.
- A **Musical Action** records playback intent to start, stop, or change one **Control** at a time.
- The **Instrument** applies a **Musical Action** to its target **Control**; the **Control** lifecycle then creates or stops the matching **Voice**.
- A **Composition** is the parent module for a musical work.
- A **Composition** may have one or more child **Scores**.
- A **Score** belongs to exactly one **Composition**.
- A **Score** uses **Beats** for musical time.
- A **Score** has one or more child **Measures**.
- A **Measure** belongs to exactly one **Score**.
- A **Score** has one or more child **Parts**.
- A **Part** belongs to exactly one **Score**.
- A **Part** places musical events within **Measures**.
- A **Score** targets **Notes**, not **Controls**.
- A **Score** does not own runtime **Instrument** selection.
- A **Score** can produce one **Performance** through a **Playback Setup**.
- A **Beat** belongs to **Score** timing, not playback timing.
- A **Performance** has many child **Musical Actions**.
- A **Transport** controls playback of one **Performance** at a time.
- A **Playback Setup** assigns one runtime **Instrument** to each **Part**.
- A **Playback Setup** assigns a distinct runtime **Instrument** instance to each **Part**.
- Multiple **Parts** may use the same instrument type or preset while still having distinct runtime **Instrument** instances.
- A **Playback Setup** defaults each **Part** to the piano **Instrument** when no other assignment is chosen.
- A **Playback Setup** can provide the initial playback rate; the **Transport** owns runtime playback rate changes.
- A **Bundled Composition** is a **Composition** selected by the app rather than authored during the current session.
- **Sheet Music** presents a **Score** visually.

## Module Relationship Example

Piano is the first **Instrument** implementation. User presses physical key `Digit1`. Browser input reads that physical input position and asks the piano **Input Mapping** which **Control** it targets. The **Input Mapping** returns the `C4` piano key **Control**. The **Instrument** starts that **Control**, finds its target **Note**, and creates a **Voice** for it. The sound implementation uses the current **Tuning** to convert the **Note** MIDI number into frequency, then starts the audible **Voice**. Releasing `Digit1` follows the same path back to the `C4` **Control** and stops the matching **Voice**. The piano **Layout** is separate: it says `C4` belongs in the base key row, `C#4` belongs in the raised key layer, and `C#4` should sit between `C4` and `D4`. The **Layout** places **Controls** visually, but it does not decide what physical input means.

A **Musical Action** skips physical input but joins the same flow at the **Control**: a **Performance** says "start the `C4` **Control** at time 0," then the **Instrument**, **Note**, **Tuning**, and **Voice** path is identical to live user input. A **Score** remains notation-ready musical structure; a **Performance** is the playback form derived from it.

## Example Dialogue

> **Dev:** "Should this new input mapping be called a keyboard map?"
> **Domain expert:** "No. It is an **Input Mapping** because future instruments may use pads, strings, or controls that are not piano keys."

## Flagged Ambiguities

- "Piano Key" is the current implementation term for one kind of **Control**, but broader work should use **Control** unless the behavior is piano-specific.
- "UI Element" sounded like a physical input position; resolved: use **Control** for the instrument-side target and **Input Mapping** for physical input positions.
- "Keyboard Map" is ambiguous between visual keyboard layout and physical input mapping; use **Input Mapping** for physical input binding and **Layout** for visual placement.
- "Pre-made sheet music" was used to mean a **Bundled Composition** with a **Score**, not visual **Sheet Music**; use **Bundled Composition** for the included musical work and **Score** for its notation-ready arrangement.
