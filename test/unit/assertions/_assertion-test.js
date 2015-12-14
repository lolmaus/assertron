import Assertion from '../../../src/assertions/_assertion';

describe('Assertion', () => {
  describe('_parseContract', () => {
    it('should call callbacks', () => {
      const assertion = new Assertion();
      assertion.foo = stub().returns({result: true});
      assertion.bar = stub().returns({result: true});

      const contract = {
        foo: 'Foo',
        bar: 'Bar'
      };

      const result = assertion._parseContract('victim', contract);

      expect(result && result.result).true;

      expect(assertion.foo)
        .calledOnce
        .calledWithExactly('victim', 'Foo');

      expect(assertion.bar)
        .calledOnce
        .calledWithExactly('victim', 'Bar');
    });

    it('should return first falsy result, try 1', () => {
      const assertion = new Assertion();
      assertion.foo = stub().returns({result: false, message: 'FOO'});
      assertion.bar = stub().returns({result: true});

      const contract = {
        foo: 'Foo',
        bar: 'Bar'
      };

      const result = assertion._parseContract('victim', contract);
      expect(result).eql({result: false, message: 'FOO'});
    });

    it('should return first falsy result, try 2', () => {
      const assertion = new Assertion();
      assertion.foo = stub().returns({result: true});
      assertion.bar = stub().returns({result: false, message: 'BAR'});

      const contract = {
        foo: 'Foo',
        bar: 'Bar'
      };

      const result = assertion._parseContract('victim', contract);
      expect(result).eql({result: false, message: 'BAR'});
    });
  });
});
