import ContractError from '../contract-error';

import any       from 'lodash/collection/any';
import cloneDeep from 'lodash/lang/cloneDeep';
import flatten   from 'lodash/array/flatten';
import isArray   from 'lodash/lang/isArray';
import isNumber  from 'lodash/lang/isNumber';
import isObject  from 'lodash/lang/isObject';
import pairs     from 'lodash/object/pairs';
import reduce    from 'lodash/collection/reduce';


export default class BaseAssertion {

  constructor({assertions}) {
    this.assertions = assertions;
  }

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

  _validate(victim, contractRaw, assertions = this.assertions) {
    const contract = cloneDeep(contractRaw);

    if (victim === undefined && contractRaw.optional) {
      return [];
    }
    delete contract.optional;

    return reduce(pairs(contract), (results, [assertionName, subcontract]) => {
      let result;

      const Assertion = assertions[assertionName];
      if (Assertion) {
        const assertion = new Assertion(assertions);
        result = assertion._validate(victim, subcontract);
      }
      else if (this[assertionName]) {
        result = this[assertionName](victim, subcontract);
      }
      else {
        throw new Error(`JSVerifier: assertion "${assertionName}" does not exist.`);
      }

      if (isArray(result)) {
        results.push.apply(results, result);
      }
      else if (result !== true) {
        results.push(result);
      }

      return results;
    }, [], this); // Need `this` to work around a Babel 5 bug: http://goo.gl/QfQ0Rm
  }

  or (victim, contract) {
    const errorGroups = reduce(pairs(contract), (results, [assertionName, subcontract]) => {
      const result = this._validate(victim, {[assertionName]: subcontract});
      results.push(result);
      return results;
    }, []);

    const isSuccessful = any(errorGroups, (group) => group === true || group && !group.length);

    return isSuccessful ? [] : flatten(errorGroups);
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

  value (victim, contract) {
    return victim === contract
      || this._makeAssertionError(victim, `expected to be strictly equal to ${contract}`);
  }
}
