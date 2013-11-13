(function(exports){
    function Queue () {
        this._callback = [];
        this.runned = false;
        this.running = false;
    }

    Queue.prototype._next = function () {
        var next = this._callback.shift();
        if (!next) {
            return (function () { this.runned = true; this.running = false }).bind(this);
        }
        return (function () {
            next[1].push(this._next());
            next[0].apply(this, next[1]);
        }).bind(this);
    }

    Queue.prototype.push = function (fn) {
        var args = Array.prototype.slice.call(arguments, 1);
        this._callback.push([fn, args]);
        return this;
    }

    Queue.prototype.run = function () {
        this.running = true;
        this._next()();
    }
    exports.Queue = Queue;
})(this)