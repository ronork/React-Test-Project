import React from 'react';
import Posts from '../modules/Posts/components/Main';
import NoMatch from '../modules/NoMatch/main';
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
                <Route exact path="/posts">
                    <Posts />
                </Route>
                <Route path="*">
                    <NoMatch />
                </Route>
            </Switch>
        </Router>
    );
}

