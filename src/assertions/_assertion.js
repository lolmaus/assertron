import reduce         from 'lodash/collection/reduce';
import pairs          from 'lodash/object/pairs';
import isNumber       from 'lodash/lang/isNumber';
import isObject       from 'lodash/lang/isObject';

export default class Assertion {
  _parseContract (victim, contract) {
    const result = reduce(pairs(contract), (result, [methodName, contractValue]) => {
      if (!result.result) { return result; }

      if (!this[methodName]) {
        throw new Error(`JSVerifier: assertion "number.${methodName}" does not exist.`);
      }

      return this[methodName](victim, contractValue);
    }, {result: true});

    return result;
  }

  exactLength (victim, length)  {
    return {
      result: victim.length === length,
      message: `expected to have length of ${length}`
    }
  }

  minLength (victim, length)  {
    return {
      result: victim.length >= length,
      message: `expected to have length of ${length}`
    }
  }

  maxLength (victim, length)  {
    return {
      result: victim.length <= length,
      message: `expected to have length of ${length}`
    }
  }

  length (victim, contract) {
    if (isNumber(contract)) {
      return this.exactLength(victim, contract);
    }

    if (isObject(contract)) {
      return reduce(contract, (result, value, key) => {
        if (!result || !result.result) {
          return result;
        }

        const methodName = `${key}Length`;
        return this[methodName](victim, value);
      }, {result: true});
    }

    throw new Error('JSValidator: incorrect contract passed to "length", should be either number or object');
  }
}
