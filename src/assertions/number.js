import BaseAssertion from './base';
import isNumber      from 'lodash/lang/isNumber';
import cloneDeep     from 'lodash/lang/cloneDeep';

export default class NumberAssertion extends BaseAssertion {
  _validate(victim, contract = {
    orString: false,
    isFinite: false
  }) {
    const baseCheck = contract.orString ? 'orString' : 'isNumber';
    const baseCheckResult = this[baseCheck](victim);

    if (baseCheckResult !== true) {
      return [baseCheckResult];
    }

    if (contract === true) {
      return [];
    }

    contract = cloneDeep(contract);

    delete contract.isNumber;
    delete contract.orString;

    return this._parseContract(victim, contract);
  }

  isNumber(victim) {
    return isNumber(victim) || this._makeAssertionError(victim, 'expected to be a number');
  }

  orString(victim) {
    return !isNaN(parseFloat(victim)) || this._makeAssertionError(victim, 'expected to be a number or a string containing a number');
  }

  isFinite(victim) {
    return isFinite(victim) || this._makeAssertionError(victim, 'expected to be finite');
  }
}
