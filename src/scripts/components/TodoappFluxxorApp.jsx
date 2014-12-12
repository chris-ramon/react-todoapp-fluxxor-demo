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

var appEvents = {
    ADD_TODO: 'add_todo',
    REMOVE_TODO: 'remove_todo'
};

var TodoStore = Fluxxor.createStore({
    initialize: function() {
        this.todos = [
            {id: _.uniqueId(), text: "run 10k nike"},
            {id: _.uniqueId(), text: "run 7k adidas"}
        ];

        this.bindActions(
            appEvents.ADD_TODO, this.onAddTodo,
            appEvents.REMOVE_TODO, this.onRemoveTodo
        )
    },

    getState: function() {
        return {
            todos: this.todos
        };
    },

    onAddTodo: function(payload) {
        this.todos.push({text: payload.text, complete: false});
        this.emit("change");
    },

    onRemoveTodo: function (todo) {
        this.todos.splice(this.todos.indexOf(todo), 1);
        this.emit("change");
    }

});

var stores = {
    TodoStore: new TodoStore()
};

var actions = {
    addTodo: function(text) {
        this.dispatch(appEvents.ADD_TODO, {text: text});
    },

    removeTodo: function(todo) {
        this.dispatch(appEvents.REMOVE_TODO, {todo: todo});
    }
};

var flux = new Fluxxor.Flux(stores, actions);

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Application = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin("TodoStore")],

    getInitialState: function () {
        return {
            newTodoText: ""
        };
    },

    getStateFromFlux: function() {
        var flux = this.getFlux();
        return flux.store("TodoStore").getState();
    },

    onSubmitForm: function (e) {
        e.preventDefault();
        this.getFlux().actions.addTodo(this.state.newTodoText);
        this.setState({newTodoText: ""});
    },

    onTodoTextChange: function(e) {
        this.setState({newTodoText: e.target.value});
    },

    onRemoveClick: function(payload) {
        this.getFlux().actions.removeTodo(payload);
    },

    onTextClick: function () {
        this.getFlux().actions.editTodo(payload);
    },

    render: function() {
        var todos = [];

        this.state.todos.map(_.bind(function(todo) {
            todos.push(
                <Todo
                    key={todo.id}
                    todo={todo}
                    onRemoveClick={this.onRemoveClick}
                    onTextClick={this.onTextClick}/>
            )
        }, this));

        return (
            <div>
                <form className="todo-form" onSubmit={this.onSubmitForm}>
                    <input type="text"
                        onChange={this.onTodoTextChange}
                        value={this.state.newTodoText}
                        autoFocus />
                    <input type="submit" />
                </form>
                <ul>{todos}</ul>
            </div>
        );
    }
});

var Todo = React.createClass({
    render: function() {
        return (
            <li>
                <span onClick={this.props.onTextClick}>
                    {this.props.todo.text}
                </span>
                <span> - </span>
                <a href="#" onClick={this.props.onRemoveClick}>x</a>
            </li>
        );
    }
});

React.renderComponent(<Application flux={flux} />, document.getElementById('content')); // jshint ignore:line

module.exports = Application;
