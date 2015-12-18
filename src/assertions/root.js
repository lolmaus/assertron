import BaseAssertion from './base';

import reduce from 'lodash/collection/reduce';

import number from './number';
import string from './string';

const assertions = {
  number,
  string
};

export default class RootAssertion extends BaseAssertion {
  _validate(victim, contract, assertions = assertions) {
    return reduce(contract, (results, contract, assertionName) => {
      let result;

      if (assertions[assertionName]) {
        const assertion = new assertions[assertionName]();
        result = assertion._validate(victim, contract);
      }
      else if (this[assertionName]) {
        result = this[assertionName](victim, contract);
      }
      else {
        throw new Error(`JSVerifier: assertion "${assertionName}" does not exist.`);
      }

      if (result !== true) {
        results.push(result);
      }

      return results;
    }, [], this); // Need `this` to work around a Babel 5 bug: http://goo.gl/QfQ0Rm
  }
}
