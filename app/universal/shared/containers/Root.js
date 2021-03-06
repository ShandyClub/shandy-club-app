import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import routes from '../../routes'
import configureStore from '../store/configureStore'
import rootSaga from '../sagas'

const store = configureStore()
store.runSaga(rootSaga)

const selectLocationState = state => state.get('routing')
const history = syncHistoryWithStore(browserHistory, store, { selectLocationState })

export default class Root extends Component {

  render() {

    return (
      <Provider store={store}>
        <Router routes={routes} history={history} />
      </Provider>
    )

  }

}
