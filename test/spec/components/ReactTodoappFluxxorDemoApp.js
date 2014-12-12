'use strict';

describe('Main', function () {
  var ReactTodoappFluxxorDemoApp, component;

  beforeEach(function () {
    var container = document.createElement('div');
    container.id = 'content';
    document.body.appendChild(container);

    ReactTodoappFluxxorDemoApp = require('../../../src/scripts/components/ReactTodoappFluxxorDemoApp.jsx');
    component = ReactTodoappFluxxorDemoApp();
  });

  it('should create a new instance of ReactTodoappFluxxorDemoApp', function () {
    expect(component).toBeDefined();
  });
});
