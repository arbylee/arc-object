var tap = require('tap');
var ArcObject = require('../');

//Test freeze methods
tap.test('ArcObject.freeze',function(_test){
    let testObj = new ArcObject({a:'a',b:'b',c:'c'});

    //Freeze it
    testObj.freeze();

    //Attempt overwrite
    testObj.a = 'test';

    //Ensure it didn't work
    _test.equal(testObj.a,'a');

    //Deeper structure
    testObj = new ArcObject({a:'a',b:{x:'x',y:'y',z:'z'},c:'c'});

    //Freeze both levels
    testObj.deepFreeze();
    testObj.b.x = 'yes';

    //Ensure our assignment didn't work
    _test.equal(testObj.b.x,'x');

    //End
    _test.end();
});