# JSVerifier

Run assertions against your objects. Define contracts with a handy DSL. Test your code inline.


## Idea

JSVerifier lets you run assertions against objects via a convenient DSL:

```js
import V from 'jsverifier';

function myFunc(foo, bar) {
  V(foo, {object: true});

  V(bar, {
    optional: true,
    or: {
      number: {
        minValue: 3,
        maxValue: 10,
        orString: true
      },
      function: true
    }
  })


  /* Your function's code here */
}
```

## Roadmap

* [ ] Readme
  * [ ] Better reasoning
  * [ ] More examples
* [ ] Website with API documentation (JSDoc?)
* [ ] Library composition
  * [x] Basic functionality
  * [x] Basic tests
  * [x] Assertion class
  * [x] Executing common assertions without having them in the `assertions` array
  * [ ] Aliases
* [ ] Assertions
  * [ ] general
    * [ ] equals / equal / is / value
    * [ ] instanceOf / instanceof / isA
    * [ ] falsy
    * [ ] false
    * [ ] nully
    * [ ] null
    * [ ] defined
    * [ ] undefined
    * [x] length / len
    * [x] minLength
    * [x] maxLength
    * [ ] or
    * [ ] optional
    * [ ] instanceof
    * [ ] lt
    * [ ] lte
    * [ ] gt
    * [ ] gte
    * [ ] generic (function)
  * [ ] number
    * [x] isNumber
    * [x] orString
    * [x] isFinite / finite
    * [x] isInfinite / infinite
    * [ ] isInteger
    * [x] value
    * [ ] minValue
    * [ ] maxValue
    * [ ] negative
    * [ ] positive
    * [ ] zero
    * [ ] within
  * [ ] string
    * [ ] empty
    * [ ] notEmpty / nonEmpty
    * [ ] within
    * [ ] beginsWith
    * [ ] contains
    * [ ] endsWith
    * [ ] matches
  * [ ] date
    * [ ] ...
  * [ ] rexexp
  * [ ] object
    * [ ] isPlain
    * [ ] Satisfy
    * [ ] ...
  * [ ] function
    * [ ] ...
  * [ ] error
    * [ ] message
  * [ ] promise
* [ ] Plugins system
* [ ] Build
* [ ] Noop
* [ ] Async
* [ ] Configure JSLint and clean up code
* [ ] Cover JSVerifier source with JSVerifier :metal:
