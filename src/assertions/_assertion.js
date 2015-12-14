import reduce         from 'lodash/collection/reduce';
import pairs          from 'lodash/object/pairs';

export default class Assertion {
  _parseContract (victim, contract) {
    console.log(victim, contract)

    const result = reduce(pairs(contract), (result, [methodName, contractValue]) => {
      if (!result.result) { return result; }

      if (!this[methodName]) {
        throw new Error(`JSVerifier: assertion "number.${methodName}" does not exist.`);
      }

      return this[methodName](victim, contractValue);
    }, {result: true});

    return result;
  }
}
