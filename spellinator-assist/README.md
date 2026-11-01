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

Offline cache: `djsmarty-one-and-done-v13`.
