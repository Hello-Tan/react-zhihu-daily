import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Loading extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    static defaultProps = {
        title: ''
    }
    static propTypes = {
        title: PropTypes.string
    }

    render() {
        return (
            <div className="loading">
                <img width="24" height="24" src={require('./loading.gif')} alt=""/>
                    <p className="desc">{this.props.title}</p>
            </div>
        )
    }
}