import { render } from 'react-dom';
import React from 'react';
import Router from './router/routes';

export default function App() {
    return (<>
        <Router />
    </>
    );
}

render(<App />, document.getElementById('reactDiv'));