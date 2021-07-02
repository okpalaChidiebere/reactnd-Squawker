import { RECEIVE_SQUAWKS, ADD_SQUAWK } from '../actions'

function squawks (state = [], action) {
  switch (action.type) {
    case RECEIVE_SQUAWKS:
      return action.squawks
    case ADD_SQUAWK:
      return [
        action.squawk,
        ...state,
      ]
    default:
      return state
  }
}

export default squawks