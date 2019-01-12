import * as ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {App2} from './App2';
import * as serviceWorker from './serviceWorker';
import * as React from 'react';
import { Application } from './components/dragAndDrop/Application';

ReactDOM.render(
    <div>
        {/* <App />,  */}
        <App2 app={ new Application()}/>
    </div>,

document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
