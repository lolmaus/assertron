import assertions    from '../../../src/assertions';
import BaseAssertion from '../../../src/assertions/base';
import ContractError from '../../../src/contract-error';

describe('base', () => {
  let base, or;

  beforeEach(() => {
    base = new BaseAssertion({assertions});
    or   = base.or.bind(base);
  });

  describe('_makeAssertionError', () => {

    it('should call _validate on child assertions', () => {
      const foo = {
        toString () {return 'bar'}
      };
      const result = base._makeAssertionError(foo, 'baz');
      expect(result).instanceOf(ContractError);
      expect(result.message).equal('baz: bar');
    });

  }); // _makeAssertionError



  describe('_parseContract', () => {
    it('should call callbacks', () => {
      base.foo = stub().returns(true);
      base.bar = stub().returns(true);

      const contract = {
        foo: 'Foo',
        bar: 'Bar'
      };

      const result = base._parseContract('victim', contract);

      expect(result)
        .instanceOf(Array)
        .length(0);

      expect(base.foo)
        .calledOnce
        .calledWithExactly('victim', 'Foo');

      expect(base.bar)
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
      expect(base.exactLength('asdf',    4)).true;
      expect(base.exactLength('',        0)).true;
      expect(base.exactLength([1, 2, 3], 3)).true;
    });

    it('should report error for non-matching length - string 1', () => {
      const result = base.exactLength('asdf', 5);
      expect(result).instanceOf(ContractError);
      expect(result.message).equal('expected to have length of 5: asdf');
    });

    it('should report error for non-matching length - string 2', () => {
      const result = base.exactLength('2', 2);
      expect(result).instanceOf(ContractError);
      expect(result.message).equal('expected to have length of 2: 2');
    });

    it('should report error for non-matching length - array', () => {
      const result = base.exactLength([1, 2, 3], 5);
      expect(result).instanceOf(ContractError);
      expect(result.message).equal('expected to have length of 5: 1,2,3');
    });


  });  // exactLength



  describe('minLength', () => {
    it('should report true for matching length', () => {
      expect(base.minLength('asdf',    4)).true;
      expect(base.minLength('',        0)).true;
      expect(base.minLength([1, 2, 3], 3)).true;
    });

    it('should report true for bigger length', () => {
      expect(base.minLength('asdf',    3)).true;
      expect(base.minLength([1, 2, 3], 2)).true;
    });

    it('should report error for smaller length - string', () => {
      const result = base.minLength('asdf', 5);
      expect(result).instanceOf(ContractError);
      expect(result.message).equal('expected to have min length of 5: asdf');
    });

    it('should report error for smaller length - array', () => {
      const result = base.minLength([1, 2, 3], 5);
      expect(result).instanceOf(ContractError);
      expect(result.message).equal('expected to have min length of 5: 1,2,3');
    });
  }); // minLength



  describe('maxLength', () => {
    it('should report true for matching length', () => {
      expect(base.maxLength('asdf',    4)).true;
      expect(base.maxLength('',        0)).true;
      expect(base.maxLength([1, 2, 3], 3)).true;
    });

    it('should report true for smaller length', () => {
      expect(base.maxLength('asdf',    5)).true;
      expect(base.maxLength([1, 2, 3], 4)).true;
    });

    it('should report error for smaller length - string', () => {
      const result = base.maxLength('asdf', 3);
      expect(result).instanceOf(ContractError);
      expect(result.message).equal('expected to have max length of 3: asdf');
    });

    it('should report error for smaller length - array', () => {
      const result = base.maxLength([1, 2, 3], 2);
      expect(result).instanceOf(ContractError);
      expect(result.message).equal('expected to have max length of 2: 1,2,3');
    });
  }); // maxLength



  describe('length', () => {
    it('should call exactLength if passed a number', () => {
      const fakeAssertion = {
        length:      base.length,
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
        length:    base.length,
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
        length:    base.length,
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
        length:    base.length,
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
        length:    base.length,
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
        length:    base.length,
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
        length:    base.length,
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
      expect(base.value('asdf',    'asdf')).true;
      expect(base.value('',        '')).true;
      expect(base.value(1,        1)).true;

      const foo = [];
      expect(base.value(foo, foo)).true;
    });

    it('should report error for strict inequality', () => {
      const result = base.value('asdf', 3);
      expect(result).instanceOf(ContractError);
      expect(result.message).equal('expected to be strictly equal to 3: asdf');
    });

    it('should report error for strict inequality', () => {
      const result = base.value([], []);
      expect(result).instanceOf(ContractError);
      expect(result.message).match(/expected to be strictly equal to/);
    });
  }); // value



  describe('_validate', () => {

    it('should call _validate on child assertions and self', () => {
      const contract = {
        foo: 'Foo',
        bar: 'Bar',
        baz: 'Baz'
      };

      const fooSpy  = stub().returns([]);
      const barSpy  = stub().returns(true);
      base.baz = stub().returns(true);

      const assertions = {
        foo: spy(class Foo { _validate (...args) { return fooSpy(...args); }}),
        bar: spy(class Bar { _validate (...args) { return barSpy(...args); }})
      };

      const result = base._validate('victim', contract, assertions);

      expect(result).deep.equal([]);

      expect(fooSpy)
        .calledOnce
        .calledWithExactly('victim', 'Foo');

      expect(barSpy)
        .calledOnce
        .calledWithExactly('victim', 'Bar');

      expect(base.baz)
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
      base.baz = stub().returns({message: 'Bar'});

      const assertions = {
        foo: class Foo { _validate (...args) { return fooSpy(...args); }},
        bar: class Bar { _validate (...args) { return barSpy(...args); }}
      };

      const result = base._validate('victim', contract, assertions);

      expect(result.length).equal(2);
      expect(result[0]).deep.equal({message: 'Foo'});
      expect(result[1]).deep.equal({message: 'Bar'});
    });



    it('should throw on a missing assertion', () => {
      const contract = {
        foo: 'Foo'
      };

      expect( () => {
        base._validate('victim', contract, {});
      })
        .throw(Error, /does not exist/);
    });


    describe('optional', () => {
      it('should allow undefined', () => {
        const result =
          base._validate(undefined, {
            optional: true,
            string:   true
          });

        expect(result).instanceof(Array).length(0);
      });



      it(' should not block other checks', () => {
        const result =
          base._validate(5, {
            optional: true,
            string:   true
          });

        expect(result).instanceof(Array).length(1);
        expect(result[0]).instanceof(ContractError);
        expect(result[0].message).match(/string/)
      });
    }); // optional
  }); // _validate



  describe('or', () => {
    it('should return [] if at least one of assertions is fine', () => {
      const result = or('1', {number: true, string: true});
      expect(result).deep.equal([]);
    });

    it('should combine base and child assertions', () => {
      const result = or('1', {number: true, string: true, value: '1'});
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
  }); // or
});
