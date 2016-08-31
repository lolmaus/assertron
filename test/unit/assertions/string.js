import StringAssertion from '../../../src/assertions/string'

describe('StringAssertion', () => {
  describe('test: main', () => {
    const assertion = new StringAssertion()

    it('should pass for a string', () => {
      expect(assertion.test__main("foo")) .undefined
      expect(assertion.test__main(""))    .undefined
      expect(assertion.test__main("1"))   .undefined
      expect(assertion.test__main("1.23")).undefined
    })

    it('should return object for a non-string', () => {
      expect(assertion.test__main(1)).eql({
        message:  'Expected to be a string, got 1',
        expected: 'a string',
        actual:   1
      })
    })
  })
})
