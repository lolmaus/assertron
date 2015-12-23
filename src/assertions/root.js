import BaseAssertion from './base';

import any     from 'lodash/collection/any';
import flatten from 'lodash/array/flatten';
import isArray from 'lodash/lang/isArray';
import pairs   from 'lodash/object/pairs';
import reduce  from 'lodash/collection/reduce';

export default class RootAssertion extends BaseAssertion {
  _validate(victim, contract, assertions = this.assertions) {

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
}
