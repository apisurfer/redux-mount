export const actionsTypes = {
  set: '@@redux-mount/SET',
  mount: '@@redux-mount/MOUNT',
  unmount: '@@redux-mount/UNMOUNT',
}

const initialState = {
  mountedOn: '',
  routes: {},
}

/**
 * ACTION CREATORS
 */
function mount(mountOn, initData = {}) {
  return {
    type: actionsTypes.mount,
    payload: {
      mountOn,
      initData,
    },
  }
}

function unmount(cleanupRouteData = false) {
  return {
    type: actionsTypes.unmount,
    payload: cleanupRouteData,
  }
}

function set(key, data) {
  return {
    type: actionsTypes.set,
    payload: {
      key,
      data,
    },
  }
}

/**
 * REDUCER
 */
export function reducer(state = initialState, action) {
  if (action.type === actionsTypes.mount) {
    const { mountOn, initData } = action.payload

    return {
      ...state,
      mountedOn: mountOn,
      routes: {
        ...state.routes,
        [mountOn]: initData,
      }
    }
  } else if (action.type === actionsTypes.unmount) {
    const wasMountedOn = state.mountedOn
    const newState = {
      ...state,
      mountedOn: '',
      routes: {
        ...state.routes,
      }
    }

    if (action.payload) {
      newState.routes[state.mountedOn] = {}
    }

    return newState

  } else if (action.type === actionsTypes.set) {
    const mountedOn = state.mountedOn
    if (!mountedOn) throw new Error('redux-mount not mounted! Please mount before setting values')
    const { key, data } = action.payload

    return {
      ...state,
      routes: {
        ...state.routes,
        [mountedOn]: {
          ...state.routes[mountedOn],
          [key]: data,
        }
      },
    }
  }

  return state
}

/**
 * Helper functions for selectors for route states
 */
function current(stateKey) {
  return state => {
    const mountedOn = state[stateKey].mountedOn
    return state[stateKey].routes[mountedOn]
  }
}

function currentKey(stateKey) {
  return state => key => {
    const mountedOn = state[stateKey].mountedOn

    if (!state[stateKey].routes[mountedOn]) {
      return undefined
    }

    return state[stateKey].routes[mountedOn][key]
  }
}

function currentIsSet(stateKey) {
  return state => !!current(stateKey)(state)
}


export const actions = {
  mount,
  unmount,
  set,
}

export const selectors = {
  current,
  currentKey,
  currentIsSet,
}

export default {
  reducer,
  actions,
  selectors,
}
