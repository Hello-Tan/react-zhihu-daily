import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Topmenu extends Component{
    static defaultProps = {
        title: '',
        showFlag: true
    }

    static propTypes = {
        title: PropTypes.string
    }

    render () {
        return (
            <div className="topmenu">
                <div className="icon">
                    <i className="icon-font" dangerouslySetInnerHTML={{__html: '&#xe612'}}></i>
                </div>
                <div className="title">
                    <p>{this.props.title}</p>
                </div>
                {this.props.showFlag === true ? <div className="icon">
                    <i className="icon-font" dangerouslySetInnerHTML={{__html: '&#xe610'}}></i>
                </div> : null }
                {this.props.showFlag === true ? <div className="icon">
                    <i className="icon-font" dangerouslySetInnerHTML={{__html: '&#xe619'}}></i>
                </div> : null }
            </div>
        )
    };
}