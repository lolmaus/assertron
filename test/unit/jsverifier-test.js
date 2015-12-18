import V               from '../../src/jsverifier';
//import BaseAssertion   from '../../src/assertions/base';
import ContractError   from '../../src/contract-error';
//import AssertionError  from 'assertion-error';



//describe('JSVerifier', () => {
//  let jsverifier;
//
//  beforeEach(() => {
//    jsverifier = new JSVerifier();
//  });
//
//
//
//
//  describe('assert', () => {
//
//    const assertions = {
//      foosertion: class Foosertion extends BaseAssertion {
//        _validate(victim, contract) {
//          return {
//            result:  true,
//            message: "doesn't matter"
//          };
//        }
//      },
//
//      barsertion: class Barsertion extends BaseAssertion {
//        _validate(victim, contract) {
//          return {
//            result:  false,
//            message: "doesn't matter"
//          };
//        }
//      }
//    };
//
//    it('should work', () => {
//      jsverifier.assert('victim', 'foosertion', 'contract', assertions);
//    });
//
//    it('should throw', () => {
//      expect(() => {
//        jsverifier.assert('victim', 'barsertion', 'contract', assertions);
//      }).throws(ContractError);
//    });
//
//  }); // assert
//
//
//
//  describe('validate', () => {
//    it('should work', () => {
//      stub(jsverifier, 'assert');
//
//      const contract = {
//        foo: 'Foo',
//        bar: 'Bar'
//      };
//
//      const result = jsverifier.validate('victim', contract);
//
//      expect(result).ok;
//
//      expect(jsverifier.assert)
//        .calledTwice
//        .calledWithExactly('victim', 'foo', 'Foo')
//        .calledWithExactly('victim', 'bar', 'Bar');
//
//      jsverifier.assert.restore();
//    });
//  }); // validate
//});





describe.skip('V', () => {

  describe('number', () => {
    it('number: should validate a number', () => {
      V(5, {number: true});
    });

    it('number: should throw on a non-number', () => {
      expect(() => {
        V('5', {number: true});
      })
        .throws(ContractError);
    });
  }); // number


  describe('multiple assertions', () => {
    it('number: should validate a matching contract', () => {
      V('5', {
        length: 1,
        string: true,
        number: {
          orString: true,
          minValue: 4
        }
      });
    });

    it('number: should validate a number', () => {
      expect(() => {
        V('55', {
          length: 1,
          string: true,
          number: {
            orString: true,
            minValue: 4
          }
        });
      })
        .throws(ContractError, /length/);
    });
  }); // multiple assertions

});

