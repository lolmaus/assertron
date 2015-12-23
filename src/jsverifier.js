import allAssertions from './assertions';
import ContractError   from './contract-error';
import isArray       from 'lodash/lang/isArray';
import isError       from 'lodash/lang/isError';

export class Assertron {
  constructor({assertions = allAssertions} = {}) {
    this.assertions = assertions;
  }

  toss(errors) {
    let error = isArray(errors) ? errors[0] : errors;

    if (error !== undefined && !isError(error)) {
      error = new ContractError(error);
    }

    if (error) {
      throw error;
    }
  }

  validate(victim, contract) {
    const rootAss = new this.assertions.root({assertions: this.assertions});
    const errors = rootAss._validate(victim, contract);
    console.log('errors', errors)
    this.toss(errors);
    return true;
  }
}

export const assertron = new Assertron();

const validate = assertron.validate.bind(assertron);

export default validate;
