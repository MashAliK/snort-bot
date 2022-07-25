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
            player:         0 - Black's move
                            1 - White's move
            ambientTemp:    minumum board temperature of all previous
                            moves by the player
*/
function optimalMove(gameJSON, residueJSON, player, ambientTemp){
    var game = JSON.parse(gameJSON);
    var residue = JSON.parse(residueJSON);
    var optimalComponent = 0;
    if(residue == null || (ambientTemp > game[residue[0]] && ambientTemp > game[residue[1]])){ //play hotstrat
        for(var i = 1; i < game.length; i++)
            if(temp(game[i]) > temp(game[optimalComponent]))
                optimalComponent = i;
    }else if(residue[0] == null)
        optimalComponent = residue[1];
    else if(residue[1] == null)
        optimalComponent = residue[0];
    else
        optimalCompnent = (temp(game[residue[0]]) > temp(game[residue[1]])) ? residue[0] : residue[1];
    return [optimalComponent, orthodoxMove(gameJSON[optimalComponent], ambientTemp)];
}

function temp(chain){
    /* parse chain string */
    var start = chain.charAt(0);
    var n = chain.charAt(1);
    var end = chain.charAt(2);
    if(start === 'L' && end === 'R'){
        if(n === 0 || n === 1)
            return -1;
        else if(n === 2)
            return 0;
        else if((n%6 === 1) || (n%6 === 2) || (n%6 === 3))
            return 1;
        else
            return 2
    }else if(start === 'L' && end === 'R'){
        if(n === 0 || n === 1 || n === 2)
            return -1;
        else if(n%6 === 2)
            return 1;
        else if(n%6 === 5)
            return 2;
        else
            return 2-(1/(Math.pow(2,Math.ceil((n-3)/3))));
    }
}

function orthodoxMove(chain, player, ambientTemp){
    /* parse chain string */
    var start = chain.charAt(0);
    var n = chain.charAt(1);
    var end = chain.charAt(2);
    return 2;
    /*
    if(start === 'L' && end === 'R'){
        return 2;       
    }else{

    }*/
}