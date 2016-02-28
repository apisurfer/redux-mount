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

    it('should make the initData parameter undefined if not passed as paramter of function call', function() {
      const action = actions.mount('view/path')
      expect(action.payload.initData).toEqual(undefined)
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
  describe('mountState', function() {
    it('should return correct route object', function() {
      expect(selectors.mountState('_mountKey')(state)).toBe(state._mountKey.routes['test/route'])
    })
  })

  describe('mountStateProp', function() {
    it('should return correct property from route object', function() {
      expect(selectors.mountStateProp('_mountKey')(state)('prop1')).toBe(123)
      expect(selectors.mountStateProp('_mountKey')(state)('prop2')).toBe('foobar')
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

     it('should set specified initial data', function() {
       expect(reducer(state._mountKey, testAction).routes[testAction.payload.mountOn]).toBe(testAction.payload.initData)
     })

     it('should set the intial data to empty obj if no data is provided and none exists from before', function() {
       const emptyDataAction = {
          type: 'redux-mount/MOUNT',
          payload: {
            mountOn: 'test/new',
            initData: undefined,
          }
       }

       const newState = reducer(reducerInitialState, emptyDataAction)

       expect(newState.routes[emptyDataAction.payload.mountOn]).toEqual({})
     })

     it('should respect and leave the previous data if mounted with empty data parameter', function() {
       const action = actions.mount('test/foobar')
       const prevState = {
         _mountKey: {
           mountedOn: '',
           routes: {
             'test/foobar': {
               prop1: 123,
               prop2: 'foobar',
             }
           }
         }
       }
       const newState = reducer(prevState._mountKey, action)

       expect(newState.routes['test/foobar']).toBe(prevState._mountKey.routes['test/foobar'])
     })

     it('should not mutate state objects; should return newly created objects', function() {
       const newState = reducer(state._mountKey, testAction)
       const mountOn = testAction.payload.mountOn

       expect(state._mountKey).not.toBe(newState)
       expect(state._mountKey.routes).not.toBe(newState.routes)
       expect(state._mountKey.routes[mountOn]).not.toBe(newState.routes[mountOn])
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

    it('should clear value to empty obj on mounted path', function() {
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
