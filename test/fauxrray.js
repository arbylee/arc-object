var tap = require('tap');
var ArcObject = require('../');

//Everybody knows objects shouldn't be used as map/array bastardizations.. but we do sometimes anyway
tap.test('ArcObject.fauxrray',function(_test){
    let testObj = new ArcObject({z:'c',y:'b',x:'a'});

    //Test our keysort
    testObj.ksort();
    _test.same(testObj,{x:'a',y:'b',z:'c'});

    //Our 'first' value is...
    _test.equal(testObj.first(),'a');

    //Our 'last' value is...
    _test.equal(testObj.last(),'c');

    //And 'pop' it
    _test.equal(testObj.pop(),'c');
    _test.same(testObj,{x:'a',y:'b'});

    //And remove our 'first'
    _test.equal(testObj.shift(),'a');

    //And we have our modified finished object
    _test.same(testObj,{y:'b'});

    //End
    _test.end();
});