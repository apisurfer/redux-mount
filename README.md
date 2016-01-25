# redux-mount

![build status](https://api.travis-ci.org/popc0rn/redux-mount.svg)

Allows setting per-route data that fastens up development. It's best to use it only with volatile data that is set and changed by individual views and not reused on other parts of application.

Actions:
```javascript
import { actions } from 'redux-mount'

// mount on path
dispatch(actions.mount('user/new'))
/*
state === {
  mountedOn: 'user/new',
  routes: {
    'user/new': {}
  }
}
*/

// unmount but leave mounted path values untouched
dispatch(actions.unmount())
/*
state === {
  mountedOn: '',
  routes: {
    'user/new': {}
  }
}
*/

// mount with default values
dispatch(actions.mount('user/new'), {foo: 'bar'})
/*
state === {
  mountedOn: 'user/new',
  routes: {
    'user/new': {foo: 'bar'}
  }
}
*/

// unmount and clear all data on mounted path
dispatch(actions.unmout(true))
/*
state === {
  mountedOn: '',
  routes: {
    'user/new': {}
  }
}
*/

// Setting properties on mounted path
dispatch(actions.mount('user/new'), {foo: 'bar'})
dispatch(actions.set('newProp', 'test'))
/*
state === {
  mountedOn: 'user/new',
  routes: {
    'user/new': {
      foo: 'bar',
      newProp: 'test'
    }
  }
}
*/

```
