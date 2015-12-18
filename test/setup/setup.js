

module.exports = function() {
  global.expect = global.chai.expect;
  global.spy = global.sinon.spy.bind(global.sinon);
  global.stub = global.sinon.stub.bind(global.sinon);
  //
  //beforeEach(function() {
  //  this.sandbox = global.sinon.sandbox.create();
  //  global.stub = this.sandbox.stub.bind(this.sandbox);
  //  global.spy = this.sandbox.spy.bind(this.sandbox);
  //});
  //
  //afterEach(function() {
  //  delete global.stub;
  //  delete global.spy;
  //  this.sandbox.restore();
  //});
};
