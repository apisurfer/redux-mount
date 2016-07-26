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
 * Helper function that creates mount state selector
 */
export function createSelector(stateKey) {
  return state => state[stateKey].routes[state[stateKey].mountedOn]
}

export const actions = {
  mount,
  unmount,
  clear,
  set,
}

export default {
  reducer,
  actions,
  createSelector,
}
