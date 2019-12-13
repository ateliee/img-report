import React from 'react';
import reducer from './reducer';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/App';
import {createStore} from "redux";
// import * as serviceWorker from './serviceWorker';

let store = createStore(reducer)

ReactDOM.render(
    <Provider store={store}><App /></Provider>,
    document.getElementById('app')
);

// serviceWorker.unregister();
