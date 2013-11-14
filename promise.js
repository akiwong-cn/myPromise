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

    Deferred.prototype.resolve = function(value) {
        this.result = value;
        var res, 
<<<<<<< HEAD
            args = slice.call(arguments);
        this.result = args;
=======
            callback = this._callback["done"];
>>>>>>> parent of 52b10f8... change invoke callback with apply
        if (this.state !== "resolving") {
            return this;
        }
        try {
            this.state = "resolved";
<<<<<<< HEAD
            this._fire()
                ._clear();
        } catch(e) {
            this.state = "rejected";
            this.result = e;
            this._fire()
                ._clear();
=======
            callback && this._then(callback(value));
        } catch(e) {
            this._then(e)
>>>>>>> parent of 52b10f8... change invoke callback with apply
        }

        return this;
    };

<<<<<<< HEAD
    Deferred.prototype._fire = function() {
        var state = this.state,
            callbacks = this._callback[state],
            args = this.result,
            memory;
        if (state === "resolved") {
            for (var i = 0, length = callbacks.length; i < length; i++) {
                memory = callbacks.shift().apply(this, args);
                memory && (args = [memory]);
            }
        } else if (state === "rejected") {
            for (var i = 0, length = callbacks.length; i < length; i++) {
                callbacks.shift().apply(this, args);   
=======
    Deferred.prototype._then = function(value){
        var then = this._next;
        if(then) {
            if(this.state === "resolved") {
                then.resolve(value);
            } else if(this.state) {
                then.reject(value);
>>>>>>> parent of 52b10f8... change invoke callback with apply
            }
        }
        return this;
    }

<<<<<<< HEAD
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
        this.result = [reason];
        this._fire()
            ._clear();
        return this;
    };
=======
    Deferred.prototype.reject = function(reason) {
        this.state = "rejected";
        var callback = this._callback["fail"];
        callback && callback(reason);
        this._then(reason)._callback = {};
    }
>>>>>>> parent of 52b10f8... change invoke callback with apply

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
                })(i),
                deferred.reject
            );
        };
        return deferred.promise();
    }
    exports.Deferred = Deferred;
    exports.when = when;
})(this);