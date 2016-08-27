import NumberAssertion from '../../../src/assertions/number'

describe('NumberAssertion', () => {
  describe('test: main', () => {
    const assertion = new NumberAssertion()

    it('should pass for a number', () => {
      expect(assertion.test__main(1))                      .undefined
      expect(assertion.test__main(0))                      .undefined
      expect(assertion.test__main(1.23))                   .undefined
      expect(assertion.test__main(Infinity))               .undefined
      expect(assertion.test__main(-Infinity))              .undefined
      expect(assertion.test__main(Number.MIN_VALUE))       .undefined
      expect(assertion.test__main(Number.MAX_VALUE))       .undefined
      expect(assertion.test__main(Number.MAX_SAFE_INTEGER)).undefined
    })

    it('should return object for a non-number', () => {
      expect(assertion.test__main(NaN)).eql({
        message:  'Expected to be a number, got NaN',
        expected: 'a number',
        actual:   NaN
      })

      expect(assertion.test__main("0")).eql({
        message:  'Expected to be a number, got 0',
        expected: 'a number',
        actual:   "0"
      })
    })
  })
})
