/********************************************************************** 
 * Name:            snortbot.js
 * Version:         0.1
 * Description:     Program provides the 'optimal' option for the
 *                  player to make in a game of Snort using sentestrat
**********************************************************************/

/*  Name:   optimalMove
    Input:  GameJSON:       Snort board represented as JSON object
            residue:        Index of chains in gameJSON that resulted
                            from the opponents previous move (null if
                            this is the starting move)
            player:         0 - lefts's move (black)
                            1 - right's move (white) 
            ambientTemp:    minumum board temperature of all previous
                            moves by the player
*/

const Decimal = require('decimal.js');

const optimalMove = (game, residue, player, ambientTemp) => {
    var optimalComponent = 0;
    if(ambientTemp === 0)
        return findPlayable(game, player);
    if(residue === null || (residue[0] != null && residue[1] != null 
        && (ambientTemp > temp(game[residue[0]]) && ambientTemp > temp(game[residue[1]])))
        || (residue[0] === null && ambientTemp > temp(game[residue[1]])) || 
        (residue[1] === null && ambientTemp > temp(game[residue[0]]))){ //play hotstrat
        for(var i = 1; i < game.length; i++)
            if(temp(game[i]) > temp(game[optimalComponent]))
                optimalComponent = i;
    }else if(residue[0] === null)
        optimalComponent = residue[1];
    else if(residue[1] === null)
        optimalComponent = residue[0];
    else 
        optimalComponent = ((temp(game[residue[0]]) > temp(game[residue[1]])) ? residue[0] : residue[1]);
    return [optimalComponent, orthodoxMove(game[optimalComponent], player, ambientTemp)];
};

function temp(chain){
    /* parse chain string */
    var start = chain.charAt(0);
    var n = parseInt(chain.slice(1,-1));
    var end = chain.charAt(chain.length-1);
    if((start === 'L' && end === 'R') || (start === 'R' && end === 'L')){
        if(n === 0 || n === 1)
            return -1;
        else if(n === 2)
            return 0;
        else if((n%6 === 1) || (n%6 === 2) || (n%6 === 3))
            return 1;
        else
            return 2
    }else if(start === 'L' && end === 'L' || start === 'R' && end === 'R' ){
        if(n === 0 || n === 1 || n === 2)
            return -1;
        else if(n%6 === 2)
            return 1;
        else if(n%6 === 5)
            return 2;
        else
            return Decimal(2-(1/(Math.pow(2,Math.ceil((n-3)/3)))));
    }
}

function orthodoxMove(chain, player, ambientTemp){
    /* parse chain string */
    var start = chain.charAt(0);
    var n = parseInt(chain.slice(1,-1));
    var end = chain.charAt(chain.length-1);
    if(n === 0 || n === 1 || n === 2)
        return findPlayable(chain, player)[1];
    if(n === 3)
        return 1;
    if(start === 'R' && end === 'L')
        player = (player === 1) ? 0 : 1;
    var move = 2;
    if(player === 1)
        move = n-move-1;
    return move;
}

function findPlayable(game, player){
    for(var i = 0; i < game.length; i++){
        var g = game[i];
        if((g.charAt(1) === '1' && ((g.charAt(0) === 'L' && player) 
            || (g.charAt(0) === 'R' && !player))) || (g.charAt(1) 
            === '2' && ((g.charAt(0) === 'L' && player) 
            || (g.charAt(0) === 'R' && !player))))
            return [i, 0];
        else if(g.charAt(1) === '2' && ((g.charAt(2) === 'L' && player) ||
            (g.charAt(2) === 'R' && !player)))
            return [i, 1];
    }
}

exports.optimalMove = optimalMove;
