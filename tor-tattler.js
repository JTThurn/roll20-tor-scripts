/*
    Tattler for Roll20.
    By Michael Heilemann (michael.heilemann@me.com)

    This is an API script for Roll20.net, which whispers all changes to
    attributes to the GM as they're made. Very useful for making sure changes
    aren't made by accident and not having to ask whether an announce change has
    already been committed.

    Has a tendency to spam the chat.
 */
on('add:attribute', function(attr, prev) {
    tattle(attr, prev);
});

on('change:attribute', function(attr, prev) {
    tattle(attr, prev);
});

var tattle = function (attr, prev) {
    var characterid = attr.get('_characterid');
    var character = getObj("character", characterid);
    var characterName = character.get('name');
    var attribute = attr.get('name');
    var oldValue = (prev && prev.current ? prev.current : 'nothing');
    var newValue = attr.get('current');

    // log(characterName + ' changed ' + attribute + ' from ' + oldValue + ' to ' + newValue);
    sendChat('character|'+characterid, '/w gm ' + attribute + ' from ' + oldValue + ' to ' + newValue);
};