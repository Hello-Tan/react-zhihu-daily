import * as types from './action-types';

const action = {
    setStoriesHeight (list) {
        return { type: types.SET_STORIES_HEIGHT, list }
    }
}

export default action