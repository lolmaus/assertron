import {assert} from '../../src/index'
import AssertionError from 'assertion-error'

describe('assertron', () => {
  describe('Smoke test', () => {

    it('should not fail test', () => {
      assert(1, {is: 1})
    })

    it('should fail test', () => {
      expect(() => {
        assert(1, {is: 2})
      }).throw(AssertionError, /Expected 2, got 1\nExpected: 2\nActual: 1/)
    })

    it('should not fail assertion', () => {
      assert(1, {number: true})
    })

    it('should fail assertion', () => {
      expect(() => {
        assert("1", {number: true})
      }).throw(AssertionError, /Expected to be a number, got 1/)
    })

    it('or pass', () => {
      assert(1, {
        or: {
          number: true,
          string: true
        }
      })
    })

    it('or fail', () => {
      expect(() => assert(new Date(), {
        or: {
          number: true,
          string: true
        }
      })).throw(/Expected at least one of given assertions to pass/)
    })

    // it("optional pass", () => {
    //   assert(null, {
    //     number:   true,
    //     optional: true
    //   })
    // })
    //
    // it('optional fail', () => {
    //   expect(() => assert("1", {
    //     or: {
    //       number:   true,
    //       optional: true
    //     }
    //   })).throw(/Expected to be a number, got 1/)
    // })

  })
})
