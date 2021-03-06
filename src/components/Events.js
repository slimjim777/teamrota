'use strict';
var React = require('react');
var EventModel = require('../models/event');
var EventList = require('../components/EventList');


var Events = React.createClass({

    getInitialState: function() {
        return ({eventsLoading: false, events: []});
    },

    componentDidMount: function () {
        var self = this;

        // Get the events
        self.getEvents();
    },

    getEvents: function() {
        var self = this;
        self.setState({eventsLoading: true});
        EventModel.all().then(function(response) {
            var data = JSON.parse(response.body);
            self.setState({ events: data.events, eventsLoading: false });
        });
    },

    render: function () {
        return (
            <div id="main" className="container-fluid" role="main">
                <h2>Events</h2>

                <EventList events={this.state.events} />
            </div>
        );
    }
});


module.exports = Events;