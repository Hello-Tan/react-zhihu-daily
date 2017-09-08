import action from './action';

export const mapStateToProps = (state) => {
    return {
        storiesHeight: state.storiesHeight
    }
}

export const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        setStoriesHeight: (list) => {
            dispatch(action.setStoriesHeight(list))
        }
    }
}