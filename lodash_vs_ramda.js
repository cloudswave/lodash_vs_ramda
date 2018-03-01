var Benchmark = require('benchmark');
var _ = require('lodash');
var R = require('ramda');
/**
数组[{counter:0},{counter:1},{counter:2}…{counter:9999}]从中取出counter, 过滤出其中的奇数, 然后对他们进行平方, 最后过滤出小于三位数的数.
**/
//------------lodash和ramda以及原生实现性能测试-----------------
//生成data
var data = _.range(10000).map(function(i) {
    return {
      counter: i
    }
});
var isOdd = function(num) { //是否是奇数
    return num % 2 === 1;
};
var square = function(num) { //平方
    return num * num;
};
var isLess3 = function(num) {  //2位数
    return num.toString().length < 3;
};
var lodash = function(data) {
    return _.filter(_.map(_.filter(_.pluck(data, 'counter'), isOdd), square), isLess3);
};
  
var ramda1 = function(data) {
    return R.filter(isLess3,R.map(square,R.filter(isOdd, R.pluck('counter', data))));
  };
  
// pipe方式实现.
var ramda2 = R.pipe(
      R.pluck('counter'),
      R.filter(isOdd),
      R.map(square),
      R.filter(isLess3)
);
  
var native1 = function(data) {
    return data.map(function(value) {
        return value.counter;
      }).filter(function(value) {
        return value != null;
      }).filter(isOdd).map(square).filter(isLess3);
};
  
var native2 = function(data) {
    var result = [];
    var length = data.length;
    for (var i=0; i<data.length; i++) {
      var value = data[i].counter;
      var squared;
      if (isOdd(value)) {
        squared = square(value);
        if (isLess3(squared)) {
          result.push(squared);
        }
      }
    }
    return result;
};
console.log("lodash:" + lodash(data));
console.log("ramda1:" + ramda1(data));
console.log("ramda2:" + ramda2(data));
console.log("native1:" + native1(data));
console.log("native2:" + native2(data));
suite = new Benchmark.Suite;
// 添加测试
suite
.add('lodash', function() {
  lodash(data);
})
.add('ramda1', function() {
  ramda1(data);
})
.add('ramda2', function () {
  ramda2(data);
})
.add('native1', function () {
  native1(data);
})
.add('native2', function () {
  native2(data);
})
// 每个测试跑完后，输出信息
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
// 这里的 async 不是 mocha 测试那个 async 的意思，这个选项与它的时间计算有关，默认勾上就好了。
.run({ 'async': true });