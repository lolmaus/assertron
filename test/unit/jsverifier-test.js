import V, {assertron}               from '../../src/jsverifier';
import ContractError   from '../../src/contract-error';
//import AssertionError  from 'assertion-error';





describe('assertron', () => {
  let toss = assertron.toss;
  describe('throw', () => {
    it('should throw first error from array', () => {
      expect(() => {
        toss([new Error('foo'), new Error('bar')]);
      }).throws('foo');
    });

    it('should throw error if error is passed', () => {
      expect(() => {
        toss(new Error('foo'));
      }).throws(Error, 'foo');

      expect(() => {
        toss(new ContractError('foo'));
      }).throws(ContractError, 'foo');
    });

    it('should throw error with an object/primitive if object/primitive was passed', () => {
      expect(() => {
        toss('foo');
      }).throws(ContractError, 'foo');

      const obj = {};
      expect(() => {
        toss(obj);
      }).throws(ContractError, obj);
    });

    it('should not throw if nothing is passed', () => {
      toss();
    });

    it('should not throw if an empty array is passed', () => {
      toss([]);
    });
  });
});



describe('V', () => {

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
          isFinite: true
        }
      });
    });

    it('number: should throw on non-matching contract', () => {
      expect(() => {
        V('55', {
          length: 1,
          string: true,
          number: {
            orString: true,
            isFinite: true
          }
        });
      })
        .throws(ContractError, /length/);
    });
  }); // multiple assertions


  describe('or', () => {
    it('should validate a matching contract - 1', () => {
      V('5', {
        length: 1,
        or: {
          number: 4,
          string: {length: 1}
        }
      });
    });

    it('should validate a matching contract - 2', () => {
      V(4, {
        or: {
          number: 4,
          string: {length: 1}
        }
      });
    });

    it('should throw on a non-matching contract - 1', () => {
      expect(() => {
        V('5', {
          length: 1,
          or: {
            number: 4,
            string: {length: 2}
          }
        });
      }).throws(ContractError);
    });

    it('should throw on a non-matching contract - 2', () => {
      expect(() => {
        V(4, {
          or: {
            number: 5,
            string: true
          }
        });
      }).throws(ContractError);
    });
  }); // multiple assertions

  describe('optional', () => {
    it('should allow undefined', () => {
      V(undefined, {
        optional: true,
        string:   true
      });
    });

    it(' should not block other checks', () => {
      expect(() => {
        V(5, {
          optional: true,
          string:   true
        });
      })
        .throws(ContractError, /string/);
    });
  }); // optional

});

