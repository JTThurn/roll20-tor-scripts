/*
    The One Ring State Checker for Roll20.
    By Michael Heilemann (michael.heilemann@me.com)

    # Weary

    Checks to see if a character's endurance drops below her fatigue, and
    automatically sets the `weary` attribute to `weary` or `normal`, depending.
    This is very useful particularly if you're using the TOR roll tables, as you
    can then read the weary attribute of the selected token in a macro and roll
    on the appropriate success die table automatically:

        /r 1t[feat] + @{travel}t[@{weary}]

    It requires that the character have `endurance`, `total_fatigue` and `weary`
    attributes.

    # Wounded / Treated Wound

    Sets a red marker on the tokens of wounded/treated wound characters, mostly
    to serve as a reminder.

    # More Information

    Works great with the The One Ring character sheet for Roll20.

    For more of my The One Ring shenanigans:
    https://ringen.squarespace.com/loremasters-journal/
 */
on('ready', function() {
    var characters = findObjs({
        _type: 'character'
    });

    characters.forEach(checkWeary, this);
});

on('change:attribute', function(obj, prev) {
    var characterid = obj.get('_characterid');
    var character = getObj("character", characterid);

    checkWeary(character);
});

var checkWeary = function (character) {
    var characterid = character.get('_id');
    var fatigue = findObjs({
        _characterid: characterid,
        _type: 'attribute',
        name: 'total_fatigue'
    })[0];
    var endurance = findObjs({
        _characterid: characterid,
        _type: 'attribute',
        name: 'endurance'
    })[0];
    var weary = findObjs({
        _characterid: characterid,
        _type: 'attribute',
        name: 'weary'
    })[0];
    var wounded = findObjs({
        _characterid: characterid,
        _type: 'attribute',
        name: 'wounded'
    })[0];
    var wound_treated = findObjs({
        _characterid: characterid,
        _type: 'attribute',
        name: 'wound_treated'
    })[0];
    var tokens = findObjs({
        _type: 'graphic',
        represents: characterid
    });

    // WEARY

    if (fatigue && endurance && weary) {
        if (endurance.get('current') < fatigue.get('current')) {
            weary.set('current', 'weary');
            tokens.forEach(function(token) {
                token.set('status_yellow', '');
            }, this);

        } else {
            weary.set('current', 'normal');
            tokens.forEach(function(token) {
                token.set('status_yellow', false);
            }, this);
        }
    }

    // WOUNDED

    if (
        (wounded && parseInt(wounded.get('current'), 10) !== 0) ||
        (wound_treated && parseInt(wound_treated.get('current'), 10) !== 0)
    ) {
        tokens.forEach(function(token) {
            token.set('status_red', '');
        }, this);
    } else {
        tokens.forEach(function(token) {
            token.set('status_red', false);
        }, this);
    }
};