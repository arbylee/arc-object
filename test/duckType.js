var tap = require('tap');
var is = require('arc-is');
var ArcObject = require('../');

class Test{
    something(){}
}

//Test constant related methods
tap.test('ArcObject duckType',function(_test){

    //An instantiated class
    let mainObj = new Test;
    mainObj.someProp = 'A value';

    //Another, but with a different property
    let sameObj = new Test;
    sameObj.someProp2 = 'Other value';

    //Another but with a different interface signature
    let diffObj = new Test;
    diffObj.newInterface = function(){};

    //A non class
    let nonObj = "Test";

    _test.equal(ArcObject.duckType(mainObj,sameObj),true); //They are the same
    _test.equal(ArcObject.duckType(diffObj,mainObj),false); //The duck object does not contain the same interface signature as the primary (diffObj)
    _test.equal(ArcObject.duckType(mainObj,diffObj),true); //The duck object does contain the same interface signature as the primary object
    _test.equal(ArcObject.duckType(mainObj,nonObj),false); //They are different

    _test.end();
});