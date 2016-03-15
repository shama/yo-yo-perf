// Change N to change the number of drawn circles.

var N = 100;

// Without the transform
(function () {
  var yo = require('yo-yo')
  var _ = require('lodash')
  function drawBox (key, count) {
    var top = Math.sin(count / 10) * 10
    var left = Math.cos(count / 10) * 10
    var bg = count % 255
    return yo`<div class="box-view">
      <div class="box" style="top:${top}px;left:${left}px;background:rgb(0, 0, ${bg});">
        ${count % 100}
      </div>
    </div>`
  }
  var render = _.memoize(function render (count) {
    return yo`<div>
      ${_.map(_.range(N), function (i) {
        return drawBox(i, count)
      })}
    </div>`
  })
  var count = 0
  var root = render(count)
  function init () {
    document.body.appendChild(root)
  }
  function animate () {
    count++
    yo.update(root, render(count))
  }
  function run () {
    init()
    setTimeout(function () {
      startClock()
      benchmarkLoop(animate)
    }, 300)
  }
  //run()
}());

// With the future transform
(function () {
  var yo = require('yo-yo')
  var _ = require('lodash')
  function drawBox (key, count) {
    var top = Math.sin(count / 10) * 10
    var left = Math.cos(count / 10) * 10
    var bg = count % 255
    return (function () {
      var el = document.createElement('div')
      el.className = 'box-view'
      el.appendChild(arguments[0])
      return el
    })((function () {
      var el = document.createElement('div')
      el.className = 'box'
      var top = Math.sin(arguments[0] / 10) * 10
      var left = Math.cos(arguments[0] / 10) * 10
      var bg = arguments[0] % 255
      el.style = 'top:' + top + 'px;left:' + left + 'px;background:rgb(0, 0, ' + bg + ');'
      var node = document.createTextNode(count % 100)
      el.appendChild(node)
      return el
    })(count))
  }
  var render = _.memoize(function render (count) {
    var boxes = _.map(_.range(N), function (i) {
      return drawBox(i, count)
    })
    return (function () {
      var el = document.createElement('div')
      for (var i = 0; i < arguments[0].length; i++) {
        el.appendChild(arguments[0][i])
      }
      return el
    })(boxes)
  })
  var count = 0
  var root = render(count)
  function init () {
    document.body.appendChild(root)
  }
  function animate () {
    count++
    yo.update(root, render(count))
  }
  function run () {
    init()
    setTimeout(function () {
      startClock()
      benchmarkLoop(animate)
    }, 300)
  }
  run()
}());

window.timeout = null;
window.totalTime = null;
window.loopCount = null;
window.startDate = null;
window.startClock = function () {
    loopCount = 0;
    totalTime = 0;
    startDate = perfTime();
}

var perfTime = performance
  ? function(){ return performance.now(); }
  : function(){ return new Date(); };

window.benchmarkLoop = function(fn) {
    totalTime += perfTime() - startDate;
    startDate = perfTime();
    fn();
    loopCount++;
    if (loopCount % 20 === 0) {
        console.log('Performed ' + loopCount + ' iterations in ' + parseInt(totalTime) + ' ms (average ' + (totalTime / loopCount).toFixed(2) + ' ms per loop).');
    }
    if (loopCount % 500 === 0) {
        console.log('Performed ' + loopCount + ' iterations in ' + parseInt(totalTime) + ' ms (average ' + (totalTime / loopCount).toFixed(2) + ' ms per loop).');
    }

    timeout = _.defer(benchmarkLoop, fn);
};
