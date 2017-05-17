"use strict";
var is = require('arc-is');
var Check = require('arc-check');
var ArcArray = require('arc-array');
const deepcopy = require('deepcopy');

class ArcObject extends Object {
    //Allow for an Object literal argument to be passed in that gets case to the ArcObject
    constructor(_obj){
        super();
        if(is(_obj) === 'object'){
            let keys,prop;
            keys = Object.keys(_obj);
            for(let i = 0; i < keys.length; i++){
                prop = keys[i];
                this[prop] = _obj[prop];
            }
        }
    }

    //Turn the object into an immutable object (deep)
    deepFreeze(){
        this.forEach(function(_v,_k){
            const $this = this;
            if(is(_v) === 'object'){
                $this[_k] = ArcObject.wrap(_v);
                $this[_k].deepFreeze();
            }
        },this);
        this.freeze.call(this);
        return this;
    }

    //Turn the object into an immutable object (shallow)
    freeze() {
        let obj = this;
        obj = Object.freeze(obj);
        return obj;
    }

    //Iterate over the object
    forEach(_f,_thisArg){
        if(is(_f) !== 'function'){
            throw new TypeError('ArcObject.each first argument must be a valid function');
        }

        //Declare
        var $this,keys,key,length;

        //Our context
        $this = _thisArg || this;

        //Etc
        keys = Object.keys(this);
        length = keys.length;

        //Iterate
        for(let i=0;i<length;i++){
            key = keys[i];
            if(_f.call($this,this[key],key,this) === false){
                break;
            }
        }
    }

    //An implementation closer to array.reduce
    reduce(_f,_lastArg,_falseBreak){
        if(is(_f) !== 'function'){
            throw new TypeError('ArcObject.each first argument must be a valid function');
        }
        _falseBreak = (_falseBreak === false ? false : true);

        //Declare
        var $this,keys,key,length,cbReturn;

        //Our context
        $this = this;

        //Etc
        keys = Object.keys(this);
        length = keys.length;

        //Iterate
        for(let i=0;i<length;i++){
            key = keys[i];

            cbReturn = _f.call($this,_lastArg,this[key],key);
            if(cbReturn === false && _falseBreak){
                break;
            }
            _lastArg = cbReturn || _lastArg;
        }
        return _lastArg;
    }

    //Lazy
    count(){
        return Object.keys(this).length;
    }

    //Shortcut to get keys as an ArcArray
    keys(){
        return new ArcArray(...Object.keys(this));
    }

    //Obviously this is wrong, as we shouldn't trust an objects order for anything, but sometimes we do anyways. Likewise Map is really what we should be using
    ksort(){
        var $this = this;
        var keys = $this.keys();
        var copy = new ArcObject;
        keys.sort();
        keys.forEach(function(_key){
            copy[_key] = $this[_key];
            delete $this[_key];
        });

        copy.forEach(function(_val,_key){
            $this[_key] = _val;
        });
        return $this;
    }

    //Remove the last item in the object
    pop(){
        let $this,lastKey,lastVal;
        $this = this;
        lastKey = $this.keys().pop();
        if(lastKey !== undefined){
            lastVal = $this[lastKey];
            delete $this[lastKey];
            return lastVal;
        }
    }

    //Get the last item in the object
    last(){
        let lastKey = this.keys().pop();
        if(lastKey !== undefined){
            return this[lastKey];
        }
    }

    //Remove the first item in the object
    shift(){
        let $this,firstKey,firstVal;
        $this = this;
        firstKey = $this.keys().shift();
        if(firstKey !== undefined){
            firstVal = $this[firstKey];
            delete $this[firstKey];
            return firstVal;
        }
    }

    //Get the first item in the object
    first(){
        let firstKey = this.keys().shift();
        if(firstKey !== undefined){
            return this[firstKey];
        }
    }

    //Remove values that evaluate to true through ArcCheck
    filterVals(_Check){
        if(is(_Check,true) !== 'ArcCheck'){
            throw new TypeError('ArcObject.filterVals expects a valid ArcCheck object as an argument');
        }
        const $this = this;
        const keys = $this.keys();
        for(let i=0;i<keys.length;i++){
            let key = keys[i];
            if(_Check.val($this[key])){
                delete $this[key];
            }
        }
        return $this;
    }

    //Remove values that have keys that evaluate to true through ArcCheck
    filterKeys(_Check){
        if(is(_Check,true) !== 'ArcCheck'){
            throw new TypeError('ArcObject.filterKeys expects a valid /Arc/Filter object as an argument');
        }
        const $this = this;
        const keys = $this.keys();
        keys.forEach(function(_key){
            if(_Check.val(_key)){
                delete $this[_key];
            }
        });
        return $this;
    }

    //Remove values that have values that match a value of the filterArray
    quickFilterVals(_filterArray){
        if(is(_filterArray) !== 'array'){
            throw new TypeError('ArcObject.quickFilterVals expects a valid array of values to check against');
        }
        const C = new Check();
        C.addInclude(function(_val){
            return (_filterArray.indexOf(_val) !== -1 ? true : false);
        });
        return this.filterVals(C);
    }

    //Remove values that have keys that match a value of the filterArray
    quickFilterKeys(_filterArray){
        if(is(_filterArray) !== 'array'){
            throw new TypeError('ArcObject.quickFilterKeys expects a valid array of values to check against');
        }
        const C = new Check();
        C.addInclude(function(_val){
            return (_filterArray.indexOf(_val) !== -1 ? true : false);
        });
        return this.filterKeys(C);
    }

    constant(_key,_val,_enumerable){
        ArcObject.defineConstant(this,_key,_val,_enumerable);
    }

    //To string: [object ArcObject]
    toString(){
        return '[object '+this.constructor.name+']';
    }

    static duckType(_primary,_duck){
        if(is(_primary) !== is(_duck)){
            return false;
        }
        let prop;
        for(prop in _primary){
            if(_primary.hasOwnProperty(prop) && is(_primary[prop]) === 'function'){
                if(is(_duck[prop]) !== 'function'){
                    return false;
                }
            }
        }
        return true;
    }

    //Take dynamic arguments and check that they're initialized objects
    deepGet(){
        let lastObj = this;
        for(let i=0;i<arguments.length;i++){
            if(lastObj[arguments[i]] === undefined){
                return undefined;
            }
            lastObj = lastObj[arguments[i]];
        }
        return lastObj;
    }
    
    //When called binds the .arc() method to the global native object type, which in turn returns an ArcObject from a native object
    static bindNative(){
        Object.defineProperty(Object.prototype,'arc',{
            enumerable: false,
            configurable: false,
            writable: false,
            value: function(){
                let $this = this;
                if(is($this,true) === 'ArcObject'){
                    return $this;
                }
                $this = new ArcObject($this);
                return $this;
            }
        });
    }

    //Safely return an ArcObject or cast a native object as an ArcObject
    static wrap(_obj){
        if(is(_obj,true) === 'ArcObject'){
            return _obj;
        }
        else if(is(_obj) === 'object'){
            return new ArcObject(_obj);
        }
        else{
            throw new TypeError('Cannot wrap value. Must evaluate to a native object.');
        }
    }

    static defineConstant(_obj,_key,_val,_enumerable){
        Object.defineProperty(_obj, _key, {
            value: _val,
            writable : false,
            enumerable : (_enumerable === false ? false : true),
            configurable : false
        });
    }

    static copy(_obj){
        return deepcopy(_obj);
    }
}

module.exports = ArcObject;