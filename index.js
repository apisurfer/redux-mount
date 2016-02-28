export const actionsTypes = {
  set: 'redux-mount/SET',
  mount: 'redux-mount/MOUNT',
  unmount: 'redux-mount/UNMOUNT',
  clear: 'redux-mount/CLEAR',
}

const initialState = {
  mountedOn: '',
  routes: {},
}

/**
 * ACTION CREATORS
 */
function mount(mountOn, initData) {
  return {
    type: actionsTypes.mount,
    payload: {
      mountOn,
      initData,
    },
  }
}

function unmount() {
  return {
    type: actionsTypes.unmount,
  }
}

function clear() {
  return {
    type: actionsTypes.clear,
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
    const previousData = state.routes[mountOn]

    return {
      ...state,
      mountedOn: mountOn,
      routes: {
        ...state.routes,
        [mountOn]: initData ? initData : previousData || {},
      }
    }

  } else if (action.type === actionsTypes.unmount) {
    const wasMountedOn = state.mountedOn
    return {
      ...state,
      mountedOn: '',
      routes: {
        ...state.routes,
      }
    }

  } else if (action.type === actionsTypes.clear) {
    if (state.mountedOn) {
      return {
        ...state,
        routes: {
          ...state.routes,
          [state.mountedOn]: {},
        }
      }

    } else {
      return state
    }

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
 * Helper functions that create selectors for route state and props
 */
function mountedState(stateKey) {
  return state => {
    const mountedOn = state[stateKey].mountedOn
    return state[stateKey].routes[mountedOn]
  }
}

function mountedStateProp(stateKey) {
  return state => key => {
    const mountedOn = state[stateKey].mountedOn

    if (!state[stateKey].routes[mountedOn]) {
      return undefined
    }

    return state[stateKey].routes[mountedOn][key]
  }
}

export const actions = {
  mount,
  unmount,
  set,
}

export const selectors = {
  mountedState,
  mountedStateProp,
}

export default {
  reducer,
  actions,
  selectors,
}
