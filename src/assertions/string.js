import BaseAssertion from './base';
import isString      from 'lodash/lang/isString';
import cloneDeep     from 'lodash/lang/cloneDeep';

export default class StringAssertion extends BaseAssertion {
  _validate(victim, contract = {
  }) {
    return this.isString(victim);
  }

  isString(victim) {
    return isString(victim) || this._makeAssertionError(victim, 'expected to be a string');
  }
}
