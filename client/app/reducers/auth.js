import { AUTH } from '../constants/ActionTypes'

const initialState = {
  completed: false,
  type:'auth'
}

export default function auth(state = initialState, action) {
  switch(action.type) {
    case AUTH.REQUEST:
      return Object.assign({}, state, initialState);
    case AUTH.SUCCESS:
      return Object.assign({}, state, {completed: true, actionType: action.actionType, userInfo: action.result, error:{}});
    case AUTH.FAILURE:
      return Object.assign({}, state, {completed: true, actionType: action.actionType, error: action.error});
    default:
      return state;
  }
}