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
    const x = new ArcObject({
        test:{
            a:{
                deep:{
                    value:"success"
                }
            }
        }
    });

    let success = x.deepGet('test','a','deep','value')
    let fail = x.deepGet('test','a','deep','failure');

    _test.equal(success,'success');
    _test.equal(fail,undefined);
    
    //End
    _test.end();
});