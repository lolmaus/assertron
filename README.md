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
    * [ ] length
    * [ ] value
    * [ ] or
    * [ ] optional
    * [ ] instanceof
    * [ ] ...
  * [ ] number
    * [x] isNumber
    * [x] orString
    * [x] isFinite
    * [ ] isInteger
    * [ ] value
    * [ ] minValue
    * [ ] maxValue
    * [ ] lt
    * [ ] lte
    * [ ] gt
    * [ ] gte
    * [ ] ...
  * [ ] string
    * [ ] ...
  * [ ] date
    * [ ] ...
  * [ ] rexexp
  * [ ] object
    * [ ] isPlain
    * [ ] ...
  * [ ] function
    * [ ] ...
* [ ] Plugins system
* [ ] Chai integration
* [ ] Build
* [ ] Noop
* [ ] Configure JSLint and clean up code
* [ ] Cover JSVerifier source with JSVerifier :metal:
