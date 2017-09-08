import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './store/reducer';
import { HashRouter, Route } from 'react-keeper'
import Homepage from './components/homepage/homepage';
import StoriesDetail from './components/stories-detail/stories-detail';

import './index.css';
import './common/css/app.css'
import './App.css'
import registerServiceWorker from './registerServiceWorker';

let store = createStore(reducer);

const render = () => {
    ReactDOM.render(
        <Provider store={store}>
            <HashRouter>
                <div>
                    <Route exact path="/" component={ Homepage } />
                    <Route path="/detail/:id" component={StoriesDetail} />
                </div>
            </HashRouter>
        </Provider>
        , document.getElementById('root'));
};
render()

registerServiceWorker();

