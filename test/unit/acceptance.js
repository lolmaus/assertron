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

  })
})
