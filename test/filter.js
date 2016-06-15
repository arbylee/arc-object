var tap = require('tap');
var is = require('arc-is');
var Check = require('arc-check');
var ArcObject = require('../');

//Test some lazy shortcut methods
tap.test('ArcObject.filter',function(_test){
    let testObj = new ArcObject({and:'aardvark',aa:'bb',bb:'cc',z:'a',id:false,id2:undefined});

    //filterKeys only accepts valid ArcCheck object
    _test.throws(function(){
        testObj.filterKeys('STRING');
    },TypeError);

    //quickFilterKeys expects a valid array of values to check against
    _test.throws(function(){
        testObj.quickFilterKeys('STRING');
    },TypeError);

    //filterVals only accepts valid ArcCheck object
    _test.throws(function(){
        testObj.filterVals('STRING');
    },TypeError);

    //quickFilterVals expects a valid array of values to check against
    _test.throws(function(){
        testObj.quickFilterVals('STRING');
    },TypeError);

    //Check to see if it's a string that starts with 'a'
    var CheckFor = new Check();
    CheckFor.addInclude(function(_check){
        return (is(_check) === 'string' && _check.charAt(0) === 'a' ? true : false);
    });

    //Filter number keys, and ensure we're returning the reference for chaining
    _test.equal(testObj.filterKeys(CheckFor),testObj);

    //Check to ensure our object is modified appropriately
    _test.same(testObj,{bb:'cc',z:'a',id:false,id2:undefined})

    //Filter number values, and ensure we're returning the reference for chaining
    _test.equal(testObj.filterVals(CheckFor),testObj);

    //Check to ensure our object is modified appropriately
    _test.same(testObj,{bb:'cc',id:false,id2:undefined})

    //Filter keys that match 'aaa'
    _test.equal(testObj.quickFilterKeys(['bb']),testObj);

    //Check modification
    _test.same(testObj,{id:false,id2:undefined});

    //Filter values that are false or undefined
    _test.equal(testObj.quickFilterVals([false,undefined]),testObj);

    //Check modification
    _test.same(testObj,{});

    //End
    _test.end();
});