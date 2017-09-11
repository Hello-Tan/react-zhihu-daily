import React, { Component } from 'react';
import api from '../api/index';
//import Loading from 'base/loading/loading';
import { Control } from 'react-keeper'


export default class StoriesDetail extends Component {
    constructor (props) {
        super(props)
        this.state = {
            news: {},
            newsInfo: {},
            showFlag: false,
            highlight: false
        }
    }
    componentDidMount () {
        this.init()
    }
    componentWillReceiveProps () {
        //this.setState({
        //    news: {},
        //    newInfo: {}
        //})
        //this.init()
    }

    comments () {
        if (this.state.newsInfo.comments) {
            let num = this.state.newsInfo.comments
            return num > 999 ? `${(num / 1000).toFixed(1)}k` : num
        }
        return this.state.newsInfo.comments === 0 ? '0' : '...'
    }
    popularity () {
        if (this.state.newsInfo.popularity) {
            let num = this.state.newsInfo.popularity
            return num > 999 ? `${(num / 1000).toFixed(1)}k` : num
        }
        return this.state.newsInfo.popularity === 0 ? '0' : '...'
    }
    https () {
        if (this.state.news.share_url.indexOf('https') > -1) {
            return this.state.news.share_url
        }
        return `https${this.state.news.share_url.substr(4)}`
    }
    back () {
        console.log(Control.history)
        Control.history.goBack()
    }
    show () {
        this.setState({
            showFlag: true
        })
    }
    init () {
        this.setState({
            showFlag: false,
            highlight: false
        })
        //this._getNewsById()
        //this._getNewsInfoById()
    }
    showComments () {
        Control.history.push('/comments')
        setTimeout(() => {
            this.setState({
                showFlag: false
            })
        }, 500)
    }
    commentsHide () {
        this.setState({
            showFlag: true
        })
    }
    commentsShow () {
        setTimeout(() => {
            this.setState({
                showFlag: false
            })
        }, 500)
    }

    like () {
        this.setState({
            highlight: !this.state.highlight
        })
        this.state.highlight === true ? this.setState({
            newsInfo: Object.assign({},this.state.newsInfo,{popularity: this.state.newsInfo.popularity++})
        }) : this.setState({
            newsInfo: Object.assign({},this.state.newsInfo,{popularity: this.state.newsInfo.popularity--})
        })
    }
    triggerFavorite () {
        //if (this.favorite) {
        //    this.deleteStoriesList(this.stories)
        //} else {
        //    this.saveStoriesList(this.stories)
        //}
    }
    _getNewsById () {
        //if (!this.storiesId) {
        //Control.history.push('/')
        //    return
        //}
        api.getNewsById(this.storiesId).then((res) => {
            this.setState({
                news: res.data
            })
            this.show()
        }).catch((err) => {
            console.log(err)
            this._getNewsById()
        })
    }
    _getNewsInfoById () {
        if (!this.storiesId) {
            Control.history.push('/')
            return
        }
        api.getNewsInfoById(this.storiesId).then((res) => {
            this.setState({
                newsInfo: res.data
            })
            this.show()
        }).catch((err) => {
            console.log(err)
            this._getNewsInfoById()
        })
    }
    render () {
        return (
            <div className="stories-detail">
                <p>hello world</p>
                <div className="header">
                    <div className="header-icon back" onClick={this.back}>
                    <i className="icon-font" dangerouslySetInnerHTML={{__html: '&#xe603'}}></i>
                </div>
                <div className="header-blank"></div>
                <div className="header-icon">
                    <i className="icon-font" dangerouslySetInnerHTML={{__html: '&#xe61f'}}></i>
                </div>
                <div className="header-icon" onClick={this.triggerFavorite}>
                <i className="icon-font" dangerouslySetInnerHTML={{__html: '&#xe604'}}></i>
    </div>
        <div className="header-icon" onClick={this.showComments}>
        <i className="icon-font message" dangerouslySetInnerHTML={{__html: '&#xe606'}}></i>
        <span className="count"></span>
    </div>
        <div className="header-icon" onClick={this.like}>
        <i className="icon-font" dangerouslySetInnerHTML={{__html: '&#xe611'}}></i>
        <span className="count"></span>
    </div>
    </div>
        <div className="main">
            <div className="img-box"
            style={{ backgroundImage: 'url()'}}>
            <div className="img-mask"></div>
            <h1 className="img-title"></h1>
            <p className="img-source"></p>
        </div>
        <div className="content" dangerouslySetInnerHTML={{__html: '&#xe611'}}></div>
    </div>
        <div className="loading-wrapper">
            { /* <loading></loading> */ }
        </div>
        <iframe src width="100%" height="100%" style={{position: 'relative',top: '1.35rem' }}></iframe>
            </div>
        )
    }
}
