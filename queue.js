(function(exports){
    function Queue () {
        this._callback = [];
        this.runned = false;
        this.running = false;
    }

    Queue.prototype._next = function () {
        var next = this._callback.shift();
        if (!next ) {
            return (function () { this.runned = true; this.running = false }).bind(this);
        }
        return (function (length) {
            return (function () {
                var args = next[1];
                //使得前一个方法可以注入参数到后一个方法
                for (var i = 0, length = arguments.length; i < length; i++) {
                    args.push(arguments[i]);
                }
                args.push(this._next());
                next[0].apply(this, args);
                //防止最后一步不调用next函数
                if (!length) {
                    this.runned = true;
                    this.running = false;
                }
            }).bind(this);
        }).call(this, this._callback.length);
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