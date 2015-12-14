import Number from '../../../src/assertions/number';

describe('number', () => {

  let number;

  beforeEach(() => {
    number = new Number();
  });


  describe('isNumber', () => {

    it('should accept number', () => {
      expect(number.isNumber(5).result).true;
      expect(number.isNumber(0).result).true;
    });

    it('should reject string', () => {
      expect(number.isNumber('5')).eql({result: false, message: 'expected to be a number'});
      expect(number.isNumber('0')).eql({result: false, message: 'expected to be a number'});
    });

  }); // main function


  describe('orString', () => {

    it('should accept number', () => {
      expect(number.orString(5).result).true;
      expect(number.orString(0).result).true;
    });


    it('should accept string', () => {
      expect(number.orString('5').result).true;
      expect(number.orString('0').result).true;
    });

    it('should accept string', () => {
      expect(number.orString(true)  ).eql({result: false, message: 'expected to be a number or a string containing a number'});
      expect(number.orString('zomg')).eql({result: false, message: 'expected to be a number or a string containing a number'});
    });

  }); // main function


  describe('isFinite', () => {

    it('should accept finite number', () => {
      expect(number.isFinite(5).result).true;
      expect(number.isFinite(0).result).true;
    });

    it('should reject infinity', () => {
      expect(number.isFinite(Infinity) ).eql({result: false, message: 'expected to be finite'});
      expect(number.isFinite(-Infinity)).eql({result: false, message: 'expected to be finite'});
    });

  }); // main function


  describe('_main', () => {

    describe('simple', () => {

      it('should accept number', () => {
        expect(number._main(5).result).true;
        expect(number._main(0).result).true;
      });

      it('should reject string', () => {
        expect(number._main('5').result).false;
        expect(number._main('0').result).false;
      });

    }); // main function

    describe('orString', () => {

      it('should accept number', () => {
        expect(number._main(5, {orString: true}).result).true;
        expect(number._main(0, {orString: true}).result).true;
      });

      it('should accept string', () => {
        expect(number._main('5', {orString: true}).result).true;
        expect(number._main('0', {orString: true}).result).true;
      });

    }); // orString

    describe('isFinite', () => {

      it('should accept finite number', () => {
        expect(number._main(5, {isFinite: true}).result).true;
        expect(number._main(0, {isFinite: true}).result).true;
      });

      it('should reject infinity', () => {
        expect(number._main(Infinity,  {isFinite: true}).result).false;
        expect(number._main(-Infinity, {isFinite: true}).result).false;
      });

    }); // isFinite
  }); // simmple
}); // number
