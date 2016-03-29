# redux-mount

![current version](https://badge.fury.io/js/redux-mount.svg) ![dependencies status](https://david-dm.org/popc0rn/redux-mount.svg) ![build status](https://api.travis-ci.org/popc0rn/redux-mount.svg)

Mount view-specific data on a path and change mounted values on the fly. No need to create
reducers, actions, or selectors yourself.

Single page apps often have views that depend on some kind of state to represent
their variations. Rest of the app might not care about that state.
Also, there might be a need to persist view-specific state while navigating through
the app. Handling this state results in a lot of boilerplate as most of it is often
repeated for every view.

redux-mount solves this by opinionated reducer, actions and selectors.

Actions:
```javascript
import { combineReducers } from 'redux'
import { actions, reducer, selectors } from 'redux-mount'

const WHATEVER_STATE_KEY = 'mount'

const mainReducer = combineReducers({
  [WHATEVER_STATE_KEY]: reducer,
  // your other reducers...
})

// create redux store with mainReducer etc...

// mount on path
dispatch(actions.mount('user/new'))
// OR with initial data
dispatch(actions.mount('user/new'), { type: 'administrator', name: 'John Doe' })

// after mount, every 'set' action works on the object
// under 'user/new' mount path; until we unmount
dispatch(actions.set('type', 'moderator')

// clear currently mounted state to an empty object -> {}
dispatch(actions.clear())

// unmount from the route; leaves mounted data as it was at the moment of unmount
dispatch(actions.unmount())

// "appState" represents your redux state object
// fetch currently mounted data
selectors.mountState(WHATEVER_STATE_KEY)(appState)
// fetch currently mounted data property
selectors.mountStateProp(WHATEVER_STATE_KEY)(appState)('type')
// or i.e.
const selectProperty = selectors.mountStateProp(WHATEVER_STATE_KEY)
const type = selectProperty(appState)('type')
```
