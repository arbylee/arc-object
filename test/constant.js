var tap = require('tap');
var is = require('arc-is');
var ArcObject = require('../');

//Test constant related methods
tap.test('ArcObject constant',function(_test){
    //ArcObject constant 
    let testObj = new ArcObject();
    testObj.constant('A','a');
    testObj.constant('B','b',false);

    testObj.A = 'B';

    var hasB = false;
    for(let val in testObj){
        if(val === 'b'){
            hasB = true;
        }
    }
    _test.equal(testObj.A,'a');
    _test.equal(hasB,false);

    _test.end();
});