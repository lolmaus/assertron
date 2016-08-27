assertron
=========

Run assertions against your objects. Define contracts with a handy DSL. Test your code inline.

[![Travis build status](http://img.shields.io/travis/lolmaus/assertron.svg?style=flat)](https://travis-ci.org/lolmaus/assertron)
[![Code Climate](https://codeclimate.com/github/lolmaus/assertron/badges/gpa.svg)](https://codeclimate.com/github/lolmaus/assertron)
[![Test Coverage](https://codeclimate.com/github/lolmaus/assertron/badges/coverage.svg)](https://codeclimate.com/github/lolmaus/assertron)
[![Dependency Status](https://david-dm.org/lolmaus/assertron.svg)](https://david-dm.org/lolmaus/assertron)
[![devDependency Status](https://david-dm.org/lolmaus/assertron/dev-status.svg)](https://david-dm.org/lolmaus/assertron#info=devDependencies)



Idea
----

Assertron lets you run assertions against objects via a convenient DSL:

```js
import {assert as A} from 'assertron';

function myFunc(foo, bar) {
  A(foo, {object: true});

  A(bar, {
    optional: true,
    or: {
      number: {
        min: 3,
        max: 10,
        orString: true
      },
      function: true
    }
  })


  /* Your function's code here */
}
```

