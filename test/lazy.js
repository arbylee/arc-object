var tap = require('tap');
var ArcObject = require('../');

//Test some lazy shortcut methods
tap.test('ArcObject.lazyMethods',function(_test){
    let testObj = new ArcObject({z:'a',y:'b',x:'c'});

    //Count is a lazy length
    _test.equal(testObj.count(),3);
    
    //Shortcut for Object.keys()
    _test.same(testObj.keys(),['z','y','x']);
    
    //Test Check for checking object instantiation
    var x = {};
    _test.equal(ArcObject.check(x),true);
    _test.equal(ArcObject.check(x,x.a),false);
    
    //End
    _test.end();
});