on('change:attribute', function(attr, prev) {
    var characterid = attr.get('_characterid');
    var character = getObj("character", characterid);
    var characterName = character.get('name');
    var attribute = attr.get('name');

    sendChat(characterName, '/w gm ' + attribute + ' from ' + prev.current + ' to ' + attr.get('current'));
});