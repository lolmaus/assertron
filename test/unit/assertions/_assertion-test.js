import Assertion from '../../../src/assertions/_assertion';

describe('Assertion', () => {
  let assertion;

  beforeEach(() => {
    assertion = new Assertion();
  });

  describe('_parseContract', () => {
    it('should call callbacks', () => {
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

  describe('exactLength', () => {
    it('should report true for matching length', () => {
      expect(assertion.exactLength('asdf',    4).result).ok;
      expect(assertion.exactLength('',        0).result).ok;
      expect(assertion.exactLength([1, 2, 3], 3).result).ok;
    });

    it('should report false for non-matching length - string', () => {
      const result = assertion.exactLength('asdf', 5);
      expect(result.result).not.ok;
      expect(result.message).equal('expected to have length of 5');
    });

    it('should report false for non-matching length - array', () => {
      const result = assertion.exactLength([1, 2, 3], 5);
      expect(result.result).not.ok;
      expect(result.message).equal('expected to have length of 5');
    });


  });

  describe('minLength', () => {
    it('should report true for matching length', () => {
      expect(assertion.minLength('asdf',    4).result).ok;
      expect(assertion.minLength('',        0).result).ok;
      expect(assertion.minLength([1, 2, 3], 3).result).ok;
    });

    it('should report true for bigger length', () => {
      expect(assertion.minLength('asdf',    3).result).ok;
      expect(assertion.minLength([1, 2, 3], 2).result).ok;
    });

    it('should report false for smaller length - string', () => {
      const result = assertion.minLength('asdf', 5);
      expect(result.result).not.ok;
      expect(result.message).equal('expected to have length of 5');
    });

    it('should report false for smaller length - array', () => {
      const result = assertion.minLength([1, 2, 3], 5);
      expect(result.result).not.ok;
      expect(result.message).equal('expected to have length of 5');
    });
  });

  describe('maxLength', () => {
    it('should report true for matching length', () => {
      expect(assertion.maxLength('asdf',    4).result).ok;
      expect(assertion.maxLength('',        0).result).ok;
      expect(assertion.maxLength([1, 2, 3], 3).result).ok;
    });

    it('should report true for smaller length', () => {
      expect(assertion.maxLength('asdf',    5).result).ok;
      expect(assertion.maxLength([1, 2, 3], 4).result).ok;
    });

    it('should report false for smaller length - string', () => {
      const result = assertion.maxLength('asdf', 3);
      expect(result.result).not.ok;
      expect(result.message).equal('expected to have length of 3');
    });

    it('should report false for smaller length - array', () => {
      const result = assertion.maxLength([1, 2, 3], 2);
      expect(result.result).not.ok;
      expect(result.message).equal('expected to have length of 2');
    });
  });

  describe('length', () => {
    it('should call exactLength if passed a number', () => {
      const fakeAssertion = {
        length:      assertion.length,
        exactLength: stub().returns('foo')
      };

      const result = fakeAssertion.length('bar', 5);
      expect(result).equal('foo');
      expect(fakeAssertion.exactLength)
        .calledOnce
        .calledWithExactly('bar', 5);
    });

    it('should call minLength if passed an object with "min"', () => {
      const fakeAssertion = {
        length:    assertion.length,
        minLength: stub().returns({result: true})
      };

      const result = fakeAssertion.length('bar', {min: 5});
      expect(result).deep.equal({result: true});
      expect(fakeAssertion.minLength)
        .calledOnce
        .calledWithExactly('bar', 5);
    });

    it('should call maxLength if passed an object with "max"', () => {
      const fakeAssertion = {
        length:    assertion.length,
        maxLength: stub().returns({result: true})
      };

      const result = fakeAssertion.length('bar', {max: 5});
      expect(result).deep.equal({result: true});
      expect(fakeAssertion.maxLength)
        .calledOnce
        .calledWithExactly('bar', 5);
    });

    it('should call minLength and maxLength if passed an object with "min" and "max" -- positive result', () => {
      const fakeAssertion = {
        length:    assertion.length,
        minLength: stub().returns({result: true}),
        maxLength: stub().returns({result: true})
      };

      const result = fakeAssertion.length('baz', {min: 4, max: 5});

      expect(result).deep.equal({result: true});

      expect(fakeAssertion.minLength)
        .calledOnce
        .calledWithExactly('baz', 4);

      expect(fakeAssertion.maxLength)
        .calledOnce
        .calledWithExactly('baz', 5);
    });

    it('should call minLength and maxLength if passed an object with "min" and "max" -- negative result in min', () => {
      const fakeAssertion = {
        length:    assertion.length,
        minLength: stub().returns({result: false, message: 'foo'}),
        maxLength: stub().returns({result: true})
      };

      const result = fakeAssertion.length('baz', {min: 4, max: 5});

      expect(result).deep.equal({result: false, message: 'foo'});

      expect(fakeAssertion.minLength)
        .calledOnce
        .calledWithExactly('baz', 4);
    });

    it('should call minLength and maxLength if passed an object with "min" and "max" -- negative result in max', () => {
      const fakeAssertion = {
        length:    assertion.length,
        minLength: stub().returns({result: true}),
        maxLength: stub().returns({result: false, message: 'foo'})
      };

      const result = fakeAssertion.length('baz', {min: 4, max: 5});

      expect(result).deep.equal({result: false, message: 'foo'});

      expect(fakeAssertion.maxLength)
        .calledOnce
        .calledWithExactly('baz', 5);
    });
  });
});
