# DJ Smarty — One and Done 2.0 (Spellinator Level 4)

**Live helper:** https://djsmartyp.github.io/spellinator-assist/

This is a phone-friendly helper for the 60-second Level 4 badge, focused only on **changing letters each round**.

## The three rounds
1. Round 1: find a **4-letter** word from the wall letters.
2. Round 2: new wall letters; find a **5-letter** word without reusing letters already played.
3. Round 3: new wall letters; find a **6-letter** word without repeating any letter from rounds 1 or 2.

A July 2026 player discussion reports that letters change between rounds; new letters can appear. One player's recollection is about **15 available letters, 4 vowels and 11 consonants** (Y counted as a consonant). That quantity has **not** been independently verified for Watford. The assistant doesn't enforce it.

## Fast controls
- The alphabet keypad has **26 fixed positions**. Tapped letters grey out in place; tap again to unselect, or use Undo/Clear.
- Previously played letters can still be tapped if they appear on the current wall, but are orange-marked and excluded from suggested answers.
- The **three strongest suggestions** appear directly below the keypad. They use only the current wall letters and don't repeat letters played earlier.
- Tap a suggestion **only once the game accepts your word**: this records the used letters and advances to the next round automatically.
- If you already played a word, use **Played a word** at the top to record it directly without entering the wall letters.
- Go Back to correct a recorded word. If it changes, later words are cleared.
- Progress is saved on the device.

## Ranking
Rounds 1 and 2 favour familiar candidates that save vowels and preserve potential dictionary words for the next round. Future tiles are unknown, so this is a heuristic, not a guarantee. Round 3 prioritises familiar six-letter words.

## Removed
The speculative **same letters throughout** mode, fixed-letter three-word solver, and their controls have been permanently removed, based on the players' report that the letters change between rounds.

## Limitations
The word list is general English, **not Activate's confirmed accepted-word list**. Suggestions may be rejected. The app doesn't observe game buttons or award badges.

## Finding words the game is more likely to accept (v15)

Word validity matters more than letter-entry speed. The assistant now uses a cross-checked **4–6-letter dictionary plus frequency rankings**, separating curated candidates from lower-confidence extras. It favours recognisable words over unlikely abbreviations, while still considering the need to preserve letters for later rounds.

Each suggestion shows `COMMON`, `DICTIONARY`, `EXTRA`, or `ACCEPTED ✓`:
- **COMMON**: frequent word supported by the curated English dictionary.
- **DICTIONARY**: word supported by the curated dictionary, but less common.
- **EXTRA**: plausible additional word; use only if needed.
- **ACCEPTED ✓**: a word you previously recorded as successfully played in Activate on this phone; it ranks first when letters permit.

If the game rejects a suggestion, press the **✕** beside it. It is hidden in future rounds and attempts. **Restore rejected words** clears the rejection history; this is stored only on your device. Recording an accepted word automatically adds it to your locally learned accepted-word list. These personal observations are not an official Activate dictionary.

### Word data sources and credits
- **12Dicts 5desk**, compiled by Alan Beale, public domain; used as a curated dictionary check. [12Dicts project](https://wordlist.aspell.net/12dicts-readme-r4/).
- **Hermit Dave's FrequencyWords / OpenSubtitles 2018 English frequency data**, source content licensed **CC BY-SA 4.0**, used to rank candidates. [Source and licence](https://github.com/hermitdave/FrequencyWords).
- The word bank is a derived, filtered selection and its frequency-based ordering is attributed to FrequencyWords under CC BY-SA 4.0.

Neither source publishes Activate's accepted-word dictionary. **No candidate is guaranteed to work** until you've played it in the room.

Offline cache: `djsmarty-one-and-done-v15`.
