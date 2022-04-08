import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import './index.css';
import './theme.css';
import '@ionic/core/css/core.css';
import '@ionic/core/css/ionic.bundle.css';

ReactDOM.render(<App />, document.body);

chrome.tabs.query({ currentWindow: true, active: true}, tabs => tabs
    .filter(x => x.id !== undefined)
    .forEach(({ id }) =>
        chrome.tabs.sendMessage(id!, {
            method: 'getWish'
        }, res => console.log('response', res)))
);  