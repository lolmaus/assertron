import assertions    from '../../../src/assertions';
import BaseAssertion from '../../../src/assertions/base';
import ContractError from '../../../src/contract-error';

describe('base', () => {
  let assertion;

  beforeEach(() => {
    assertion = new BaseAssertion(assertions);
  });

  describe('_makeAssertionError', () => {

    it('should call _validate on child assertions', () => {
      const foo = {
        toString () {return 'bar'}
      };
      const result = assertion._makeAssertionError(foo, 'baz');
      expect(result).instanceOf(ContractError);
      expect(result.message).equal('baz: bar');
    });

  }); // _makeAssertionError



  describe('_parseContract', () => {
    it('should call callbacks', () => {
      assertion.foo = stub().returns(true);
      assertion.bar = stub().returns(true);

      const contract = {
        foo: 'Foo',
        bar: 'Bar'
      };

      const result = assertion._parseContract('victim', contract);

      expect(result)
        .instanceOf(Array)
        .length(0);

      expect(assertion.foo)
        .calledOnce
        .calledWithExactly('victim', 'Foo');

      expect(assertion.bar)
        .calledOnce
        .calledWithExactly('victim', 'Bar');
    }); // should call callbacks


    it('should return both falsy results', () => {
      const assertion = new BaseAssertion(assertions);

      assertion.foo = stub().returns('FooError');
      assertion.bar = stub().returns('BarError');

      const contract = {
        foo: 'Foo',
        bar: 'Bar'
      };

      const result = assertion._parseContract('victim', contract);

      expect(result)
        .instanceOf(Array)
        .length(2)
        .members(['FooError', 'BarError']);
    }); // should return both falsy results


    it('should return one falsy result', () => {
      const assertion = new BaseAssertion(assertions);
      assertion.foo  = stub().returns(true);
      assertion.bar  = stub().returns('BarError');
      assertion.baz  = stub().returns(true);
      assertion.quux = stub().returns(true);

      const contract = {
        foo:  'Foo',
        bar:  'Bar',
        baz:  'Baz',
        quux: 'Quux'
      };

      const result = assertion._parseContract('victim', contract);

      expect(result)
        .instanceOf(Array)
        .length(1)
        .contains('BarError');

    }); // should return one falsy result


    it('should concat arrays', () => {
      const assertion = new BaseAssertion(assertions);
      assertion.foo  = stub().returns(true);
      assertion.bar  = stub().returns(['BarError1', 'BarError2']);
      assertion.baz  = stub().returns(true);
      assertion.quux = stub().returns(['QuuxError1', 'QuuxError2']);

      const contract = {
        foo:  'Foo',
        bar:  'Bar',
        baz:  'Baz',
        quux: 'Quux'
      };

      const result = assertion._parseContract('victim', contract);

      expect(result)
        .instanceOf(Array)
        .length(4)
        .members(['BarError1', 'BarError2', 'QuuxError1', 'QuuxError2']);

    }); // should return first falsy result, try 2
  }); // _parseContract



  describe('exactLength', () => {
    it('should report true for matching length', () => {
      expect(assertion.exactLength('asdf',    4)).true;
      expect(assertion.exactLength('',        0)).true;
      expect(assertion.exactLength([1, 2, 3], 3)).true;
    });

    it('should report error for non-matching length - string 1', () => {
      const result = assertion.exactLength('asdf', 5);
      expect(result).instanceOf(ContractError);
      expect(result.message).equal('expected to have length of 5: asdf');
    });

    it('should report error for non-matching length - string 2', () => {
      const result = assertion.exactLength('2', 2);
      expect(result).instanceOf(ContractError);
      expect(result.message).equal('expected to have length of 2: 2');
    });

    it('should report error for non-matching length - array', () => {
      const result = assertion.exactLength([1, 2, 3], 5);
      expect(result).instanceOf(ContractError);
      expect(result.message).equal('expected to have length of 5: 1,2,3');
    });


  });  // exactLength



  describe('minLength', () => {
    it('should report true for matching length', () => {
      expect(assertion.minLength('asdf',    4)).true;
      expect(assertion.minLength('',        0)).true;
      expect(assertion.minLength([1, 2, 3], 3)).true;
    });

    it('should report true for bigger length', () => {
      expect(assertion.minLength('asdf',    3)).true;
      expect(assertion.minLength([1, 2, 3], 2)).true;
    });

    it('should report error for smaller length - string', () => {
      const result = assertion.minLength('asdf', 5);
      expect(result).instanceOf(ContractError);
      expect(result.message).equal('expected to have min length of 5: asdf');
    });

    it('should report error for smaller length - array', () => {
      const result = assertion.minLength([1, 2, 3], 5);
      expect(result).instanceOf(ContractError);
      expect(result.message).equal('expected to have min length of 5: 1,2,3');
    });
  }); // minLength



  describe('maxLength', () => {
    it('should report true for matching length', () => {
      expect(assertion.maxLength('asdf',    4)).true;
      expect(assertion.maxLength('',        0)).true;
      expect(assertion.maxLength([1, 2, 3], 3)).true;
    });

    it('should report true for smaller length', () => {
      expect(assertion.maxLength('asdf',    5)).true;
      expect(assertion.maxLength([1, 2, 3], 4)).true;
    });

    it('should report error for smaller length - string', () => {
      const result = assertion.maxLength('asdf', 3);
      expect(result).instanceOf(ContractError);
      expect(result.message).equal('expected to have max length of 3: asdf');
    });

    it('should report error for smaller length - array', () => {
      const result = assertion.maxLength([1, 2, 3], 2);
      expect(result).instanceOf(ContractError);
      expect(result.message).equal('expected to have max length of 2: 1,2,3');
    });
  }); // maxLength



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
        minLength: stub().returns(true)
      };

      const result = fakeAssertion.length('bar', {min: 5});
      expect(result).true;
      expect(fakeAssertion.minLength)
        .calledOnce
        .calledWithExactly('bar', 5);
    });

    it('should call maxLength if passed an object with "max"', () => {
      const fakeAssertion = {
        length:    assertion.length,
        maxLength: stub().returns(true)
      };

      const result = fakeAssertion.length('bar', {max: 5});
      expect(result).true;
      expect(fakeAssertion.maxLength)
        .calledOnce
        .calledWithExactly('bar', 5);
    });

    it('should call minLength and maxLength if passed an object with "min" and "max" -- positive result', () => {
      const fakeAssertion = {
        length:    assertion.length,
        minLength: stub().returns(true),
        maxLength: stub().returns(true)
      };

      const result = fakeAssertion.length('baz', {min: 4, max: 5});

      expect(result).deep.equal(true);

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
        minLength: stub().returns('error'),
        maxLength: stub().returns(true)
      };

      const result = fakeAssertion.length('baz', {min: 4, max: 5});

      expect(result).equal('error');

      expect(fakeAssertion.minLength)
        .calledOnce
        .calledWithExactly('baz', 4);
    });

    it('should call minLength and maxLength if passed an object with "min" and "max" -- negative result in max', () => {
      const fakeAssertion = {
        length:    assertion.length,
        minLength: stub().returns(true),
        maxLength: stub().returns('error')
      };

      const result = fakeAssertion.length('baz', {min: 4, max: 5});

      expect(result).equal('error');

      expect(fakeAssertion.maxLength)
        .calledOnce
        .calledWithExactly('baz', 5);
    });

    it('should call minLength and maxLength if passed an object with "min" and "max" -- negative result in both', () => {
      const fakeAssertion = {
        length:    assertion.length,
        minLength: stub().returns('minError'),
        maxLength: stub().returns('maxError')
      };

      const result = fakeAssertion.length('baz', {min: 4, max: 5});

      expect(result)
        .instanceOf(Array)
        .length(2)
        .members(['minError', 'maxError']);

      expect(fakeAssertion.minLength)
        .calledOnce
        .calledWithExactly('baz', 4);

      expect(fakeAssertion.maxLength)
        .calledOnce
        .calledWithExactly('baz', 5);
    });
  }); // length



  describe('value', () => {
    it('should report true for strict equality', () => {
      expect(assertion.value('asdf',    'asdf')).true;
      expect(assertion.value('',        '')).true;
      expect(assertion.value(1,        1)).true;

      const foo = [];
      expect(assertion.value(foo, foo)).true;
    });

    it('should report error for strict inequality', () => {
      const result = assertion.value('asdf', 3);
      expect(result).instanceOf(ContractError);
      expect(result.message).equal('expected to be strictly equal to 3: asdf');
    });

    it('should report error for strict inequality', () => {
      const result = assertion.value([], []);
      expect(result).instanceOf(ContractError);
      expect(result.message).match(/expected to be strictly equal to/);
    });
  }); // value
});
