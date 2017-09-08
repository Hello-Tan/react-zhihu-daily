import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps} from '../../store/mapProps';
import Topmenu from '../topmenu/topmenu';
import Slide from '../../components/slide/slide';
import Storieslist from '../../components/stories-list/stories-list';
import Loading from '../../base/loading/loading';
import api from '../api/index';
import {formattingDate} from '../../common/js/formattingDate';
import {throttle} from '../../common/js/util'

const DAY = 86400000
const THRESHOLD = 200
const HOMEPAGE = '#/'

const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

class HomePage extends Component{
    constructor () {
        super()
        this.state = {
            stories: [],
            topStories: [],
            dates: [],
            showFlag: false,
            modeFlag: false,
            index: 0,
            title: '首页',
            hash: '',
            computingTitle (date) {
                if (!date) {      // 默认显示标题
                    return '首页'
                }
                if (formattingDate(new Date(), 'yyyyMMdd') === date) {
                    return '今日热闻'
                } else {
                    let d = +new Date(date.substr(0, 4), date.substr(4, 2) - 1, date.substr(6, 2))
                    let day = new Date(d).getDay()
                    return `${date.substr(4, 2)}月${date.substr(6, 2)}日 ${days[day]}`
                }
            },
        }
        this.handlerChangeIndex = this.handlerChangeIndex.bind(this)
    }

    componentDidMount () {
        this.date = new Date(+new Date() + DAY)
        this.throttleScroll = throttle(() => {
            const innerHeight = window.innerHeight
            const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
            const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
            if ((innerHeight + scrollTop) >= (scrollHeight - THRESHOLD)) {
                if (this.state.showFlag) {
                    return
                }
                this.setState({
                    showFlag: true
                })
                this.date.setTime(+this.date - DAY)
                const DATE = formattingDate(this.date, 'yyyyMMdd')
                this._getNewsByDate(DATE)
            }
            if (!this.props.storiesHeight.length) {
                return
            }
            for (let i = 0; i < this.props.storiesHeight.length; i++) {
                let height1 = this.props.storiesHeight[i]
                let height2 = this.props.storiesHeight[i + 1]
                if (!height2 || (scrollTop >= height1 && scrollTop < height2)) {
                    this.setState({
                        title: this.state.computingTitle(this.state.dates[i])
                    })
                    return
                }
            }
        }, 60, 120)
        this._getNews()
        //this._watchHash()
        this._listenerScroll()
    }
    componentWillUnmount () {
        this.refs.slide.stopAutoPlay()
        this._stopListenerScroll()
    }
    handlerChangeIndex (index) {
        this.setState({
            index: index
        })
    }
    computingTitle (date) {
        if (!date) {      // 默认显示标题
            return '首页'
        }
        if (formattingDate(new Date(), 'yyyyMMdd') === date) {
            return '今日热闻'
        } else {
            let d = +new Date(date.substr(0, 4), date.substr(4, 2) - 1, date.substr(6, 2))
            let day = new Date(d).getDay()
            return `${date.substr(4, 2)}月${date.substr(6, 2)}日 ${days[day]}`
        }
    }
    _getNews () {
        api.getNews().then((res) => {
            this.setState({
                topStories: res.data.top_stories,
                stories: this.state.stories.concat([res.data.stories]),
                dates: this.state.dates.concat(res.data.date)
            })
        }).catch((err) => {
            console.log(err)
            this._getNews()
        })
    }
    _getNewsByDate (date) {
        api.getNewsByDate(date).then((res) => {
            if (this.state.dates[0] === res.data.date) {
                this.date.setTime(+this.date - DAY)
                const DATE = formattingDate(this.date, 'yyyyMMdd')
                return this._getNewsByDate(DATE)
            }
            this.setState({
                stories: this.state.stories.concat([res.data.stories]),
                dates: this.state.dates.concat(res.data.date),
                showFlag: false
            })
        }).catch((err) => {
            console.log(err)
            const DATE = formattingDate(this.date, 'yyyyMMdd')
            this._getNewsByDate(DATE)
        })
    }
    _listenerScroll () {
        window.addEventListener('scroll', this.throttleScroll, false)
    }
    _stopListenerScroll () {
        window.removeEventListener('scroll', this.throttleScroll)
    }
    _watchHash () {
        window.addEventListener('hashchange', () => {
            this.setState({
                hash: window.location.hash
            })
            if (this.state.hash === HOMEPAGE) {
                this._listenerScroll()
            } else {
                this._stopListenerScroll()
            }
        }, false)
    }

    render () {
        const swipe = {
            length: this.state.topStories.length,
            width: window.innerWidth,
            autoPlay: true,
            interval: 4000,
            speed: 400,
            threshold: 0.3
        }
        return (
            <div className="homepage" ref="homepage">
                <Topmenu title={this.state.title}></Topmenu>
                <div className="homepage-content">
                    <Slide topStories={this.state.topStories} ref="slide"
                         hash={this.state.hash}
                         index={this.state.index}
                         {...swipe}
                         handlerChangeIndex={this.handlerChangeIndex}>
                    </Slide>
                    <Storieslist stories={this.state.stories} dates={this.state.dates} computingTitle={this.state.computingTitle}>
                    </Storieslist>
                    {
                        this.state.showFlag ?
                            <div className="loading-wrapper">
                                <Loading></Loading>
                            </div> : ''
                    }
                </div>
             </div>
        )
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomePage)