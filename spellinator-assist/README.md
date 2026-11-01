# DJ Smarty — One and Done 2.0
A focused, single-purpose, mobile-friendly assistant for the **Spellinator level 4** badge at Activate.

## URL
https://djsmartyp.github.io/spellinator-assist/

## How it works
1. Start Spellinator level 4 on the real game.
2. At each wave, **enter the actual letters displayed in the room**. Until you do, the helper shows no suggestions.
3. Select the word length requested by the game (if known). Every suggested word is made **only from the letters entered for that wave**.
4. Choose the word you **successfully played**, then press **Next wave**. The helper locks every used letter so it will never suggest that letter again, even if it appears on a later wave.
5. Enter the new letters for wave 2 and wave 3; these are **separate from earlier entries**. Complete wave 3, then verify the badge in Activate.

The tool allows revisiting previous waves, undoing a selection, and restarting an attempt. It remembers this attempt on the phone.

## Strict constraints
- No suggestions when current wave letters are blank.
- A suggested word must use only displayed letters for the **current** wave.
- Each letter can appear **at most once in a word**, and can appear in **at most one word across all waves**.
- If you alter a wave's chosen word, the choices for later waves are cleared.
- An entered custom word must obey the same rules.
- The helper does not read live game data or guarantee a word is accepted by Activate.

## Sources
[Community badge list](https://activate.ryflix.ca/badges.html): One and Done 2.0 — complete Spellinator level 4 without using the same letter more than once. Community notes specify this applies across 3 waves; save vowels for later waves.

Word suggestions come from a general English word-frequency list in `words.js`, not an official Activate word list. No other badge or Free Play functionality is present. The app is unofficial and unaffiliated with Activate.

## Update history
- 2026-11-01: Single-badge rebuild with mandatory per-wave letter banks, strict letter lockout, simpler interface, and offline cache version change.
