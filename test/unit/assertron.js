import Assertron      from '../../src/assertron'
import BaseAssertion  from '../../src/assertions/base'
import AssertionError from 'assertion-error'

describe("Assertron class", () => {

  describe("method: constructor", () => {
    it("should include all assertions", () => {
      const theSpy = spy()
      class FakeAssertron extends Assertron {
        include () { return theSpy(...arguments) }
      }

      const assertron = new FakeAssertron(['foo', 'bar', 'baz'])

      expect(assertron).ok

      expect(theSpy).calledThrice
      expect(theSpy.firstCall).calledWithExactly('foo')
      expect(theSpy.secondCall).calledWithExactly('bar')
      expect(theSpy.thirdCall).calledWithExactly('baz')
    })
  })

  describe("method: include", () => {
    it("Should accept asesertions", () => {
      const assertron = new Assertron()
      assertron.include(BaseAssertion)
      const keys = Object.keys(assertron.assertions)
      expect(keys).length(1)
      const baseKey = keys[0]
      expect(baseKey).equal('base')
      expect(assertron.assertions[baseKey]).instanceof(BaseAssertion)
    })
  })

  describe("method: assert", () => {
    it("should call assert on BaseAssertion", () => {
      const theSpy = spy()
      class FakeBaseAssertion extends BaseAssertion {
        assert () { return theSpy.apply(this, arguments) }
      }
      const assertron = new Assertron([FakeBaseAssertion])
      assertron.assert('foo', 'bar')
      expect(theSpy)
        .calledOnce
        .calledWithExactly('foo', 'bar')
    })

    it("should call toss when baseAssertion.assert returns something", () => {
      class FakeBaseAssertion extends BaseAssertion {
        assert () { return 'baz' }
      }
      const assertron = new Assertron([FakeBaseAssertion])
      assertron.toss = spy()
      assertron.assert('foo', 'bar')
      expect(assertron.toss)
        .calledOnce
        .calledWithExactly('baz')
    })
  })

  describe("method: toss", () => {
    it("should throw an AssertionError", () => {
      const assertron = new Assertron()

      expect(() => {
        assertron.toss([{
          message:  "foo",
          expected: "bar",
          actual:   "baz"
        }])
      }).throw(AssertionError, /foo\nExpected: bar\nActual: baz/)
    })
  })

  describe("method: messageForErrorDef", () => {
    it("should build a message", () => {
      const assertron = new Assertron()
      const result = assertron.messageForErrorDef({
        message:  "foo",
        expected: "bar",
        actual:   "baz"
      })
      expect(result).equal(
`foo
Expected: bar
Actual: baz`
      )
    })
  })
})
