import AssertionError from 'assertion-error'

export default class Assertron {

  assertions = {}

  baseAssertionName = 'base'

  constructor (assertionClasses) {
    if (assertionClasses) {
      assertionClasses.forEach(AssertionClass => {
        this.include(AssertionClass)
      })
    }
  }

  include (SomeAssertion) {
    const assertion = new SomeAssertion(this.assertions)

    const name = assertion._name

    if (!name) {
      throw new Error("Assertron: Assertion must have a name")
    }

    this.assertions[name] = assertion
  }

  assert (subject, contract) {
    const baseAssertion = this.assertions[this.baseAssertionName]
    const errorDefs = baseAssertion.assert(subject, contract)

    if (!errorDefs) return

    this.toss(errorDefs)
  }

  toss (errorDefs) {
    const message =
      errorDefs
        .map(errorDef => this.messageForErrorDef(errorDef))
        .join('\n\n')

    throw new AssertionError(message)
  }

  messageForErrorDef ({message, expected, actual}) {
    return `${message}\nExpected: ${expected}\nActual: ${actual}`
  }
}
