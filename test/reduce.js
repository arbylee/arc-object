var tap = require('tap');
var ArcObject = require('../');

//Test each iterator
tap.test('ArcObject.reduce',function(_test){
    let testObject = new ArcObject({a:'a',b:'b',c:'c',d:'d'});

    //If each does not receive a valid function, throw a TypeError
    _test.throws(function(){
        testObject.reduce('STRING');
    },TypeError);

    //Ensure the iteration behaves as expected
    testObject.reduce(function(_lastArg,_value,_key){
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

            case 'd':
                _test.equal(_key,'d');
                _test.equal(_value,'d');
                break;
        }
    });

    //Ensure break behaves as expected
    let count = 0;
    testObject.reduce(function(_lastArg,_v,_i){
        if(_i === 'c'){
            return false;
        }
        count++;
    });
    _test.equal(count,2);

    //Test joining based on return
    var joined = testObject.reduce(function(_lastReturn,_value,_key){
        _lastReturn += _value;
        return _lastReturn;
    },'');
    _test.equal(joined,'abcd');

    //Test a modified array by reference
    var upper = testObject.reduce(function(_upper,_value){
        _upper.push(_value.toUpperCase());
    },[]);
    _test.same(upper,['A','B','C','D']);

    //Test turning off break...
    let count2 = 0;
    testObject.reduce(function(_i,_v){
        count2++;
        if(_i === 2){
            return false;
        }
    },[],false);
    _test.equal(count2,4);

    //End
    _test.end();
});