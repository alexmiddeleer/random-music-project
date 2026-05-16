# Audio Instrument Context

This context covers browser-playable audio instruments controlled through visual elements and physical input mappings. The current implementation is a piano, but names should leave room for other instruments.

## Language

**Instrument**:
A playable sound source with interactive controls and a sound implementation.
_Avoid_: Piano-only naming for concepts that must support other instruments.

**Instrument UI Element**:
A visible playable control that represents one user-triggerable sound or musical action.
_Avoid_: Piano Key when the concept does not require piano-specific behavior.

**Note**:
A pitched musical target identified by a name and MIDI number.
_Avoid_: Tone when pitch identity matters.

**Tuning**:
The frequency reference used to convert MIDI numbers into audible pitches.
_Avoid_: Pitch config.

**Instrument UI Map**:
A mapping from physical input positions to **Instrument UI Elements**.
_Avoid_: Keyboard Map when the mapping may include non-keyboard inputs or non-piano layouts.

**Voice**:
An active sounding instance produced by an **Instrument UI Element**.
_Avoid_: Oscillator when discussing domain behavior rather than Web Audio implementation details.

## Relationships

- An **Instrument** has one or more **Instrument UI Elements**.
- An **Instrument UI Element** may target one **Note**.
- A **Tuning** defines how a **Note** becomes a frequency.
- An **Instrument UI Map** connects physical input positions to **Instrument UI Elements**.
- Pressing an **Instrument UI Element** starts a **Voice**.
- Releasing an **Instrument UI Element** stops a **Voice**.

## Example Dialogue

> **Dev:** "Should this new input mapping be called a keyboard map?"
> **Domain expert:** "No. It is an **Instrument UI Map** because future instruments may use pads, strings, or controls that are not piano keys."

## Flagged Ambiguities

- "Piano Key" is the current implementation term, but broader work should use **Instrument UI Element** unless the behavior is piano-specific.
- "Keyboard Map" is ambiguous between visual keyboard layout and physical input mapping; use **Instrument UI Map** for input mapping.
