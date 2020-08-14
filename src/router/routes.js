import React from 'react';
import Posts from '../modules/Posts/components/listing';
import NoMatch from '../modules/NoMatch/main';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";



export default function AppRouter() {
    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <Posts />
                </Route>
                <Route path="*">
                    <NoMatch />
                </Route>
            </Switch>
        </Router>
    );
}

