(function(exports){
    "use strict"
     function Deferred() {
        this.state = "resolving";
        this._callback = {
            "resolved": [],
            "rejected": [],
            "process": []
        };
    }

    var slice = [].slice;

    Deferred.prototype.resolve = function() {
        var res, 
            args = slice.call(arguments);
        this.result = args;
        if (this.state !== "resolving") {
            return this;
        }
        try {
            this.state = "resolved";
            this._fire()
                ._clear();
        } catch(e) {
            this.state = "rejected";
            this.result = e;
            this._fire()
                ._clear();
        }

        return this;
    };

    Deferred.prototype._fire = function() {
        var state = this.state,
            callbacks = this._callback[state],
            args = this.result,
            fn;
        if (state === "resolving") {
            for (var i = 0, length = callbacks.length; i < length; i++) {
                args = callbacks.pop().call(this, args) || args;   
            }
        } else if (state === "rejected") {
            for (var i = 0, length = callbacks.length; i < length; i++) {
                callbacks.pop().call(this, args);   
            }
        }
        return this;
    }

    Deferred.prototype._clear = function() {
        this._callback = {
            "resolved": [],
            "rejected": [],
            "process": []
        };
        this.result = undefined;
        return this;
    };

    Deferred.prototype.reject = function(reason) {
        this.state = "rejected";
        this.result = reason;
        this._fire()
            ._clear();
        return this;
    };

    Deferred.prototype.then = function(done, fail, process) {
        done && this._callback["resolved"].push(done);
        fail && this._callback["rejected"].push(fail);
        process && this._callback["process"].push(process);
        return this;
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