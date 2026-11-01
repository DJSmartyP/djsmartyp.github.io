# DJ Smarty — One and Done 2.0 (Spellinator Level 4)

**Play:** https://djsmartyp.github.io/spellinator-assist/

A single-screen, mobile-first helper for the One and Done 2.0 badge. Built for a **60-second three-round attempt**, not a lengthy word game.

## Fast path

1. Round 1: **4-letter word**. Round 2: **5-letter word**. Round 3: **6-letter word**.
2. Tap the letters you can see on the wall using the **fixed alphabetical keypad**. Every key stays in exactly the same place. Tapped keys grey out but remain visible; tap again to undo.
3. The **three best candidates** appear right beneath the keypad and update instantly. Tap a suggestion **after the physical game accepts it**, and the helper records the word and advances automatically.
4. When you've already played a word, tap **✓ Played a word** at the top, enter the word, and tap **Save & Next →** to advance without entering the letter bank.
5. If a previously played letter reappears on the wall, you can still tap it into the wall-letter bank. The key has an orange mark, and **the letter is excluded from any suggested word**. No letter can appear twice across the three successfully played words.

The app remembers the attempt, lets you go back and correct an earlier answer (which invalidates later answers if the word changes), and has an obvious Restart action.

## Optimisation

- Early-round rankings combine **low vowel consumption**, **familiarity**, and the proportion of common future 5- or 6-letter dictionary words left possible after those letters are used.
- Round 3 prioritises familiar 6-letter words that obey the no-reuse rule.
- Rankings are calculated once per round and prior-letter set, then **filtered cheaply per key tap** for speed.
- Some obvious profanity, abbreviations and proper names are excluded from the suggestion list.
- Future wall letters may change: rankings are **heuristics, not predictions**.

## Limitations

The dictionary is general-purpose and may include words Activate does not accept. This helper cannot read the game's wall automatically, detect a winning round, or award a badge. The 60-second time constraint includes entering letters and running to the physical buttons; **success is not guaranteed**.

Built as an unofficial static GitHub Pages website. Offline cache version `djsmarty-one-and-done-v10`.
