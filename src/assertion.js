import pipe from './utils/pipe'

import isObject from 'lodash/isObject'
import map      from 'lodash/map'
import compact  from 'lodash/compact'

export default class Assertion {

  _name      = undefined
  assertions = {}

  constructor (assertions) {
    if (assertions) this.assertions = assertions
  }

  assert (subject, contract) {
    let result = this.test__main(subject, contract)

    if (result) return result

    if (!isObject(contract)) return

    return this._processContract(subject, contract)
  }

  _getAssertion (assertionName) {
    if (assertionName === this._name) return
    return this.assertions[assertionName]
  }

  _getTest (testName) {
    const methodName = `test__${testName}`
    return this[methodName]
  }

  _processContract (subject, contract) {
    if (!isObject(contract)) throw new Error("Assertron: assertion should be an object")

    const result =
      pipe()(
        () => map(contract, (subContract, assertionName) => {
          const assertion = this._getAssertion(assertionName)

          if (assertion) {
            return assertion.assert(subject, subContract)
          }

          const test = this._getTest(assertionName)

          if (!test) throw new Error(`Assertron: unknown assertion: ${assertionName}`)

          return test.call(this, subject, subContract)
        }),
        compact
      )

    if (result.length) return result
  }

  test__main () {}

  test__is (actual, expected) {
    if (actual === expected) return

    return {
      message:  `Expected ${expected}, got ${actual}`,
      expected,
      actual
    }
  }
}
