/*
    The One Ring State Checker for Roll20.
    By Michael Heilemann (michael.heilemann@me.com)
    Updated by uhu79
    Updated by Justin T. Thurn
    
    # Weary
    Checks to see if a character's endurance drops below her fatigue, and
    automatically sets the `weary` attribute to `weary` or `normal`, depending.
    This is very useful particularly if you're using the TOR roll tables, as you
    can then read the weary attribute of the selected token in a macro and roll
    on the appropriate success die table automatically:
        /r 1t[feat] + @{travel}t[@{weary}]
    
    It requires that the characters have `endurance' and 'total_fatigue'.
    
    If you want to manually set a character weary, you can do that via the gear
    list. Just add a gear that says "temporarily weary" with a very high
    encumbrance value that will in any case exceed the current limit.
    
    # Wounded / Treated Wound
    Sets marker for wounded and treated wound, which are manual settings. Requires that the characters have 'wounded'
    and 'wound_treated' attributes.
    
    # Miserable
    Detects and changes miserable status by comparing shadow and hope, then sets marker. Marker removal is manual as per the
    One Ring rules. Requires 'hope', 'miserable' and 'total_shadow'.
    
    # Unconcious
    Sets marker on zero endurance (or less), removing it when endurance goes above zero. Requires 'endurance' attribute. Note that characters
    can fall unconcious with two wounds, but at the moment the character sheets aren't set up to track that.
    
    # More Information
    Works great with the The One Ring character sheet for Roll20.
    For more of my [Michael Heilemann's] The One Ring shenanigans:
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
         var miserable = findObjs({
        _characterid: characterid,
        _type: 'attribute',
        name: 'miserable'
    })[0];
         var shadow = findObjs({
        _characterid: characterid,
        _type: 'attribute',
        name: 'total_shadow'
    })[0];
         var hope = findObjs({
        _characterid: characterid,
        _type: 'attribute',
        name: 'hope'
    })[0];
    var tokens = findObjs({
        _type: 'graphic',
        represents: characterid
    });

    	if (!fatigue || !endurance || !weary || !shadow || !hope) {
        return;
    }
  
// WOUNDED and TREATED WOUND
  if (wounded.get('current') > 0 || wound_treated.get('current') > 0) {
        tokens.forEach(function(token) {
            token.set('status_broken-heart', '');
        }, this);

    } else {
        tokens.forEach(function(token) {
            token.set('status_broken-heart', false);
        }, this);
    }
	
 if (wound_treated.get('current') > 0) {
        tokens.forEach(function(token) {
          	token.set('status_green', '');
        }, this);

    } else {
        tokens.forEach(function(token) {
          	token.set('status_green', false);
        }, this);
    }
	
    // MISERABLE
    if (hope.get('current') < shadow.get('current')) {
        miserable.set('current', '1');
        tokens.forEach(function(token) {
            token.set('status_bleeding-eye', '');
        }, this);

    }
	
    // WEARY
    if (endurance.get('current') < fatigue.get('current')) {
        weary.set('current', 'weary');
        tokens.forEach(function(token) {
            token.set('status_half-heart', '');
        }, this);

    } else {
        weary.set('current', 'normal');
        tokens.forEach(function(token) {
            token.set('status_half-heart', false);
        }, this);
    }
	
  // UNCONCIOUS
  	if (endurance.get('current') <= 0) {
        tokens.forEach(function(token) {
          	token.set('status_sleepy', '');
          	token.set('status_half-heart', false);
        }, this);

    } else {
        tokens.forEach(function(token) {
          	token.set('status_sleepy', false);
        }, this);
    }
  
};
