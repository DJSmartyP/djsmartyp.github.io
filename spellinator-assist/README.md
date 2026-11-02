# DJ Smarty — One and Done 2.0 (Spellinator Level 4)

**Live helper:** https://djsmartyp.github.io/spellinator-assist/

This is a phone-friendly helper for the 60-second Level 4 badge, focused only on **changing letters each round**.

## The three rounds
1. Round 1: find a **4-letter** word from the wall letters.
2. Round 2: new wall letters; find a **5-letter** word without reusing letters already played.
3. Round 3: new wall letters; find a **6-letter** word without repeating any letter from rounds 1 or 2.

A July 2026 player discussion reports that letters change between rounds; new letters can appear. One player's recollection is about **15 available letters, 4 vowels and 11 consonants** (Y counted as a consonant). That quantity has **not** been independently verified for Watford. The assistant doesn't enforce it.

## Letter selection and badge rule (v19)

The physical wall presents a **fresh randomised set of different letters in each round**. There are **no duplicate letters within one round**, but the same letter can reappear on the wall in later rounds.

From the July 2026 Discord discussion:
- A player **believed** the selection comprised **4 vowels and 11 consonants**, counting Y as a consonant: **15 distinct letters**. This estimate was not confirmed by another player and should not be treated as a fixed rule.
- Another player stated that the wall **changes between rounds**, so new letters can appear.
- The badge requires **no repeated letters across the three played words**; it does not require playing every displayed letter.

The assistant keeps each round's wall separate. It tracks the letters used in successful words for the entire three-round attempt, including when a used letter reappears on a new wall.

The A–Z keyboard **does not move**. Tap each wall letter once to select it; **tap again to deselect**, instead of creating a duplicate. The large counter shows the number of **unique letters entered** plus the vowels, consonants and letters still usable for the badge. The reported 4+11 selection mix is shown only as a note and **never enforced**. Press **ENTER — SHOW WORDS** whenever you've entered the full wall.

Previous v18 saves containing accidental duplicate wall entries are automatically normalised on load, preserving recorded words and progress.

## The two-screen flow (v19)

This is now designed around **word selection**, not fast letter entry. Each round has two large, separate screens:

**1. Enter the wall letters**
- Tap each visible letter **once** on the fixed A–Z keyboard. Keys remain fixed and grey out; tap a selected letter again to deselect it. You can also tap an entered letter chip or use Undo to correct a mistake.
- The app **never advances automatically based on letter count**. A large live counter shows how many distinct wall letters you've entered.
- When you've entered all the wall letters, press **ENTER — SHOW WORDS**. There is no assumed wall-letter total; the button is available once you've entered enough **unused distinct letters** for the current round's word.
- A previously used letter can still be entered if shown on the current wall, but cannot appear in a recommended word.

**2. Find a word (larger text)**
- Show **10 large word candidates** initially in rounds 1 and 2, prioritising familiarity and future word flexibility. Press **More options** for 10 more.
- In round 3, **show every matching 6-letter candidate** in the list, sorted by confidence (scroll if necessary).
- Tap **✓ USED** only after the game accepts that word, to lock its letters and move straight to the next round's blank alphabet.
- If Activate rejects a word, tap the separate **✕** on its row to hide it from all later suggestions (and future attempts on this device).
- **← Edit letters** takes you back to the alphabet without resetting the current attempt.
- **✓ Played a word** at the top remains a direct alternative: type an accepted word and advance without entering the wall letters.

The app remembers your current round and the screen you reached. It can also return to prior rounds for corrections. Replacing an earlier recorded word clears all later words to keep letter lockouts correct.

## Badge-specific opening strategy (v20)

**JYNX is included and ranked first in Round 1 whenever J, Y, N and X are available**, unless this user has marked it rejected.

- Community One and Done 2.0 badge guide: [Activate Badge Tracker](https://activate.ryflix.ca/badges.html). Its specific advice is: conserve vowels until the final wave; **JYNX is a good word to start with if possible**.
- JYNX (a wryneck bird / a spell) is valid in UK/international Scrabble reference lists but not in US TWL. The original US-oriented/frequency-filtered dictionary omitted it. [UK word reference](https://wordfinderpro.com/dictionary/jynx).
- **Crucial limitation:** Neither source proves that Activate's own word dictionary accepts JYNX. It is labelled **BADGE GUIDE TIP**, not **ACCEPTED ✓**, until recorded as actually accepted on this device. If the room rejects it, tap ✕ to hide it from future suggestions.
- Round 1 ranking now strongly favours leaving A/E/I/O/U available, shedding difficult consonants and preserving potential five- **and six-letter** words. Round 2 considers remaining six-letter possibilities; Round 3 prioritises word familiarity and shows all matches.
- These are **heuristics**, because the next round's wall is random and we don't know Activate's accepted-word list. There is no reliable way to guarantee the best three-word path.

## Ranking
Round 1 conserves vowels, favours less-useful consonants and measures how many familiar five- and six-letter options remain. Round 2 emphasises preserving six-letter options. Word familiarity still matters: obscure theoretical choices may not be accepted by Activate. The later wall letters are unknown, so this is not a guaranteed success model. Round 3 prioritises familiar six-letter words.

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

Offline cache: `djsmarty-one-and-done-v20`.
