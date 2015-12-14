import Assertion from './_assertion';
import isNumber  from 'lodash/lang/isNumber';
import cloneDeep from 'lodash/lang/cloneDeep';

export default class NumberAssertion extends Assertion {
  _main(victim, contract = {
    orString: false,
    isFinite: false
  }) {

    contract = cloneDeep(contract);

    let result =
      contract.orString
        ? this.orString(victim)
        : this.isNumber(victim);

    if (!result.result) {
      return result;
    }

    delete contract.isNumber;
    delete contract.orString;

    return this._parseContract(victim, contract);
  }

  isNumber(victim) {
    return {
      result:  typeof victim === 'number',
      message: 'expected to be a number'
    }
  }

  orString(victim) {
    return {
      result:  !isNaN(parseFloat(victim)),
      message: 'expected to be a number or a string containing a number'
    }
  }

  isFinite(victim) {
    return {
      result:  isFinite(victim),
      message: 'expected to be finite'
    };
  }
}
