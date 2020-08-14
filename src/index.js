import { render } from 'react-dom';
import React from 'react';
import Posts from './modules/Posts/components/listing';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";



export default function App() {
    return (
        <Router>
            <Switch>
                <Route path="/">
                    <Posts />
                </Route>
            </Switch>
        </Router>
    );
}

render(<App />, document.getElementById('reactDiv'));