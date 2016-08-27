import Assertion from '../assertion'
import isNumber  from 'lodash/isNumber'
import isNaN     from 'lodash/isNaN'

export default class BaseAssertion extends Assertion {

  _name = 'number'

  test__main (subject, contract) {
    if (isNumber(subject) && !isNaN(subject)) return

    return {
      message:  `Expected to be a number, got ${subject}`,
      expected: 'a number',
      actual:   subject
    }
  }
}
