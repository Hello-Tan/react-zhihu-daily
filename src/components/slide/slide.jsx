import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {prefixStyle} from '../../common/js/dom'
const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')
const transitionTimingFunction = prefixStyle('transitionTimingFunction')

let el = null

export default class slide extends Component{
    constructor(props) {
        super(props)
        this.state = {
            touch: {},
            THRESHOLD: this.props.threshold * this.props.width
        }
        this.touchstart = this.touchstart.bind(this)
        this.touchmove = this.touchmove.bind(this)
        this.touchend = this.touchend.bind(this)
    }
    static defaultProps = {
        topStories: [],
        hash: '',
        length: 0,
        width: 0,
        autoPlay: true,
        interval: 4000,
        speed: 400,
        threshold: 0.3,
        index: 0
    }

    static propTypes = {
        topStories: PropTypes.array.isRequired,
        hash: PropTypes.string,
        length: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
        interval: PropTypes.number.isRequired,
        speed: PropTypes.number.isRequired,
        threshold: PropTypes.number.isRequired,
        index: PropTypes.number.isRequired,
        autoPlay: PropTypes.bool
    }

    componentWillReceiveProps (nextProps){
        if( this.props.topStories !== nextProps.topStories){
            el = this.refs.slideBox
            this.refs.slideBox.style.width = this.refs.slide.clientWidth * nextProps.length + 'px'
            this.init()
        }
    }

    init () {
        el.style[transitionTimingFunction] = 'cubic-bezier(0.165, 0.84, 0.44, 1)'
        if (this.props.autoPlay) {
            this.startAutoPlay()
        }
        this.touchstart()
        this.touchmove()
        this.touchend()
    }
    touchstart () {
        el.addEventListener('touchstart', (ev) => {
            this.stopAutoPlay()
            let touch = ev.touches[0]
            this.setState({
                touch: Object.assign({}, this.state.touch,
                    {initiated: true,        // 开始滑动
                     moved: false,           // 滑动状态
                     startX: touch.pageX,
                     startY: touch.pageY
                    })
            })
        }, false)
    }
    touchmove () {
        el.addEventListener('touchmove', (ev) => {
            if (!this.state.touch.initiated) {
                return
            }
            if (!this.state.touch.moved) {
                this.setState({
                    touch: Object.assign({}, this.state.touch, {moved: true})
                })
            }
            let touch = ev.touches[0]
            const offsetX = touch.pageX - this.state.touch.startX
            const offsetY = touch.pageY - this.state.touch.startY
            if (Math.abs(offsetX) < Math.abs(offsetY)) {
                return
            } else {
                ev.preventDefault()
                const offset = -(this.props.index * this.props.width) + offsetX
                el.style[transform] = `translate3d(${offset}px, 0px, 0px)`
                el.style[transitionDuration] = '0s'
            }
        }, false)
    }
    touchend () {
        el.addEventListener('touchend', (ev) => {
            if (this.props.autoPlay) {
                this.startAutoPlay()
            }
            if (!this.state.touch.moved) {    // 当没有滑动状态时退出
                return
            }
            this.setState({
                touch: Object.assign({}, this.state.touch, {initiated: false})      // 滑动结束
            })
            let touch = ev.changedTouches[0]
            let offsetX = touch.pageX - this.state.touch.startX
            if (this.props.index === 0 && offsetX > 0) {  // 首张右滑
                this.changeIndex(0)
                return this.transition()
            }
            if (this.props.index === this.props.length - 1 && offsetX < 0) { // 末张左滑
                this.changeIndex(this.props.index)
                return this.transition()
            }
            if (Math.abs(offsetX) > this.state.THRESHOLD && offsetX < 0) {
                this.changeIndex(this.props.index + 1)
            }
            if (Math.abs(offsetX) > this.state.THRESHOLD && offsetX > 0) {
                this.changeIndex(this.props.index - 1)            }
            return this.transition()
        }, false)
    }
    transition () {
        const offset = -(this.props.index * this.props.width)
        el.style[transform] = `translate3d(${offset}px, 0px, 0px)`
        el.style[transitionDuration] = `${this.props.speed}ms`
    }
    startAutoPlay () {
        this.stopAutoPlay()
        this.timer = setTimeout(() => {
            if (this.props.index >= this.props.length - 1) {
                this.changeIndex(0)
            } else {
                this.changeIndex(this.props.index + 1)
            }
            this.transition()
            setTimeout(() => {
                this.startAutoPlay()
            }, this.props.speed)
        }, this.props.interval)
    }
    stopAutoPlay () {
        clearTimeout(this.timer)
    }
    next () {
        this.changeIndex(this.props.index + 1)
        if (this.props.index > this.props.length - 1) {
            this.changeIndex(0)
        }
        this.transition()
    }
    changeIndex (index) {
        this.props.handlerChangeIndex(index)
    }
    componentWillUnMount () {
        this.stopAutoPlay()
    }
    render () {
        return (
            <div className="slide" ref="slide">
                <div className="slide-wrapper" ref="slideWrapper">
                    <div className="slide-box" ref="slideBox">
                        {this.props.topStories.map((storie, index) => {
                            return <div className="slide-item" key={index}
                                        style={{backgroundImage: 'url(' + storie.image + ')',
                                                     width: this.refs.slide.clientWidth + 'px'}}>
                                <div className="slide-mask"></div>
                                <h1 className="slide-title">{storie.title}</h1>
                            </div>
                        })}
                    </div>
                    <div className="slide-pagination">
                        {this.props.topStories.map((storie, index) => {
                            return <span className={`dot ${index === this.props.index ? 'active' : ''}`} key={index}>
                                    </span>
                        })}
                    </div>
                </div>
            </div>
        )
    }
}