import assertions    from '../../../src/assertions';
import RootAssertion from '../../../src/assertions/root';
import ContractError from '../../../src/contract-error';

describe('root', () => {
  let root, or;

  beforeEach(() => {
    root = new RootAssertion({assertions});
    or   = root.or.bind(root);
  });

  describe('_validate', () => {

    it('should call _validate on child assertions and self', () => {
      const contract = {
        foo: 'Foo',
        bar: 'Bar',
        baz: 'Baz'
      };

      const fooSpy  = stub().returns([]);
      const barSpy  = stub().returns(true);
      root.baz = stub().returns(true);

      const assertions = {
        foo: spy(class Foo { _validate (...args) { return fooSpy(...args); }}),
        bar: spy(class Bar { _validate (...args) { return barSpy(...args); }})
      };

      const result = root._validate('victim', contract, assertions);

      expect(result).deep.equal([]);

      expect(fooSpy)
        .calledOnce
        .calledWithExactly('victim', 'Foo');

      expect(barSpy)
        .calledOnce
        .calledWithExactly('victim', 'Bar');

      expect(root.baz)
        .calledOnce
        .calledWithExactly('victim', 'Baz');

      expect(assertions.foo)
        .calledOnce
        .calledWithExactly(assertions);

      expect(assertions.bar)
        .calledOnce
        .calledWithExactly(assertions);
    });



    it('should return the failed assertion', () => {
      const contract = {
        foo: 'Foo',
        bar: 'Bar',
        baz: 'Baz'
      };

      const fooSpy  = stub().returns({message: 'Foo'});
      const barSpy  = stub().returns(true);
      root.baz = stub().returns({message: 'Bar'});

      const assertions = {
        foo: class Foo { _validate (...args) { return fooSpy(...args); }},
        bar: class Bar { _validate (...args) { return barSpy(...args); }}
      };

      const result = root._validate('victim', contract, assertions);

      expect(result.length).equal(2);
      expect(result[0]).deep.equal({message: 'Foo'});
      expect(result[1]).deep.equal({message: 'Bar'});
    });



    it('should throw on a missing assertion', () => {
      const contract = {
        foo: 'Foo'
      };

      expect( () => {
        root._validate('victim', contract, {});
      })
        .throw(Error, /does not exist/);
    });

  }); // _validate

  describe('or', () => {
    it('should return [] if at least one of assertions is fine', () => {
      const result = or('1', {number: true, string: true});
      expect(result).deep.equal([]);
    });

    it('should return [] if at all assertions are fine', () => {
      const result = or('1', {number: {orString: true}, string: true});
      expect(result).deep.equal([]);
    });

    it('should return errors if all assertions fail', () => {
      const result = or(true, {number: true, string: true});
      expect(result).length(2);
      expect(result[0]).instanceof(ContractError);
      expect(result[1]).instanceof(ContractError);
    });
  });
});
