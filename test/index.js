import 'phantomjs-polyfill'
import reduxMount from '../index'

const { actions, reducer, selectors } = reduxMount
const state = {
  _mountKey: {
    mountedOn: 'test/route',
    routes: {
      'test/route': {
        prop1: 123,
        prop2: 'foobar',
      }
    }
  }
}

const reducerInitialState = {
  mountedOn: '',
  routes: {},
}

/**
 * Actions
 */
describe('actions', function() {
  describe('mount', function() {
    it('should create action with appropriate type', function() {
      const action = actions.mount('view/path')
      expect(action.type).toBe('redux-mount/MOUNT')
    })

    it('should set correct mountedOn key', function() {
      const action = actions.mount('users/test/new')
      expect(action.payload.mountOn).toBe('users/test/new')
    })

    it('should assign default initial value if it\'s not specified in argument', function() {
      const action = actions.mount('view/path')
      expect(action.payload.initData).toEqual({})
    })

    it('should assign initial value if it\'s passed as argument', function() {
      const action = actions.mount('view/path', { foo: 'bar' })
      expect(action.payload.initData).toEqual({ foo: 'bar' })
    })

  })

  describe('unmount', function() {
    it('should create action with appropriate type', function() {
      const action = actions.unmount()
      expect(action.type).toBe('redux-mount/UNMOUNT')
    })
  })
})

/**
 * Selector creators
 */
describe('selectors', function() {
  describe('mountedState', function() {
    it('should return correct route object', function() {
      expect(selectors.mountedState('_mountKey')(state)).toBe(state._mountKey.routes['test/route'])
    })
  })

  describe('mountedStateProp', function() {
    it('should return correct property from route object', function() {
      expect(selectors.mountedStateProp('_mountKey')(state)('prop1')).toBe(123)
      expect(selectors.mountedStateProp('_mountKey')(state)('prop2')).toBe('foobar')
    })
  })
})

/**
 * Reducer
 */
 describe('reducer', function() {
   describe('initial state', function() {
     it('should be correct', function() {
       expect(reducer(undefined, {})).toEqual(reducerInitialState)
     })
   })

   describe('mount action', function() {
     const testAction = {
        type: 'redux-mount/MOUNT',
        payload: {
          mountOn: 'user/create',
          initData: {
            loading: true,
          }
        }
     }

     it('should set mountedOn property to correct value', function() {
       expect(reducer(state._mountKey, testAction).mountedOn).toBe(testAction.payload.mountOn)
     })

     it('should set initial data', function() {
       expect(reducer(state._mountKey, testAction).routes[testAction.payload.mountOn]).toBe(testAction.payload.initData)
     })

     it('should not mutate state objects; should return newly created objects', function() {
       const newState = reducer(state._mountKey, testAction)
       expect(state._mountKey).not.toBe(newState)
       expect(state._mountKey.routes).not.toBe(newState.routes)
     })
   })

   describe('unmount action', function() {
     const defaultTestAction = {
        type: 'redux-mount/UNMOUNT',
     }

     it('should set up mountedOn key to empty string', function() {
       expect(reducer(state, defaultTestAction).mountedOn).toBe('')
     })

     it('should not mutate state objects; should return newly created object', function() {
       const newState = reducer(state._mountKey, defaultTestAction)
       expect(state._mountKey).not.toBe(newState)
       expect(state._mountKey.routes).not.toBe(newState.routes)
     })
   })

   describe('clear action', function() {
     it('should return previous state if module is not mounted', function() {
       const testAction = { type: 'redux-mount/CLEAR' }
       const testState = { mountedOn: '', routes: { foo: 'bar'} }

       expect(reducer(testState, testAction)).toBe(testState)
     })

    it('should clear value on mounted path', function() {
      const testAction = {
         type: 'redux-mount/CLEAR',
      }
      expect(reducer(state._mountKey, testAction).routes['test/route']).toEqual({})
    })
   })

   describe('set action', function() {
     const testAction = {
        type: 'redux-mount/SET',
        payload: {
          key: 'newProp',
          data: 'value to set',
        }
     }

     it('should throw when module is not mounted on any path', function() {
       expect(function(){ reducer({}, testAction) }).toThrow(new Error('redux-mount not mounted! Please mount before setting values'))
     })

     it('should set key on mounted path', function() {
       const newState = reducer(state._mountKey, testAction)
       expect(newState.routes[state._mountKey.mountedOn]).toEqual(
        {
          prop1: 123,
          prop2: 'foobar',
          newProp: 'value to set'
        }
       )
     })

     it('should not mutate state objects; should return newly created objects', function() {
       const newState = reducer(state._mountKey, testAction)
       expect(state._mountKey).not.toBe(newState)
       expect(state._mountKey.routes).not.toBe(newState.routes)
       expect(state._mountKey.routes[state._mountKey.mountedOn]).not.toBe(newState.routes[state._mountKey.mountedOn])
     })
   })
 })
