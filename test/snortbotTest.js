const assert = require('chai').assert;
const snortbot = require('../snortbot');

describe("snortbot", function(){
    it('snortbot should return the correct orthodox move', function(){
        assert.deepEqual(snortbot.optimalMove(["L3L","L4R","L4R","L3L"], [null,3], 1, 2), [1,1]);
    })
})