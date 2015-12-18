import RootAssertion from '../../../src/assertions/root';

describe('base', () => {
  let assertion;

  beforeEach(() => {
    assertion = new RootAssertion();
  });

  describe('_validate', () => {

    it('should call _validate on child assertions and self', () => {
      const contract = {
        foo: 'Foo',
        bar: 'Bar',
        baz: 'Baz'
      };

      const fooSpy  = stub().returns(true);
      const barSpy  = stub().returns(true);
      assertion.baz = stub().returns(true);

      const assertions = {
        foo: class Foo { _validate (...args) { return fooSpy(...args); }},
        bar: class Bar { _validate (...args) { return barSpy(...args); }}
      };

      const result = assertion._validate('victim', contract, assertions);

      expect(result).deep.equal([]);

      expect(fooSpy)
        .calledOnce
        .calledWithExactly('victim', 'Foo');

      expect(barSpy)
        .calledOnce
        .calledWithExactly('victim', 'Bar');

      expect(assertion.baz)
        .calledOnce
        .calledWithExactly('victim', 'Baz');
    });



    it('should return the failed assertion', () => {
      const contract = {
        foo: 'Foo',
        bar: 'Bar',
        baz: 'Baz'
      };

      const fooSpy  = stub().returns({message: 'Foo'});
      const barSpy  = stub().returns(true);
      assertion.baz = stub().returns({message: 'Bar'});

      const assertions = {
        foo: class Foo { _validate (...args) { return fooSpy(...args); }},
        bar: class Bar { _validate (...args) { return barSpy(...args); }}
      };

      const result = assertion._validate('victim', contract, assertions);

      expect(result.length).equal(2);
      expect(result[0]).deep.equal({message: 'Foo'});
      expect(result[1]).deep.equal({message: 'Bar'});
    });



    it('should throw on a missing assertion', () => {
      const contract = {
        foo: 'Foo'
      };

      expect( () => {
        assertion._validate('victim', contract, {});
      })
        .throw(Error);
    });

  });
});
