var tap = require('tap');
var is = require('arc-is');
var ArcObject = require('../');

//Test native casting, toString and wrapping
tap.test('ArcObject typeCheck',function(_test){
    //Non prototype evaluation as object. Prototype toString evaluation as ArcObject
    let testObj = new ArcObject();
    _test.equal(is(testObj),'object');
    _test.equal(is(testObj,true),'ArcObject');

    //Native object uses wrap to return an ArcObject.
    let nativeObj = {a:'a'};
    nativeObj = ArcObject.wrap(nativeObj);
    _test.equal(is(nativeObj,true),'ArcObject');
    _test.same(nativeObj,{a:'a'});
    _test.equal(ArcObject.wrap(nativeObj),nativeObj); //An already wrapped ArcObject should return itself

    //Will only accept items that identify as a native object (in simple is evaluation), or an ArcObject
    _test.throws(function(){
        ArcObject.wrap('STRING');
    },TypeError);

    _test.end();
});