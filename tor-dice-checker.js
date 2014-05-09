/*
    The One Ring Dice Checker for Roll20.
    By Michael Heilemann (michael.heilemann@me.com)

    This is an API script for Roll20.net, which checks rolls against the success
    criteria of the The One Ring system, and is best used in conjunction with
    the custom dice roll tables (https://wiki.roll20.net/The_One_Ring).

    Basically it will try to output a valuable message about the roll's success,
    and works best of supplied with a Target Number, like so:

        /roll 1d12 + 3d6 > 14

    Or as would be the case if TOR roll tables are set up properly:

        /roll 1t[feat] + 3t[normal] > 14

    Or for the enemy:

        /roll 1t[lm-feat] + 3t[normal] > 14

    It know about Gandalf's Rune, and the great lidless eye, wreathed in flame,
    and counts them as success and failure respectively (based on whether you
    use the feat or lm-feat tables to roll from).
 */
on('chat:message', function(e) {
    if (e.type === 'rollresult') {
        var content = JSON.parse(e.content);
        var rolls = content.rolls;
        var tn = false;
        var automatic = false;
        var tengwars = 0;
        var featResult;

       log('dice rolled');
       log(content);

        rolls.forEach(function(roll) {
            // detect Target Number
            if (roll.type === 'C') {
                var text = roll.text.replace(/\s/g, ''); // remove whitespace

                if (text.charAt(0) === '>') {
                    tn = parseInt(text.split('>')[1], 10);
                }
            }

            // loop through dice results
            if (roll.type === 'R') {
                if (roll.sides === 12) {
                    featResult = roll.results[0].v;
                    automatic = (roll.table === 'lm-feat' && roll.results[0].tableidx === 10 ? true : automatic); // eye
                    automatic = (roll.table === 'feat' && roll.results[0].tableidx === 11 ? true : automatic); // gandalf
                }

                if (roll.sides === 6) {
                    // check for tengwars
                    roll.results.forEach(function(result) {
                        tengwars = (result.v === 6 ? tengwars + 1 : tengwars);
                    }, this);
                }
            }
        }, this);

        // gandalf rune for feat table, or eye for lm-feat table
        if (automatic) {
            if (tengwars === 0) {
                sendChat("player|"+e.playerid, "/desc Automatic success!");
            } else  if (tengwars === 1) {
                sendChat("player|"+e.playerid, "/desc Automatic great success!");
            } else if (tengwars > 1) {
                sendChat("player|"+e.playerid, "/desc Automatic extraordinary success!");
            }

        // a hit
        } else if (tn !== false && content.total >= tn) {
            if (tengwars === 0) {
                sendChat("player|"+e.playerid, "/desc A success!");
            } else  if (tengwars === 1) {
                sendChat("player|"+e.playerid, "/desc A Great Success!");
            } else if (tengwars > 1) {
                sendChat("player|"+e.playerid, "/desc An Extraordinary Success!");
            }

        // a miss
        } else if (tn !== false && content.total < tn) {
            sendChat("player|"+e.playerid, "/desc A miss.");

        } else {
            if (tengwars === 1) {
                sendChat("player|"+e.playerid, "/desc One tengwar.");
            } else if (tengwars === 2) {
                sendChat("player|"+e.playerid, "/desc Two tengwars.");
            } else if (tengwars > 2) {
                sendChat("player|"+e.playerid, "/desc Whole lotta tengwars.");
            }

        }
    }
});