import ContractError from './contract-error';
import assertions    from './assertions';
import forOwn        from 'lodash/object/forOwn'

export class JSVerifier {
  constructor(assertions = assertions) {
    this.assertions = assertions;
  }

  assert(victim, assertionName, contract, assertions = this.assertions) {
    const assertion         = new assertions[assertionName]();
    const {result, message} = assertion._main(victim, contract);

    if (!result) {
      throw new ContractError(message);
    }
  }

  validate(victim, contract) {
    forOwn(contract, (value, key) => {
      this.assert(victim, key, value);
    });

    return true;
  }
}

JSVerifier.prototype.assertions = assertions;

const verifier = new JSVerifier(assertions);
const V        = verifier.validate.bind(verifier);

export default V;
