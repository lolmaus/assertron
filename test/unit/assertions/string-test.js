import assertions      from '../../../src/assertions';
import StringAssertion from '../../../src/assertions/string';
import ContractError   from '../../../src/contract-error';

describe('string', () => {

  let string;

  beforeEach(() => {
    string = new StringAssertion(assertions);
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
      expect(string._validate('foo', true)).eql([]);
      expect(string._validate('12' , true)).eql([]);
      expect(string._validate('',    true)).eql([]);
    });

    it('simple contract, should reject non-string', () => {
      const result = string._validate(5,  true);
      expect(result).instanceOf(Array).length(1);
      expect(result[0]).instanceOf(ContractError);
      expect(result[0].message).equal('expected to be a string: 5');
    });

    it('simple contract, should reject string of non-matching length', () => {
      const result = string._validate('5',  {length: 2});
      expect(result).instanceOf(Array).length(1);
      expect(result[0]).instanceOf(ContractError);
      expect(result[0].message).match(/length/);
    });

  }); // main
}); // number
