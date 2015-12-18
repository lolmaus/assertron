import ContractError from '../contract-error';

import reduce         from 'lodash/collection/reduce';
import pairs          from 'lodash/object/pairs';
import isNumber       from 'lodash/lang/isNumber';
import isObject       from 'lodash/lang/isObject';
import isArray        from 'lodash/lang/isArray';

export default class BaseAssertion {

  _makeAssertionError(victim, message) {
    return new ContractError(`${message}: ${victim}`);
  }

  _parseContract (victim, contract) {
    return reduce(pairs(contract), (results, [methodName, contractValue]) => {
      if (!this[methodName]) {
        throw new Error(`JSVerifier: assertion "number.${methodName}" does not exist.`);
      }

      const result = this[methodName](victim, contractValue);

      if (result !== true) {
        if (isArray(result)) {
          results = results.concat(result);
        } else {
          results.push(result);
        }
      }

      return results;
    }, []);
  }

  exactLength (victim, length)  {
    return victim.length === length
      || this._makeAssertionError(victim, `expected to have length of ${length}`);
  }

  minLength (victim, length)  {
    return victim.length >= length
      || this._makeAssertionError(victim, `expected to have min length of ${length}`);
  }

  maxLength (victim, length)  {
    return victim.length <= length
      || this._makeAssertionError(victim, `expected to have max length of ${length}`);
  }

  length (victim, contract) {
    if (isNumber(contract)) {
      return this.exactLength(victim, contract);
    }

    if (isObject(contract)) {
      return reduce(contract, (results, value, key) => {
        const methodName = `${key}Length`;
        const result     = this[methodName](victim, value);

        if (result !== true) {
          if (results === true) {
            results = result;
          } else if (isArray(results)) {
            results.push(result);
          } else {
            results = [results, result];
          }
        }

        return results;
      }, true);
    }

    throw new Error('JSVerifier: incorrect contract passed to "length", should be either number or object');
  }
}
