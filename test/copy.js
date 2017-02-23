var tap = require('tap');
var is = require('arc-is');
var ArcObject = require('../');

//Test constant related methods
tap.test('ArcObject copy',function(_test){
    var Y = {};
    _test.notEqual(ArcObject.copy(Y),Y);
    _test.end();
});