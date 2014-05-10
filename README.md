roll20-tor-scripts
==================

Roll20 scripts for helping along with The One Ring RPG.
By Michael Heilemann


tor-dice-checker.js
-------------------

Writes a message in the chat telling the players how many tengwars they rolled,
as well as whether a Gandalf rune or Eye triggered an automatic success, etc.
Helpful for remembering the effects of the TOR dice.


tor-stance.js
-------------

An API command for setting the stance of a token's character. Useful for macros
that want to include automatically calculated TNs (which the dice-checker uses).


tor-highlight-token-on-turn.js
------------------------------

An adapted version of Ryan L's script (https://gist.github.com/rlittlefield/5538171),
which highlights the token of whoever's turn it is.


tor-state-checker.js
--------------------

Checks fatigue against endurance and sets the weary state if needed. Also marks
the character's token with yellow (weary) and red (wounded).

tor-fatigue.js
--------------

A temporary script for automatically adding travel and encumbrance fatigue, for
use with tor-state-checker.js.
