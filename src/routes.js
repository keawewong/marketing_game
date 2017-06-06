import React from 'react'
import { Router, Route, hashHistory } from 'react-router'
import  { Whoops } from './components/ui/Whoops'
import  App from './components/App'

const routes = (
    <Router history={hashHistory}>
        <Route path="/" component={App} />
        <Route path="game" component={App}>
          <Route path=":deckID" component={App} />
        </Route>
        <Route path="*" component={Whoops} />
    </Router>
)

export default routes
