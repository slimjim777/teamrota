'use strict';
var React = require('react');
var EventModel = require('../models/event');
var Person = require('../models/person');
var moment = require('moment');

var DISPLAY_FORMAT = 'DD/MM/YYYY';
var STANDARD_FORMAT = 'YYYY-MM-DD';

var EventOverview = React.createClass({

    getInitialState: function() {
        return ({model: {}, roles: [], rota: [], fromDate: moment().format(STANDARD_FORMAT), eventLoading: false});
    },

    componentDidMount: function() {
        // Get the user permissions
        this.getPermissions();

        // Get the event
        var modelId = this.props.params.id;
        this.getEvent(modelId);
        this.getEventRoles(modelId);
        this.getEventRota(modelId);
    },

    getEvent: function(modelId) {
        var self = this;
        self.setState({eventLoading: true });
        var result = EventModel.findById(modelId);
        result.done(function(data) {
            self.setState({model: data.model, eventLoading: false });
        });
    },

    getEventRoles: function(modelId) {
        var self = this;
        var result = EventModel.roles(modelId);
        result.done(function(data) {
            self.setState({roles: data.roles});
        });
    },

    getEventRota: function(modelId) {
        var self = this;
        var result = EventModel.rota(modelId, this.state.fromDate);
        result.done(function(data) {
            console.log(data.rota);
            self.setState({rota: data.rota});
        });
    },

    getPermissions: function () {
        var self = this;
        var result = Person.permissions();
        result.done(function(user) {
            user.role_rota = sessionStorage.getItem('role_rota');
            self.setState({user: user});
        });
    },

    handleChangeFromDate: function(e) {
        var d = moment(e.target.value, STANDARD_FORMAT)
        this.setState({fromDate: d.format(STANDARD_FORMAT)});
    },

    handleClickEdit: function(e) {
        e.preventDefault();
        var onDate = e.target.getAttribute('data-key');
    },

    handleClickDateChange: function() {
        this.getEventRota(this.state.model.id);
    },

    render: function() {
        var self = this;
        var model = this.state.model;

        return (
            <div id="main" className="container-fluid" role="main">
                <h2 className="sub-heading">{model.name}</h2>

                <div className="col-lg-3">
                    <div className="form-group form-horizontal">
                        <label>From Date:</label>
                        <input type="date" name="fromDate" value={this.state.fromDate}
                               onChange={this.handleChangeFromDate} />
                        <button className="btn btn-primary" onClick={this.handleClickDateChange}>Go</button>
                    </div>
                </div>

                <div className="col-lg-12 table-responsive">
                    <table className="table table-striped rota">
                        <thead>
                        <tr>
                            <th>Date</th><th className="first-column">Focus</th><th>Notes</th><th>Run Sheet</th>
                            {this.state.roles.map(function(role) {
                                return <th key={role.id}>{role.name}</th>;
                            })}
                            <th>Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.rota.map(function(r) {
                            return (
                                <tr key={r.on_date}>
                                    <td><a href="" onClick={self.handleClickEdit} data-key={r.on_date}>{moment(r.on_date).format('DD MMM')}</a></td>
                                    <td>{r.focus}</td><td>{r.notes}</td><td>{r.url}</td>
                                    {self.state.roles.map(function(rl) {
                                        var role = r.roles[rl.id];
                                        return <td key={rl.id}><a href={'#/person/' + role.person_id}>{role.firstname} {role.lastname}</a></td>;
                                    })}
                                    <td><a href="" onClick={self.handleClickEdit} data-key={r.on_date}>{moment(r.on_date).format('DD MMM')}</a></td>
                                </tr>
                            );
                        })}

                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
});

module.exports = EventOverview;