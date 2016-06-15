var tap = require('tap');
var ArcObject = require('../');

//Test each iterator
tap.test('ArcObject.each',function(_test){
    let testObj = new ArcObject({a:'a',b:'b',c:'c'});

    //If each does not receive a valid function, throw a TypeError
    _test.throws(function(){
        testObj.each('STRING');
    },TypeError);

    //Ensure the iteration behaves as expected
    testObj.each(function(_key,_value){
        switch(_key){
            case 'a':
                _test.equal(_key,'a');
                _test.equal(_value,'a');
                break;

            case 'b':
                _test.equal(_key,'b');
                _test.equal(_value,'b');
                break;

            case 'c':
                _test.equal(_key,'c');
                _test.equal(_value,'c');
                break;
        }
    });

    //Ensure break behaves as expected
    let count = 0;
    testObj.each(function(_k,_v){
        if(_k === 'b'){
            return false;
        }
        count++;
    });

    _test.equal(count,1);

    //End
    _test.end();
});