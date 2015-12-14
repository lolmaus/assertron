import V, {JSVerifier} from '../../src/jsverifier';
import Assertion       from '../../src/assertions/_assertion';
import ContractError   from '../../src/contract-error';
import AssertionError  from 'assertion-error';



describe('JSVerifier', () => {
  let jsverifier;

  beforeEach(() => {
    jsverifier = new JSVerifier();
  });




  describe('assert', () => {

    const assertions = {
      foosertion: class Foosertion extends Assertion {
        _main(victim, contract) {
          return {
            result:  true,
            message: "doesn't matter"
          };
        }
      },

      barsertion: class Barsertion extends Assertion {
        _main(victim, contract) {
          return {
            result:  false,
            message: "doesn't matter"
          };
        }
      }
    };

    it('should work', () => {
      jsverifier.assert('victim', 'foosertion', 'contract', assertions);
    });

    it('should throw', () => {
      expect(() => {
        jsverifier.assert('victim', 'barsertion', 'contract', assertions);
      }).throws(ContractError);
    });

  }); // assert



  describe('validate', () => {
    it('should work', () => {
      stub(jsverifier, 'assert');

      const contract = {
        foo: 'Foo',
        bar: 'Bar'
      };

      const result = jsverifier.validate('victim', contract);

      expect(result).ok;

      expect(jsverifier.assert)
        .calledTwice
        .calledWithExactly('victim', 'foo', 'Foo')
        .calledWithExactly('victim', 'bar', 'Bar');

      jsverifier.assert.restore();
    });
  }); // validate
});





  describe('C', () => {

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

});

