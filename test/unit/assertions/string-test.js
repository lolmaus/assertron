import StringAssertion from '../../../src/assertions/string';
import ContractError from '../../../src/contract-error';

describe('string', () => {

  let string;

  beforeEach(() => {
    string = new StringAssertion();
  });


  describe('isString', () => {

    it('should accept string', () => {
      expect(string.isString('foo')).true;
      expect(string.isString('12')) .true;
      expect(string.isString(''))   .true;
    });

    it('should reject number', () => {
      const result = string.isString(5);
      expect(result).instanceOf(ContractError);
      expect(result.message).equal('expected to be a string: 5');
    });

  }); // isString


  describe('_validate', () => {

    it('simple contract, should accept string', () => {
      expect(string._validate('foo', true)).true;
      expect(string._validate('12' , true)).true;
      expect(string._validate('',    true)).true;
    });

    it('simple contract, should reject non-string', () => {
      const result = string._validate(5,  true);
      expect(result).instanceOf(ContractError);
      expect(result.message).equal('expected to be a string: 5');
    });

  }); // main
}); // number
