on("change:graphic:left", function(obj) { updateStanceOnDrop(obj); });
on("change:graphic:top", function(obj) { updateStanceOnDrop(obj); });

var updateStanceOnDrop = function (obj) {
    var left = parseInt(obj.get('left'), 10);
    var top = parseInt(obj.get('top'), 10);
    var forwardTop = 0;
    var openTop = 290;
    var defensiveTop = 520;
    var rearwardTop = 760;

    // outside the mat.
    if (left > 730 || top > 1010) {
        return;
    }

    // forward
    if (top < openTop) {
        setStanceOnTokensCharacter(obj, 6);

    // open
    } else if (top >= openTop && top < defensiveTop) {
        setStanceOnTokensCharacter(obj, 9);

    // defensive
    } else if (top >= defensiveTop && top < rearwardTop) {
        setStanceOnTokensCharacter(obj, 12);

    // rearward
    } else if (top >= rearwardTop) {
        setStanceOnTokensCharacter(obj, 12);

   }
};

var setStanceOnTokensCharacter = function (token, newStance) {
    var characterid = token.get('represents');
    var stance = findObjs({
        _characterid: characterid,
        _type: 'attribute',
        name: 'stance'
    })[0];

    stance.set('current', newStance);
    sendChat('character|'+characterid, 'changes stance to ' + newStance);
    sendChat('character|'+characterid, '/w gm !sortturnorder');
};