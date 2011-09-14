

var it = require('it-is').style('colour')
  ,  testling = (function () { 
      try { 
        return require('testling') 
        } catch (err) {
        return 
    })()
  , F = require('./fassert')


exports['returns'] = function (test) {
  var f = F()
  it(f).property('returns',it.isFunction())
  function seven () {
    return 7
  }
  it(seven()).equal(7)
  seven =  f.returns(seven, 7)

  var six =  f.returns(seven, 6)

  //it(
  console.log('NOT SEVEN', six())
  it(f.verify).throws() //expected notSeven to return 7
  test.done()
}

exports['throws'] = function (test) {
  var f = F()

  it(f).property('throws',it.isFunction())
  function willThrow() {
    throw new Error('INTENSIONAL ERROR')
  }
  it(willThrow).throws()

  wt = f.throws(willThrow, it.has({message: 'INTENSIONAL ERROR'}))
  it(wt).throws()
  f.verify()
  //it(f.verify).doesNotThrow()
  test.done()
}

exports['verify missing callback'] = function (test) {
  var f = F()
  it(f).property('callsback',it.isFunction())
  it(f).property('verify',it.isFunction())
  
  //a useless function
  var funct = function () {}
  //declare that it must callback
  var cbs = f.callsback(funct)
  
  //since the function has not been called yet, it's okay that the callback has not been fired yet.
  it(f.verify).doesNotThrow()
  cbs(function () {})
  //the function has been called, so a callback is expected sometime...
  //if it has not happened when we verify... it will throw.
  it(f.verify).throws()
  test.done()
}

exports ['context'] = function (test) {
  var f = F()

  var f = F('test name')

  it(f).has({
    callsback: it.isFunction (),
    verify: it.isFunction (),
    })
  test.done()
}

exports['verify successful callback'] = function (test) {
  var f = F()
  it(f).property('callsback',it.isFunction())
  it(f).property('verify',it.isFunction())
  
  //a useless function
  function kao (callback) {
    console.log('kaoekoek', arguments)
    callback()
  }
  //declare that it must callback
  var cbs = f.callsback(kao)
  
  //since the function has not been called yet, it's okay that the callback has not been fired yet.
  f.verify()//.doesNotThrow()
  cbs(function (){})
  //the function has been called, so a callback is expected sometime...
  //if it has not happened when we verify... it will throw.
  it(f.verify).doesNotThrow()
  test.done()
}


exports['verify callback is only called once'] = function (test) {
  var f = F()
    , called = 0  
  //a useless function
  var funct = function (callback) {
    callback()
    callback()
  }
  //declare that it must callback
  var cbs = f.callsback(funct)
  
  //since the function has not been called yet, it's okay that the callback has not been fired yet.
  f.verify()
  cbs(function () {})
  //the function has been called, so a callback is expected sometime...
  //if it has not happened when we verify... it will throw.
  it(f.verify).throws()
  test.done()
}

exports ['verify a given number of times'] = function (test) {

  var f = F()
  it(f).property('isCalled',it.isFunction())
  var never = f.isCalled(function () {}, 0, 0) //never call this function!
  
  it(f.verify).doesNotThrow()
  never()
  it(f.verify).throws()
  test.done()
}

exports ['verify a given number of times'] = function (test) {

  var f = F()
    , r = Math.random()
  it(f).property('isCalled',it.isFunction())
  var maybeOnce = f.isCalled(function () {return r}, 0, 1) //never call this function!
  
  it(f.verify).doesNotThrow()
  it(maybeOnce()).equal(r)
  it(f.verify).doesNotThrow()
  it(maybeOnce()).equal(r)
  it(f.verify).throws()
  test.done()
}

exports ['check a function both callsback and returns'] = function (test) {

  var f = F()
    , r = Math.random()

  f.returns(
    f.callsback(function (cb) { process.nextTick(cb); return true }),
    true
  )(function (){
    try {
      f.verify()
    } catch (err) {
      err.map(function (e) {
        console.log(e.message)
        e.failures.map(function (f) {
          console.log(f.stack)
        })
      })
      throw err
    }
    test.done()
  }) 
}

exports ['check that a function is called with the correct args'] = function (test) {

  var f = F()
  function easyAs(a,b,c) {
    //it([a,b,c]).deepEqual([1,2,3])
  }
  f.isPassed(easyAs, [1,2,3])(1,2,2)
  it(f.verify).throws()

  var f2 = F()

  f.isPassed(easyAs, [1,2,3])(1,2,3)
  it(f.verify).throws()

  test.done() 
    
}

exports ['create test context'] = function (test) {

  var f = F()
  var f2 = F('new test', f.isCalled(function innerTest(f2) {
    console.log('in new test')
    function thirtySeven () {return 37}
    var r = 
      f2.isPassed(
        f2.returns( /***/ 
            thirtySeven /***/
          , 36, 'thirty seven.'
          )
      , [4] //f.isCalled(f.setName(it.isEmpty(), 'isEmpty'),1,1) //no args
      )(4)
  }, 1, 1))

//  it(f.verify).doesNotThrow()
  f.verify() //should not thorw
  it(f2.verify).throws() //the inner test should throw
  
  test.done()
}

for (var name in exports) {
  test(name, function (test) {
    test.done = test.end
    exports[name](test)
  })
}

//
// 
//