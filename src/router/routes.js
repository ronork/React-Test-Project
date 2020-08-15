import React from 'react';
import Posts from '../modules/Posts/components/Main';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";


import { createBrowserHistory } from "history";

const history = createBrowserHistory();

export default function AppRouter() {
    return (
        <Router history={history}>
            <Switch>
                <Route exact path="/posts.html">
                    <Posts />
                </Route>
            </Switch>
        </Router>
    );
}

