(function(exports){
    "use strict"
     function Deferred() {
        this.state = "resolving";
        this._callback = {};
    }

    Deferred.prototype.resolve = function(value) {
        this.result = value;
        var res, 
            callback = this._callback["done"];
        if (this.state !== "resolving") {
            return this;
        }
        try {
            this.state = "resolved";
            callback && this._then(callback(value));
        } catch(e) {
            this._then(e)
        }
        this._callback = {};
        return this;
    };

    Deferred.prototype._then = function(value){
        var then = this._next;
        if(then) {
            if(this.state === "resolved") {
                then.resolve(value);
            } else if(this.state) {
                then.reject(value);
            }
        }
        return this;
    };

    Deferred.prototype.reject = function(reason) {
        this.state = "rejected";
        var callback = this._callback["fail"];
        callback && callback(reason);
        this._then(reason)._callback = {};
    }

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

    var slice = [].slice;

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
                            deferred.resolve(resolvedValues);
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