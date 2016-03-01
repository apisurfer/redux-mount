# redux-mount

![current version](https://badge.fury.io/js/redux-mount.svg) ![dependencies status](https://david-dm.org/popc0rn/redux-mount.svg) ![build status](https://api.travis-ci.org/popc0rn/redux-mount.svg)

Set per-route data on-the-fly when component mounts. Set properties to update UI and optionally clear everything on component unmount.

Actions:
```javascript
import { combineReducers } from 'redux'
import { actions, reducer, selectors } from 'redux-mount'

const MOUNT_STATE_KEY = '_mount'

const appReducer = combineReducers({
  [MOUNT_STATE_KEY]: reducer,
  // your other reducers...
})

// create store with appReducer etc...

// mount on path
dispatch(actions.mount('user/new'))
// OR with initial data
dispatch(actions.mount('user/new'), { type: 'admin' })

// after mount, set/change properties with "set" action
dispatch(actions.set('foo', 'bar')

// clear currently mounted state to empty object
dispatch(actions.clear())

// unmount from the route; leave data as is
dispatch(actions.unmount())

// fetch currently mounted data
selectors.mountState(MOUNT_STATE_KEY)(appState)
// fetch currently selected data property
selectors.mountStateProp(MOUNT_STATE_KEY)(appState)('foo')
```
