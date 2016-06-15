var tap = require('tap');
var is = require('arc-is');
var ArcObject = require('../');

//Bind ArcObject to the native object
ArcObject.bindNative();

//Test native casting, and toString
tap.test('ArcObject nativeBind',function(_test){
    let testObj = {}.arc();
    _test.equal(is(testObj),'object');
    _test.equal(is(testObj,true),'ArcObject');

    //And if we take our now ArcObject (which inherits from native) and call .arc() it should return itself
    _test.equal(testObj.arc(),testObj);

    _test.end();
});