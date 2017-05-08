# arc-object [![Build Status](https://travis-ci.org/anyuzer/arc-object.svg?branch=master)](https://travis-ci.org/anyuzer/arc-object)
An object convenience subclass for javascript (ES6)

## Install
```
$ npm install arc-object --save
```

## Features
* each() with break functionality
* complex key/value filtering (using ArcCheck)
* quick filtering
* fauxrray like functions
    * ksort()
    * keys()
    * count()
    * first()
    * last()
    * shift()
    * pop()
    * reduce
* native convenience binding (if desired)
* freeze() and deepFreeze() (object freezing)
* failure safe object instantiation checking

## Basic Usage
The following example creates a new ArcObject, filters out false/empty/null values, keysorts, and breaks on a specific value

```js
var ArcObject = require('arc-object');
var alpha = new ArcObject({z:'z',x:false,y:'aardvark',a:'a',b:undefined,c:'c'});

//Filter out false/undefined vals
alpha.quickFilterVals([false,undefined]);

//Key sort. Now internally ordered as {a:'a',c:'c',y:'aardvark',z:'z'}
alpha.ksort();

//Iterate
alpha.each(function(_key,_val){
    if(_val === 'aardvark'){
        //Break when we hit aardvark
        return false;
    }
});
```

## API

### new ArcObject(Object)
Create a new `ArcObject` object. Requires `new`

### .each(callback:Function[, thisContext:Object])
Loop over an object index, calling callback each iteration. Break when `false` is explicitly returned.

**callback** is a required function that is called with 3 arguments passed in
* key: the index key of the current iteration
* value: the value of the current iteration
* reference: the object reference being iterated over

**thisContext** is an optional object that will be available inside of the callback as `this` if set, otherwise defaulting to the original object.

```js
//Example of breaking each
var users = new ArcObject({'a':'aardvark','b':'brad','c':'documents are boring'});
users.each(function(_k,_v){
    if(_v === 'brad'){
        return false;
    }
});
```

### .reduce(callback:Function,returnArg:Mixed[,falseBreak:Boolean])
Faux reduce for objects. Iterate over the object, and return a single value.

By default, returning false breaks the iteration, but this can be optionally switched off by passing in false as the third argument.

```js
//Example of reduce
var users = new ArcObject({'a':'aardvark','b':'brad','c':'documents are boring','d':'Andy'});
var aUsers = users.reduce(function(_aUsers,_val,_key){
    //3rd argument is key, not using it in this example
    if(_val.charAt(0) === 'a'){
        _aUsers.push(_val);
    }
    return _aUsers;
},[]);

//aUsers contains ['aardvark','Andy']
```

### .ksort()
Rebuild an object by keys (alphabetical)
```js
var alpha = new ArcObject({c:'c',b:'b',a,'a'});
alpha.ksort(); //Now {a:'a',b:'b',c:'c'}
```

### .first()
Get whatever value is currently at the first pointer in the object index
```js
var alpha = new ArcObject({a:'a',z:'z'});
alpha.first(); //return 'a'
```

### .last()
Get whatever value is currently at the last pointer in the object index
```js
var alpha = new ArcObject({a:'a',z:'z'});
alpha.first(); //return 'z'
```

### .shift()
Remove and return whatever value is currently at the first pointer in the object index
```js
var alpha = new ArcObject({a:'a',z:'z'});
alpha.shift(); //return 'a' and remove 'a' from alpha object
```

### .pop()
Remove and return whatever value is currently at the last pointer in the object index
```js
var alpha = new ArcObject({a:'a',z:'z'});
alpha.pop(); //return 'z' and remove 'z' from alpha object
```

### .count()
Return the current length of the object utilizing Object.keys(this).length
```js
var alpha = new ArcObject({a:'a',z:'z'});
alpha.count(); //return 2
```

### .keys()
Return an ArcArray array of the current object keys
```js
var alpha = new ArcObject({a:'a',z:'z'});
alpha.keys(); //['a','z'] (ArcArray)
```

### .freeze()
Turn object immutable (shallow)
```js
var alpha = new ArcObject({a:'a',z:'z'});
alpha.freeze();
alpha.a = 'aardvark'; //This will fail to set the a property
```

### .deepFreeze()
Turn object immutable (deep)
```js
var alpha = new ArcObject({a:'a',z:{x:'x'}});
alpha.deepFreeze();
alpha.z.x = 'aardvark'; //This will fail to set the a property
```

### .constant(key:Mixed,val:Mixed[,enumerable:Boolean])
Alias of static ArcObject.defineConstant()

### .quickFilterKeys(values:Array) / .quickFilterVals(values:Array)
Remove indexes from object based on either matching keys, or matching values.
```js
//Example of quickFilter
var alpha = new ArcObject({a:true,b:false,z:undefined});
alpha.quickFilterVals([false,undefined]); //Object is reduced to {a:'a'}
```

### .filterKeys(filter:ArcCheck) / .filterVals(filter:ArcCheck)
Use an ArcCheck object to perform complex evaluation on a key or value to decide whether or not it should be removed from the object (see ArcCheck for more details on use).

### ArcObject.duckInstanceOf(primary:Object,duck:Object)
Compare two objects to see if the duck object has the same properties bound as functions as the primary object
```js
//Example class
class Test{
    getSomething(){}
}

//Two seperate instantiations
var primary = new Test;
primary.id = "one thing";

var duck = new Test;
duck.id = "another thing";

//Comparison
(primary == duck); //false
(primary === duck); //false
ArcObject.duckInstanceOf(primary,duck); //true

//Change the interface on the primary, so the duck no longer matches
primary.newFunc = function(){};
ArcObject.duckInstanceOf(primary,duck); //false

//But reverse the order...
ArcObject.duckInstanceOf(duck,primary); //true (because we are not comparing if the interfaces are identical, only if the secondary has the same interface as the primary)

```

### ArcObject.check(...args)
This is a static method that can be used to check whether or not an object chain has been instantiated.
```js
//An descriptive object with sub data
var user = {'details':{'id':false,'address':undefined}};
ArcObject.check(user,user.details);                         //Returns true
ArcObject.check(user,user.details,user.details.address);    //Returns false
```

### ArcObject.nativeBind()
this is a static method that binds a method to the native global object property that transforms an object into an ArcObject object. This has a global effect and should be used carefully.
```js
ArcObject.nativeBind();
var users = {
    id1:'aaa',
    id2:'bbb',
    id3:'ccc'
}.arc(); //This returns an ArcObject object
```

### ArcObject.defineConstant(obj:Object,key:Mixed,val:Mixed [,enumerable:Boolean])
This is a convenience static method that does the following:
```js
Object.defineProperty(obj, key, {
    value: val,
    writable : false,
    enumerable : (enumerable === false ? false : true),
    configurable : false
});
```

## Testing
```
npm test
```