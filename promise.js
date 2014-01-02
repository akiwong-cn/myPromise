(function(exports){
    "use strict"
     function Deferred() {
        this.state = "pendding";
        this._callback = {};
    }

    var slice = [].slice;

    Deferred.prototype.resolve = function() {
        var res, 
            callback = this._callback["done"],
            args = slice.call(arguments);
        this.result = args;
        if (this.state !== "pendding") {
            return this;
        }
        try {
            this.state = "resolved";
            callback && this._then(callback.apply(this, args));
        } catch(e) {
            this._then(e, true);
        }
        this._callback = {};
        return this;
    };

    Deferred.prototype._then = function(value, rejected) {
        var then = this._next;
        if(then) {
            if(!rejected) {
                then.resolve(value);
            } else {
                then.reject(value);
            }
        }
        return this;
    };

    Deferred.prototype._clear = function() {
        this._callback = {};
        this.result = undefined;
    };

    Deferred.prototype.reject = function(reason) {
        this.state = "rejected";
        var callback = this._callback["fail"];
        callback && callback(reason);
        this._then(reason, true)._clear();
    };

    Deferred.prototype.then = function(done, fail, process) {
        this._callback["done"] = done;
        this._callback["fail"] = fail;
        this._callback["process"] = process;
        this._next = new Deferred();
        return this._next.promise();
    };

    Deferred.prototype.promise = function() {
        var _this = this;
        return {
            then: function(done, fail, process){
                return _this.then(done, fail, process);
            }
        }
    };

    function when() {
        var args = slice.call(arguments, 0),
            deferred = new Deferred(),
            len = args.length,
            resolvedValues = new Array(len),
            obj,
            remain = len;
        for (var i = 0; i < len; i++) {
            obj = args[i];
            obj.then(
                (function (index) {
                    return function(value) {
                        resolvedValues[index] = value;
                        if(!(--remain)) {
                            deferred.resolve.apply(deferred, resolvedValues);
                        }
                    };
                }
            )(i), deferred.reject);
        };
        return deferred.promise();
    }
    exports.Deferred = Deferred;
    exports.when = when;
})(this);