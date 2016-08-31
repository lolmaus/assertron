import Assertion from '../assertion'
import isString  from 'lodash/isString'

export default class BaseAssertion extends Assertion {

  _name = 'string'

  test__main (subject, contract) {
    if (isString(subject)) return

    return {
      message:  `Expected to be a string, got ${subject}`,
      expected: 'a string',
      actual:   subject
    }
  }
}
