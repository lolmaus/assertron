import Assertron       from './assertron'
import BaseAssertion   from './assertions/base'
import NumberAssertion from './assertions/number'

const assertron = new Assertron([
  BaseAssertion,
  NumberAssertion
])

export default assertron
export const assert = assertron.assert.bind(assertron)
