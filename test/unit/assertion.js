import BaseAssertion from '../../src/assertions/base'

describe('Assertion class', () => {

  describe('method: constructor', () => {
    it('should save first argument to this.assertions hash', () => {
      const assertion = new BaseAssertion('foo')
      expect(assertion.assertions).equal('foo')
    })
  })



  describe('method: assert', () => {
    it('should call main assertion if it exists', () => {
      const assertion = new BaseAssertion()
      const contract  = {}
      assertion.test__main = spy()
      assertion.assert('foo', contract)
      expect(assertion.test__main)
        .calledOnce
        .calledWithExactly('foo', contract)
    })

    it("should return result if test__main result is truthy", () => {
      const assertion = new BaseAssertion()
      assertion.test__main = () => 'foo'
      const result = assertion.assert()
      expect(result).equal('foo')
    })

    it("should not return result if test__main result is not truthy", () => {
      const assertion = new BaseAssertion()
      assertion.test__main = () => false
      const result = assertion.assert('foo', {})
      expect(result).not.false
    })

    it("if test__main result is empty, it should return the result of _processContract", () => {
      const assertion = new BaseAssertion()
      assertion._processContract = stub().returns('baz')
      const contract = {}
      const result = assertion.assert("foo", contract)
      expect(assertion._processContract)
        .calledOnce
        .calledWithExactly('foo', contract)
      expect(result).equal('baz')
    })

    it("should not run _processContract if subcontract is not an object", () => {
      const assertion = new BaseAssertion()
      assertion._processContract = spy()
      assertion.test__main = () => {}
      assertion.assert('foo', true)
      expect(assertion._processContract).not.called
    })
  })



  describe("method: _getAssertion", () => {
    it('should return nothing if called with current name', () => {
      const assertion = new BaseAssertion({base: 'foo'})
      expect(assertion._name, "BaseAssertion _name").equal("base")
      const result = assertion._getAssertion('base')
      expect(result).undefined
    })

    it('should return assertion', () => {
      const assertion = new BaseAssertion({foo: 'bar'})
      const result = assertion._getAssertion('foo')
      expect(result).equal('bar')
    })
  })



  describe("method: _getTest", () => {
    it('should return given test', () => {
      const assertion = new BaseAssertion()
      assertion.test__foo = 'bar'
      const result = assertion._getTest('foo')
      expect(result).equal('bar')
    })
  })



  describe("method: _processContract", () => {
    it("should error out if contract is not an object", () => {
      const assertion = new BaseAssertion()
      const error     = /Assertron: assertion should be an object/
      expect(() => assertion._processContract('foo'))       .throw(error)
      expect(() => assertion._processContract('foo', 'bar')).throw(error)
      expect(() => assertion._processContract('foo', 1))    .throw(error)
      expect(() => assertion._processContract('foo', null)) .throw(error)
    })

    it("should call corresponding assertion's assert if it exists", () => {
      const fooAssertion  = new BaseAssertion()
      fooAssertion._name  = 'foo'
      fooAssertion.assert = stub().returns('bar')
      const assertion     = new BaseAssertion({foo: fooAssertion})
      const contract      = {foo: {zomg: 'lol'}}
      const result        = assertion._processContract('baz', contract)
      expect(result).eql(['bar'])
      expect(fooAssertion.assert)
        .calledOnce
        .calledWithExactly('baz', contract.foo)
    })

    it("should call a test method on self if corresponding assertion does not exist", () => {
      const assertion     = new BaseAssertion()
      assertion.test__foo = stub().returns('bar')
      const contract      = {foo: {}}
      const result        = assertion._processContract('baz', contract)
      expect(result).eql(['bar'])
      expect(assertion.test__foo)
        .calledOnce
        .calledWithExactly('baz', contract.foo)
    })

    it("should crash on unknown assertion/test", () => {
      const assertion     = new BaseAssertion()
      const contract      = {foo: {}}
      expect(() => assertion._processContract('baz', contract))
        .throw('Assertron: unknown assertion: foo')
    })

    it("should compact the result", () => {
      const fooAssertion  = new BaseAssertion()
      fooAssertion._name  = 'foo'
      fooAssertion.assert = () => 'baz'
      const assertion     = new BaseAssertion({foo: fooAssertion})
      assertion.test__bar = () => {}
      const contract      = {foo: {}, bar: {}}
      const result        = assertion._processContract('quux', contract)
      expect(result).eql(['baz'])
    })

    it("should return nothing on successful assertion", () => {
      const fooAssertion  = new BaseAssertion()
      fooAssertion._name  = 'foo'
      fooAssertion.assert = () => {}
      const assertion     = new BaseAssertion({foo: fooAssertion})
      assertion.test__bar = () => {}
      const contract      = {foo: {}, bar: {}}
      const result        = assertion._processContract('quux', contract)
      expect(result).undefined
    })
  })



  describe("method: _iterateContract", () => {
    it("should map subject using the callback, then filter out nully values", () => {
      const assertion  = new BaseAssertion()
      const contract   = {foo: 1, bar: 2, baz: 3, quux: 4}
      const callback   = spy((name, value) => (value >= 3) ? name + value : null)
      const result     = assertion._iterateContract(contract, callback)
      expect(result).eql(['baz3', 'quux4'])
      expect(callback).callCount(4)
      expect(callback.withArgs('foo',  1)).calledOnce
      expect(callback.withArgs('bar',  2)).calledOnce
      expect(callback.withArgs('baz',  3)).calledOnce
      expect(callback.withArgs('quux', 4)).calledOnce
    })
  })



  describe("test: main", () => {
    it("should be a noop", () => {
      const assertion = new BaseAssertion()
      const result    = assertion.test__main()
      expect(result).undefined
    })
  })



  describe("test: is", () => {
    it("should return nothing for passing test", () => {
      const assertion = new BaseAssertion()
      const result    = assertion.test__is(1, 1)
      expect(result).undefined
    })

    it("should return error object for failing test", () => {
      const assertion = new BaseAssertion()
      const result    = assertion.test__is(1, 2)
      expect(result).eql({
        message:  "Expected 2, got 1",
        expected: 2,
        actual:   1
      })
    })
  })



  describe("test: or", () => {
    it("should return nothing when both tests passed", () => {
      const assertion = new BaseAssertion()
      assertion.test__foo = () => {}
      assertion.test__bar = () => {}
      const result  = assertion.test__or(1, {foo: true, bar: true})
      expect(result).undefined
    })

    it("should return nothing when one of tests passed", () => {
      const assertion = new BaseAssertion()
      assertion.test__foo = () => {}
      assertion.test__bar = () => ({message: "lol"})
      const result        = assertion.test__or(1, {foo: true, bar: true})
      expect(result).undefined
    })

    it("should return error object when none of tests passed", () => {
      const assertion = new BaseAssertion()
      assertion.test__foo = () => ({message: "lolfoo"})
      assertion.test__bar = () => ({message: "lolbar"})
      const result        = assertion.test__or(1, {foo: true, bar: true})
      expect(result).eql({
        message: "Expected at least one of given assertions to pass",
        errors:  [{message: "lolfoo"}, {message: "lolbar"}]
      })
    })
  })
})
