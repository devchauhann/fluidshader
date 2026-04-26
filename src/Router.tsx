/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import App from './App';
import {  Examples } from './pages';

export type RouteType = 'home' | 'examples';

interface RouterConfig {
    currentRoute: RouteType;
    setCurrentRoute: (route: RouteType) => void;
}

export function Router({ currentRoute, setCurrentRoute }: RouterConfig) {
    switch (currentRoute) {
        case 'home':
            return <App />;
        case 'examples':
            return <Examples />;
        default:
            return <App />;
    }
}

export default Router;
