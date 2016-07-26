import 'phantomjs-polyfill'
import { createStore, combineReducers } from 'redux'
import { reducer, actions, createSelector } from '../index'

const store = createStore(
  combineReducers({
    _mount: reducer,
  })
)

const mountedState = createSelector('_mount')

describe('redux integration', () => {
  it('should initialize with proper init values', () => {
    // initial state
    expect(store.getState()._mount).toEqual({
      mountedOn: '',
      routes: {},
    })
  })

  it('should mount empty obj by default', () => {
    // mount
    store.dispatch(actions.mount('/first-mount'))
    // read mounted values
    expect(mountedState(store.getState())).toEqual({})
    expect(store.getState()._mount.mountedOn).toBe('/first-mount')
  })

  it('should set value to currently mounted obj', () => {
    // set value
    store.dispatch(actions.set('foo', 'bar'))
    expect(mountedState(store.getState()).foo).toBe('bar')
  })

  it('should unmount and leave route values untouched', () => {
    // unmount
    store.dispatch(actions.unmount())
    expect(store.getState()._mount.mountedOn).toEqual('')
    // untouched values after unmount
    expect(store.getState()._mount.routes['/first-mount'].foo).toBe('bar')
  })

  it('should mount with initial data if passed', () => {
    // mount with initial data
    store.dispatch(actions.mount('another/route', {test: 1, test2: 2}))
    expect(mountedState(store.getState())).toEqual({test: 1, test2: 2})
  })

  it('should clear mounted values correctly', () => {
    // clear mounted values
    store.dispatch(actions.clear())
    expect(mountedState(store.getState())).toEqual({})
  })
})
