import isObject from 'lodash/isObject'
import flatten  from 'lodash/flatten'

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

  _iterateContract (contract, callback) {
    return Object
      .keys(contract)
      .map(assertionName => {
        const subContract = contract[assertionName]
        return callback(assertionName, subContract)
      })
      .filter(o => o)
  }

  _processContract (subject, contract) {
    if (!isObject(contract)) throw new Error("Assertron: assertion should be an object")

    const result =
      this._iterateContract(contract, (assertionName, subContract) => {
        const assertion   = this._getAssertion(assertionName)

        if (assertion) {
          return assertion.assert(subject, subContract)
        }

        const test = this._getTest(assertionName)

        if (!test) throw new Error(`Assertron: unknown assertion: ${assertionName}`)

        return test.call(this, subject, subContract)
      })

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

  test__or (subject, contract) {
    const result =
      this._iterateContract(contract, (assertionName, subContract) => {
        return this.assert(subject, {[assertionName]: subContract})
      })

    if (result.length !== Object.keys(contract).length) return

    return {
      message: "Expected at least one of given assertions to pass",
      errors:  flatten(result)
    }
  }
}
