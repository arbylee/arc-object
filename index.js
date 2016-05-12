"use strict";
var is = require('arc-is');
var Check = require('arc-check');
var ArcArray = require('arc-array');

class ArcObject extends Object {
    constructor(_obj){
        super();
        if(is(_obj) === 'object'){
            var keys,prop;
            keys = Object.keys(_obj);
            for(var i = 0; i < keys.length; i++){
                prop = keys[i];
                this[prop] = _obj[prop];
            }
        }
    }

    deepFreeze(){
        this.each.call(this,function(_k,_v){
            if(is(_v) === 'object'){
                this.deepFreeze.call(_v);
            }
        });
        this.freeze.call(this);
        return this;
    }

    //Turn the native object into an immutable object (shallow)
    freeze() {
        var obj = this;
        obj = Object.freeze(obj);
        return obj;
    }

    each(_f,_thisArg){
        var $this,keys,key,eachBreak;
        if(is(_f) === 'function'){
            $this = _thisArg || this;
            keys = Object.keys(this);
            for(let i=0;i<keys.length;i++){
                key = keys[i];
                _f.call($this,key,this[key],_break);
                if(eachBreak){
                    break;
                }
            }
        }
        function _break(){
            eachBreak = true;
        }
    }

    count(){
        return Object.keys(this).length;
    }

    //A convenient way to binding multiple NPMs to an object
    requires(_mixed){
        var $this = this;
        switch(is(_mixed,true)){
            case 'ArcObject':
                _mixed.each(function(_alias,_require){
                    $this[_alias] = require(_require);
                });
                break;

            case 'ArcArray':
                _mixed.each(function(_require){
                    $this[_require] = require(_require);
                });
                break;

            case 'object':
                this.requires(new ArcObject(_mixed));
                break;

            case 'array':
                this.requires(new ArcArray(_mixed));
                break;
        }
        return $this;
    }

    //Obviously this is wrong, as we shouldn't truse an objects order for anything, but sometimes we do anyways. Likewise Map is really what we should be using
    ksort(){
        var $this = this;
        var keys = $this.keys();
        var copy = new ArcObject;
        keys.sort();
        keys.each(function(_key){
            copy[_key] = $this[_key];
            delete $this[_key];
        });

        copy.each(function(_key,_val){
            $this[_key] = _val;
        });
        return $this;
    }

    keys(){
        return new ArcArray(...Object.keys(this));
    }

    pop(){
        var $this,lastKey,lastVal;
        $this = this;
        lastKey = $this.keys().pop();
        if(lastKey !== undefined){
            lastVal = $this[lastKey];
            delete $this[lastKey];
            return lastVal;
        }
    }

    last(){
        var lastKey = this.keys().pop();
        if(lastKey !== undefined){
            return this[lastKey];
        }
    }

    shift(){
        var $this,firstKey,firstVal;
        $this = this;
        firstKey = $this.keys().shift();
        if(firstKey !== undefined){
            firstVal = $this[firstKey];
            delete $this[firstKey];
            return firstVal;
        }
    }

    first(){
        var firstKey = this.keys().shift();
        if(firstKey !== undefined){
            return this[firstKey];
        }
    }

    copy(){
        var $target = (is(arguments[arguments.length-1]) === 'boolean' ? {} : this);
        return new ArcObject(_copy($target));
    }

    filterVals(_Check){
        if(is(_Check,true) !== 'ArcCheck'){
            throw new TypeError('ArcObject.filterVals expects a valid ArcCheck object as an argument');
        }
        var $this = this;
        var keys = $this.keys();
        for(var i=0;i<keys.length;i++){
            var key = keys[i];
            if(_Check.val($this[key])){
                delete $this[key];
            }
        }
    }

    filterKeys(_Check){
        if(is(_Check,true) !== 'Filter'){
            throw new TypeError('ArcObject.filterKeys expects a valid /Arc/Filter object as an argument');
        }
        var $this = this;
        var keys = $this.keys();
        keys.each(function(_key){
            if(_Filter.val(_key)){
                delete $this[_key];
            }
        });
    }

    quickFilterVals(_filterArray){
        if(is(_filterArray) !== 'array'){
            throw new TypeError('ArcObject.quickFilterVals expects a valid array of values to check against');
        }
        var C = new Check();
        C.addInclude(function(_val){
            return (_filterArray.indexOf(_val) !== -1 ? true : false);
        });
        this.filterVals(C);
    }

    quickFilterKeys(_filterArray){
        if(is(_filterArray) !== 'array'){
            throw new TypeError('ArcObject.quickFilterKeys expects a valid array of values to check against');
        }
        var C = new Check();
        C.addCallback(function(_val){
            return (_filterArray.indexOf(_val) !== -1 ? true : false);
        });
        this.filterKeys(C);
    }

    check(){
        for(var i=0;i<arguments.length;i++){
            if(is(arguments[i]) !== 'object'){
                return false;
            }
        }
        return true;
    }

    toString(){
        return '[object '+this.constructor.name+']';
    }

    static bindNative(){
        Object.defineProperty(Object.prototype,'arc',{
            enumerable: false,
            configurable: false,
            writable: false,
            value: function(){
                var $this = this;
                $this = new ArcObject($this);
                return $this;
            }
        });
    }
}

module.exports = ArcObject;

//Does this even work? I can't remember
function _copy(_obj){
    var copier,circleCache,$return;

    copier = {'object':copyObject,'array':copyArray,'date':copyDate,'regExp':copyRegExp};
    circleCache = {'array':[],'object':[]};
    $return = copyObject(_obj);

    circleCache = null;
    return $return;

    function checkCircle(_ref,_type){
        var i,$ref;
        for(i=0;i<circleCache[_type].length;i++){
            if(circleCache[_type][i].ref === _ref){
                $ref = circleCache[_type][i].copy;
                break;
            }
        }
        if($ref === undefined){
            $ref = copier[_type](_ref);
        }
        return $ref;
    }

    function copyObject(_obj){
        var prop,type,newObj = {};

        circleCache.object.push({'ref':_obj,'copy':newObj});
        for(prop in _obj){
            if(_obj.hasOwnProperty(prop)){
                if(_obj[prop] !== _obj){
                    type = is(_obj[prop]);
                    newObj[prop] = (copier[type] ? checkCircle(_obj[prop],type) : _obj[prop]);
                }
                else{
                    newObj[prop] = newObj;
                }
            }
        }
        return newObj;
    }

    function copyArray(_array){
        var i,type,$newArray = [];

        circleCache.array.push({'ref':_array,'copy':$newArray});
        for(i=0;i<_array.length;i++){
            if(_array[i] !== _array){
                type = is(_array[i]);
                $newArray.push((copier[type] ? checkCircle(_array[i],type) : _array[i]));
            }
            else{
                $newArray.push($newArray);
            }
        }
        return $newArray;
    }

    function copyDate(_date){
        return new Date(_date.getTime());
    }

    function copyRegExp(_regExp){
        return new RegExp(_regExp);
    }
}