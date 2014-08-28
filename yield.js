(function(exports) {
  //use generator simplify async code

  var Queue = function() {
    this._callback = [];
    this.runned = false;
    this.running = false;
  }

  Queue.prototype.push = function(fn) {
    if (fn.constructor.name !== "GeneratorFunction") {
      return this;
    }

    this._callback.push(fn);
  }

  function runGen(gen, ret) {
    var ret, genRet;
    genRet = gen.next(ret);
    if (genRet.done) {
      return ;
    }

    if (genRet.value.constructor.name === "GeneratorFunction") {
      runGen(genRet.value());
      return ;
    }
    if (Array.isArray(genRet.value)) {
      Promise.all(genRet.value).then(function(result) {
        runGen(gen, result);
      });
      return ;
    }
    if (genRet.value.then) {
      genRet.value.then(function(result) {
        runGen(gen, result);
      });
    } else {
      runGen(gen, genRet.value);
    }
  }

  Queue.prototype.run = function() {
    var stack = this._callback, genRet, ret;

    runGen((function *() {
      var l = stack.length, next = (function*() {})();
      
      while(l--) {
        next = stack[l](next);
      }

      yield *next;

    })());

  }
  exports.Queue = Queue;
})(this);
