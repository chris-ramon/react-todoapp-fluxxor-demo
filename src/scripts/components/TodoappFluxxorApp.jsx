/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var ReactTransitionGroup = React.addons.TransitionGroup;
var Fluxxor = require("fluxxor");
var _ = require("underscore");

// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;

// CSS
require('../../styles/normalize.css');
require('../../styles/main.css');

var imageURL = require('../../images/yeoman.png');


var TodoStore = Fluxxor.createStore({
    initialize: function() {
        this.todos = [
            {id: _.uniqueId(), text: "run 10k nike"},
            {id: _.uniqueId(), text: "run 7k adidas"}
        ];
    },

    getState: function() {
        return {
            todos: this.todos
        };
    }
});

var stores = {
    TodoStore: new TodoStore()
};

var flux = new Fluxxor.Flux(stores);

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Application = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin("TodoStore")],

    getStateFromFlux: function() {
        var flux = this.getFlux();
        return flux.store("TodoStore").getState();
    },

    render: function() {
        return (
            <div>
                <ul>
                    {this.state.todos.map(function(todo) {
                        return <Todo key={todo.id} todo={todo} />
                    })}
                </ul>
            </div>
        );
    }
});

var Todo = React.createClass({
    render: function() {
        return (<li>{this.props.todo.text}</li>);
    }
});

React.renderComponent(<Application flux={flux} />, document.getElementById('content')); // jshint ignore:line

module.exports = Application;
