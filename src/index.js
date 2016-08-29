import Assertron       from './assertron'
import BaseAssertion   from './assertions/base'
import NumberAssertion from './assertions/number'
import StringAssertion from './assertions/string'

const assertron = new Assertron([
  BaseAssertion,
  NumberAssertion,
  StringAssertion,
])

export default assertron
export const assert = assertron.assert.bind(assertron)
