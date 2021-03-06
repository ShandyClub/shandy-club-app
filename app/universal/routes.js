import React from 'react'
import { Route, IndexRoute } from 'react-router'

// containers
import App from './shared/containers/App'
import NotFound from './shared/containers/NotFound'
import * as Search from './search'
import * as Story from './story'

module.exports = (
  <Route path='/' component={App}>

    <IndexRoute component={Search.Container} />

    <Route path={Story.route} component={Story.Container} />

    {/* 404 */}
    <Route path='*' component={NotFound} />

  </Route>
)
