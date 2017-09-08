import State from './state';
import * as types from './action-types';

function reducer (state, action) {
    state = state || State;

    switch (action.type) {
        case types.SET_STORIES_HEIGHT:
            return { storiesHeight: action.list };
        default:
            return state;
    }
}

export default reducer