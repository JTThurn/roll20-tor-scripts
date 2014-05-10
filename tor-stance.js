on('chat:message', function (obj) {
    var contentSplit = obj.content.split(' ');
    var command = contentSplit[0];
    var pars = contentSplit.splice(1, contentSplit.length-1);
    var selected = obj.selected;

    if (command === '!stance' && selected.length > 0) {
        var newStance = parseInt(pars[0], 10);

        // for each selected token
        _.each(selected, function(selection) {
            var tokens = findObjs({
                _id: selection._id,
                type: 'graphic'
            });

            if (tokens.length > 0) {
                var characterid = tokens[0].get('represents');
                var stance = findObjs({
                    _characterid: characterid,
                    _type: 'attribute',
                    name: 'stance'
                })[0];

                if (stance.get('current') !== newStance) {
                    if (newStance !== 6 && newStance !== 9 && newStance !== 12) {

                    } else {
                        // sendChat('character|'+characterid, 'changes stance to ' + newStance);
                        stance.set('current', newStance);
                    }
                }

                // mark the token with the stance
                // (doesn't work, because colors don't take 10+ values)
                // _.each(tokens, function(token) {
                //     log(token)
                //     log(newStance)
                //     if (newStance !== 0) {
                //         token.set('status_green', newStance);
                //     } else {
                //         token.set('status_green', false);
                //     }
                // });
            }
        });
    }
});