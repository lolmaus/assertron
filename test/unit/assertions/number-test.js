import Number        from '../../../src/assertions/number';
import ContractError from '../../../src/contract-error';

describe('number', () => {

  let number;

  beforeEach(() => {
    number = new Number();
  });


  describe('isNumber', () => {

    it('should accept number', () => {
      expect(number.isNumber(5)).true;
      expect(number.isNumber(0)).true;
    });

    it('should reject string', () => {
      number._makeAssertionError = stub().returns('foo');
      expect(number.isNumber('5')).equal('foo');
      expect(number._makeAssertionError)
        .calledOnce
        .calledWithExactly('5', 'expected to be a number');
    });

  }); // main function


  describe('orString', () => {

    it('should accept number', () => {
      expect(number.orString(5)).true;
      expect(number.orString(0)).true;
    });


    it('should accept string', () => {
      expect(number.orString('5')).true;
      expect(number.orString('0')).true;
    });

    it('should reject string', () => {
      number._makeAssertionError = stub().returns('foo');
      expect(number.orString('zomg')  ).equal('foo');
      expect(number._makeAssertionError)
        .calledOnce
        .calledWithExactly('zomg', 'expected to be a number or a string containing a number');
    });

    it('should reject true', () => {
      number._makeAssertionError = stub().returns('foo');
      expect(number.orString(true)  ).equal('foo');
      expect(number._makeAssertionError)
        .calledOnce
        .calledWithExactly(true, 'expected to be a number or a string containing a number');
    });

  }); // main function


  describe('isFinite', () => {

    it('should accept finite number', () => {
      expect(number.isFinite(5)).true;
      expect(number.isFinite(0)).true;
    });

    it('should reject Infinity', () => {
      number._makeAssertionError = stub().returns('foo');
      expect(number.isFinite(Infinity)  ).equal('foo');
      expect(number._makeAssertionError)
        .calledOnce
        .calledWithExactly(Infinity, 'expected to be finite');
    });

    it('should reject -Infinity', () => {
      number._makeAssertionError = stub().returns('foo');
      expect(number.isFinite(-Infinity)  ).equal('foo');
      expect(number._makeAssertionError)
        .calledOnce
        .calledWithExactly(-Infinity, 'expected to be finite');
    });
  }); // main function


  describe('_validate', () => {

    describe('simple', () => {

      it('should accept number', () => {
        expect(number._validate(5, true)).eql([]);
        expect(number._validate(0, true)).eql([]);
      });

      it('should reject string', () => {
        const result = number._validate('5', true);

        expect(result)
          .instanceOf(Array)
          .length(1);

        expect(result[0]).instanceOf(ContractError);
        expect(result[0].message).equal('expected to be a number: 5');
      });

    }); // main function

    describe('orString', () => {

      it('should accept number', () => {
        expect(number._validate(5, {orString: true})).eql([]);
        expect(number._validate(0, {orString: true})).eql([]);
      });

      it('should accept number string', () => {
        expect(number._validate('5', {orString: true})).eql([]);
        expect(number._validate('0', {orString: true})).eql([]);
      });

      it('should reject non-number string', () => {
        const result = number._validate('asdf', {orString: true});

        expect(result)
          .instanceOf(Array)
          .length(1);

        expect(result[0]).instanceOf(ContractError);
        expect(result[0].message).equal('expected to be a number or a string containing a number: asdf');
      });

    }); // orString

    describe('isFinite', () => {

      it('should accept finite number', () => {
        expect(number._validate(5, {isFinite: true})).eql([]);
        expect(number._validate(0, {isFinite: true})).eql([]);
      });

      it('should reject infinity', () => {
        const result = number._validate(Infinity,  {isFinite: true});

        expect(result)
          .instanceOf(Array)
          .length(1);

        expect(result[0]).instanceOf(ContractError);
        expect(result[0].message).equal('expected to be finite: Infinity');
      });

    }); // isFinite

    describe('Combinations', () => {

      const contract = {
        isFinite: true,
        orString: true
      };

      it('should accept finite number', () => {
        expect(number._validate(5,   contract)).eql([]);
        expect(number._validate('5', contract)).eql([]);
      });

      it('should reject infinity', () => {
        const result = number._validate('Infinity', contract);

        expect(result)
          .instanceOf(Array)
          .length(1);

        expect(result[0]).instanceOf(ContractError);
        expect(result[0].message).equal('expected to be finite: Infinity');
      });

      it('should reject non-number string', () => {
        const result = number._validate('Infinity', {
          orString: true,
          isFinite: true,
          length:   2
        });

        expect(result)
          .instanceOf(Array)
          .length(2);

        expect(result[0]).instanceOf(ContractError);
        expect(result[0].message).equal('expected to be finite: Infinity');

        expect(result[1]).instanceOf(ContractError);
        expect(result[1].message).equal('expected to have length of 2: Infinity');
      });

    }); // isFinite
  }); // simmple
}); // number
