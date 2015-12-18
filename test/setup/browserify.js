var config = require('../../package.json').babelBoilerplateOptions;
import Reporter from './reporter';

global.mocha.setup('bdd');
global.onload = function() {
  global.mocha.checkLeaks();
  global.mocha.globals(config.mochaGlobals);
  global.mocha.reporter((runner) => new Reporter(runner, global.mocha));
  global.mocha.setup({
    timeout: 10000,
    slow:     2000
  });
  global.mocha.run();
  require('./setup')();
};
