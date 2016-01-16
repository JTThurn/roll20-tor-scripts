/*
    The One Ring Dice Checker for Roll20.
    By Michael Heilemann (michael.heilemann@me.com)
	Updated by uhu79
	
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
	
	It also checks if your are using 'speaking as' and displays the name accordingly.
 */
on('chat:message', function(e) {
    if (e.type === 'rollresult') {
        var content = JSON.parse(e.content);
        var rolls = content.rolls;
        var tn = false;
        var automatic = false;
        var tengwars = 0;
        var featResult;

    // determine who triggered the roll, player or character
    var characters = findObjs({_type: 'character'});
    var speaking;
    characters.forEach(function(chr) { if(chr.get('name') == e.who) speaking = chr; });
    
	//	 log output to console
    //   log('dice rolled');
    //   log(content);

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
                if(speaking) sendChat('character|'+speaking.id, '/desc rolls an automatic success!');
                else sendChat('player|'+e.playerid, '/desc rolls an automatic success!');
            } else  if (tengwars === 1) {
                if(speaking) sendChat('character|'+speaking.id, '/desc rolls an automatic great success!');
                else sendChat('player|'+e.playerid, '/desc rolls an automatic great success!');
            } else if (tengwars > 1) {
                if(speaking) sendChat('character|'+speaking.id, '/desc rolls an automatic extraordinary success!');
                else sendChat('player|'+e.playerid, '/desc rolls an automatic extraordinary success!');
            }

        // a hit
        } else if (tn !== false && content.total >= tn) {
            if (tengwars === 0) {
                if(speaking) sendChat('character|'+speaking.id, '/desc rolls a success!');
                else sendChat('player|'+e.playerid, '/desc rolls a success!');
            } else  if (tengwars === 1) {
                if(speaking) sendChat('character|'+speaking.id, '/desc rolls a great success!');
                else sendChat('player|'+e.playerid, '/desc rolls a great success!');
            } else if (tengwars > 1) {
                if(speaking) sendChat('character|'+speaking.id, '/desc rolls an extraordinary success!');
                else sendChat('player|'+e.playerid, '/desc rolls an extraordinary success!');
            }

        // a miss
        } else if (tn !== false && content.total < tn) {
            if(speaking) sendChat('character|'+speaking.id, '/desc misses.');
            else sendChat('player|'+e.playerid, '/desc misses.');

        } else {
            if (tengwars === 1) {
                if(speaking) sendChat('character|'+speaking.id, '/desc rolls a tengwar.');
                else sendChat('player|'+e.playerid, '/desc rolls a tengwar.');
            } else if (tengwars === 2) {
                if(speaking) sendChat('character|'+speaking.id, '/desc rolls two tengwars!');
                else sendChat('player|'+e.playerid, '/desc rolls two tengwars!');
            } else if (tengwars > 2) {
                if(speaking) sendChat('character|'+speaking.id, '/desc rolls whole lotta tengwars!');
                else sendChat('player|'+e.playerid, '/desc rolls whole lotta tengwars!');
            }

        }
    }
});
