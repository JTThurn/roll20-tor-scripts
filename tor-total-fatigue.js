// SUM TRAVEL AND ENCUMBRANCE FATIGUE, UNTIL CHARSHEETS ARE RELEASED

on('ready', function() {
    var characters = findObjs({
        _type: 'character'
    });

    characters.forEach(checkTotalFatigue, this);
});

on('change:attribute', function(obj, prev) {
    var characterid = obj.get('_characterid');
    var character = getObj("character", characterid);

    checkTotalFatigue(character);
});

var checkTotalFatigue = function (character) {
    var characterid = character.get('_id');
    var encumbrance_fatigue = findObjs({
        _characterid: characterid,
        _type: 'attribute',
        name: 'encumbrance_fatigue'
    })[0];
    var travel_fatigue = findObjs({
        _characterid: characterid,
        _type: 'attribute',
        name: 'travel_fatigue'
    })[0];
    var total_fatigue = findObjs({
        _characterid: characterid,
        _type: 'attribute',
        name: 'total_fatigue'
    })[0];
    var hate = findObjs({
        _characterid: characterid,
        _type: 'attribute',
        name: 'hate'
    })[0];

    // characters only
    if (total_fatigue && travel_fatigue && encumbrance_fatigue && !hate) {
        var fatigueSum = parseInt(travel_fatigue.get('current'), 10) + parseInt(encumbrance_fatigue.get('current'), 10);

        if (fatigueSum !== total_fatigue.get('current')) {
            total_fatigue.set('current', fatigueSum);
        }
    }
};