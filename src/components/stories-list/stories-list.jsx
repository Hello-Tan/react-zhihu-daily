import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps} from '../../store/mapProps';
import { Control } from 'react-keeper'


class Storieslist extends Component {
    static defaultProps = {
        stories: [],
        dates: [],
        showTitle: true
    }

    static propTypes = {
        stories: PropTypes.array,
        dates: PropTypes.array,
        showTitle: PropTypes.bool,
        computingTitle: PropTypes.func
    }

    shouldComponentUpdate (nextProps, nextState) {
        if (this.props.stories !== nextProps.stories) {
            return true
        }
        return false
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.stories !== nextProps.stories) {
            setTimeout(() => {
                this._calculateHeight()
            }, 50)
        }
    }
    selectList (list) {
        Control.history.push(`/detail/${list.id}`);
    }

    _calculateHeight () {
        let list = document.getElementsByClassName('stories-list-box')
        let arr = []
        let height = list[0].offsetTop
        arr.push(height)
        for (let i = 0, len = list.length; i < len; i++) {
            height += list[i].clientHeight
            arr.push(height)
        }
        this.props.setStoriesHeight(arr)
    }


    multipic (multipic) {
        if (multipic) {
            return true
        }
        return false
    }

    render () {
        return (
            <div className="stories-list">
                {this.props.stories.map((item,index) => {
                    return <div className="stories-list-box" ref="storiesListBox" key={index}>
                        <h2 className="title">{this.props.computingTitle(this.props.dates[index])}</h2>
                        <ul>
                            {item.map((list,i) => {
                                return <li className="list"  key={i} onClick={() =>this.selectList(list)}>
                                    <div className="text-box"><p className="text">{list.title}</p></div>
                                    {(!!list.images && list.images.length > 0) === true ? <div className="img-box">
                                        <img className="img" src={list.images[0]} alt=""/>
                                        {this.multipic(list.multipic) === true ? <p className="tip"><i className="icon-font" dangerouslySetInnerHTML={{__html: '&#xe61c'}}></i>多图</p> : null}
                                    </div> : null}
                                </li>
                            })}
                        </ul>
                    </div>
                })}
            </div>
        )
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Storieslist)