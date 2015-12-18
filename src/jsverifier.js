//import ContractError from './contract-error';
//import assertions    from './assertions';
import RootAssertion    from './assertions/root';
//import forOwn        from 'lodash/object/forOwn'

//export class JSVerifier {
//  //constructor(assertions = assertions) {
//  //  this.assertions = assertions;
//  //}
//
//  //assert(victim, assertionName, contract, assertions = this.assertions) {
//  //  const assertion         = new assertions[assertionName]();
//  //  const {result, message} = assertion._validate(victim, contract);
//  //
//  //  if (!result) {
//  //    throw new ContractError(message);
//  //  }
//  //}
//
//  validate(victim, contract) {
//    //forOwn(contract, (value, key) => {
//    //  this.assert(victim, key, value);
//    //});
//    const baseAssertion = new BaseAssertion();
//    baseAssertion._validate(victim, contract)
//
//    return true;
//  }
//}
//
//const verifier = new JSVerifier();
const rootAssertion = new RootAssertion();
const V             = rootAssertion._validate.bind(rootAssertion);

export default V;
